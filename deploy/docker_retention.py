#!/usr/bin/env python3
"""Project-scoped image retention. Plan by default; never prune volumes or containers."""
from __future__ import annotations

import argparse
import contextlib
import datetime as dt
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass

PROJECT_LABEL = 'io.idedigital.deploy.project'
RELEASE_LABEL = 'io.idedigital.deploy.release'
MUTABLE_TAGS = {'latest', 'main', 'master', 'production', 'prod', 'stable', 'dev', 'previous', 'rollback'}
IMAGE_FORMAT = ('{"id":{{json .Id}},"created":{{json .Created}},'
                '"tags":{{json .RepoTags}},"labels":{{json (index .Config "Labels")}}}')


@dataclass(frozen=True)
class Image:
    id: str
    tags: tuple[str, ...]
    created: float
    project: str = ''
    release: str = ''


class Docker:
    def run(self, *args: str) -> str:
        result = subprocess.run(['docker', *args], capture_output=True, text=True, timeout=120)
        if result.returncode:
            # Do not dump inspect payloads or environment/configuration to logs.
            raise RuntimeError(f'Docker command failed: {args[0]} {args[1] if len(args) > 1 else ""}')
        return result.stdout.strip()

    def inspect_images(self, references: list[str]) -> list[Image]:
        images = []
        for start in range(0, len(references), 50):
            output = self.run('image', 'inspect', '--format', IMAGE_FORMAT, *references[start:start + 50])
            for line in output.splitlines():
                item = json.loads(line)
                labels = item.get('labels') or {}
                images.append(Image(item['id'], tuple(item.get('tags') or []),
                                    dt.datetime.fromisoformat(item['created'].replace('Z', '+00:00')).timestamp(),
                                    labels.get(PROJECT_LABEL, ''), labels.get(RELEASE_LABEL, '')))
        return images

    def images(self) -> list[Image]:
        ids = sorted(set(self.run('image', 'ls', '--all', '--quiet', '--no-trunc').splitlines()))
        return self.inspect_images(ids) if ids else []

    def container_images(self) -> set[str]:
        ids = self.run('container', 'ls', '--all', '--quiet', '--no-trunc').splitlines()
        used = set()
        for start in range(0, len(ids), 50):
            used.update(self.run('container', 'inspect', '--format', '{{.Image}}', *ids[start:start + 50]).splitlines())
        return used

    def require_healthy(self, names: list[str], active_ids: set[str]) -> None:
        for name in names:
            state = self.run('container', 'inspect', '--format',
                             '{{.State.Status}}|{{with index .State "Health"}}{{.Status}}{{else}}none{{end}}|{{.Image}}', name)
            status, health, image_id = state.split('|')
            if status != 'running' or health not in {'healthy', 'none'} or image_id not in active_ids:
                raise RuntimeError(f'Cleanup refused: active container {name} is not ready on the expected release')


def split_ref(reference: str) -> tuple[str, str]:
    repo, separator, tag = reference.rpartition(':')
    if not separator:
        return reference, ''
    return repo, tag


def managed_ref(reference: str, options: argparse.Namespace) -> bool:
    repo, tag = split_ref(reference)
    return repo in options.repository and tag not in MUTABLE_TAGS and bool(re.fullmatch(options.release_regex, tag))


def make_plan(images: list[Image], used: set[str], options: argparse.Namespace) -> dict:
    refs = {ref: image for image in images for ref in image.tags if managed_ref(ref, options)}
    missing = [f'{repo}:{options.active_tag}' for repo in options.repository
               if f'{repo}:{options.active_tag}' not in refs]
    if missing:
        raise RuntimeError('Cleanup refused: active image missing for ' + ', '.join(missing))
    if any(image.project and image.project != options.project for image in refs.values()):
        raise RuntimeError('Cleanup refused: repository contains images labeled for a different project')
    timestamps: dict[str, float] = {}
    for ref, image in refs.items():
        tag = split_ref(ref)[1]
        timestamps[tag] = max(timestamps.get(tag, 0), image.created)
    complete = {tag for tag in timestamps if all(f'{repo}:{tag}' in refs for repo in options.repository)}
    retained = {options.active_tag, *options.protect_tag}
    for tag in sorted(complete, key=lambda t: (timestamps[t], t), reverse=True):
        if len(retained & complete) >= options.keep_releases:
            break
        retained.add(tag)
    # Legacy/manual deletion may leave partial releases. Preserve their latest
    # surviving images too, and refuse destructive cleanup without one full rollback.
    for tag in sorted(timestamps, key=lambda t: (timestamps[t], t), reverse=True):
        if len(retained & timestamps.keys()) >= options.keep_releases:
            break
        retained.add(tag)
    protected_ids = {image.id for ref, image in refs.items() if split_ref(ref)[1] in retained} | used
    cutoff = dt.datetime.now(dt.timezone.utc).timestamp() - options.min_age_hours * 3600
    candidates = []
    for image in images:
        if image.id in protected_ids or image.created > cutoff:
            continue
        # Shared tags/unknown aliases are preserved conservatively.
        if image.tags:
            if any(not managed_ref(ref, options) for ref in image.tags):
                continue
            for ref in image.tags:
                if split_ref(ref)[1] not in retained:
                    candidates.append({'reference': ref, 'id': image.id, 'kind': 'tag'})
        elif image.project == options.project and image.release not in retained and re.fullmatch(options.release_regex, image.release):
            candidates.append({'reference': image.id, 'id': image.id, 'kind': 'owned-dangling'})
    blockers = ['Fewer than two complete releases exist; recover a rollback or deploy another healthy release first.'] if candidates and len(complete) < 2 else []
    return {'project': options.project, 'repositories': sorted(options.repository),
            'active_tag': options.active_tag, 'retained_releases': sorted(retained),
            'complete_release_count': len(complete),
            'incomplete_retained_releases': sorted((retained & timestamps.keys()) - complete),
            'apply_blockers': blockers,
            'container_referenced_image_count': len(used),
            'candidates': sorted(candidates, key=lambda c: c['reference'])}


def apply_plan(docker: Docker, plan: dict, options: argparse.Namespace) -> dict:
    removed, skipped, errors = [], [], []
    if plan.get('apply_blockers'):
        return {'removed': [], 'skipped_after_recheck': [], 'errors': plan['apply_blockers']}
    for candidate in plan['candidates']:
        try:
            active = docker.inspect_images([f'{repo}:{options.active_tag}' for repo in options.repository])
            docker.require_healthy(options.health_container, {image.id for image in active})
            current = docker.inspect_images([candidate['reference']])[0]
            protected_now = current.id in docker.container_images()
            protected_now |= any(split_ref(ref)[1] in plan['retained_releases'] for ref in current.tags)
            protected_now |= any(not managed_ref(ref, options) for ref in current.tags)
            protected_now |= bool(current.project and current.project != options.project)
            if candidate['kind'] == 'owned-dangling':
                protected_now |= bool(current.tags) or current.project != options.project or current.release in plan['retained_releases']
            if current.id != candidate['id'] or protected_now:
                skipped.append(candidate['reference'])
                continue
            docker.run('image', 'rm', '--no-prune', candidate['reference'])
            removed.append(candidate['reference'])
        except (RuntimeError, IndexError):
            # On drift, missing images, or Docker failure, keep resources and report.
            errors.append(candidate['reference'])
            break
    return {'removed': removed, 'skipped_after_recheck': skipped, 'errors': errors}


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', required=True)
    parser.add_argument('--repository', action='append', required=True, help='Exact repository; repeat for app/worker images')
    parser.add_argument('--active-tag', required=True)
    parser.add_argument('--protect-tag', action='append', default=[])
    parser.add_argument('--keep-releases', type=int, default=3, help='Total retained complete releases, including active (minimum 2)')
    parser.add_argument('--release-regex', default=r'[0-9a-f]{40}', help='Full match for immutable release tags')
    parser.add_argument('--min-age-hours', type=float, default=0)
    parser.add_argument('--health-container', action='append', default=[])
    parser.add_argument('--apply', action='store_true', help='Remove only planned/rechecked images; otherwise print plan')
    options = parser.parse_args(argv)
    if not re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,62}', options.project):
        parser.error('project must be a lowercase Compose slug of 1-63 characters')
    if any(not re.fullmatch(r'[a-z0-9][a-z0-9._:/-]*', repo) or ':' in repo.rsplit('/', 1)[-1] or '*' in repo or '@' in repo for repo in options.repository):
        parser.error('repository must be an exact Docker repository without tags, globs, or digests')
    try:
        pattern = re.compile(options.release_regex)
    except re.error:
        parser.error('invalid release regex')
    if options.keep_releases < 2 or options.min_age_hours < 0:
        parser.error('keep-releases must be >= 2 and min-age-hours >= 0')
    for tag in [options.active_tag, *options.protect_tag]:
        if not re.fullmatch(r'[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}', tag) or tag in MUTABLE_TAGS or not pattern.fullmatch(tag):
            parser.error('active/protected tags must be immutable release identifiers matching release-regex')
    if options.apply and (not options.health_container or os.name != 'posix'):
        parser.error('apply requires Linux/Unix and at least one health-container')
    options.repository = sorted(set(options.repository))
    return options


@contextlib.contextmanager
def cleanup_lock(options: argparse.Namespace):
    if os.name != 'posix':
        yield
        return
    import fcntl
    identity = hashlib.sha256(options.project.encode()).hexdigest()[:16]
    path = os.path.join(tempfile.gettempdir(), f'docker-retention-{identity}.lock')
    fd = os.open(path, os.O_CREAT | os.O_RDWR | getattr(os, 'O_NOFOLLOW', 0), 0o600)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        yield
    finally:
        os.close(fd)


def main(argv: list[str] | None = None) -> int:
    options = parse_args(argv)
    try:
        with cleanup_lock(options):
            docker = Docker()
            images = docker.images()
            plan = make_plan(images, docker.container_images(), options)
            active_ids = {image.id for image in images if any(ref == f'{repo}:{options.active_tag}'
                          for ref in image.tags for repo in options.repository)}
            docker.require_healthy(options.health_container, active_ids)
            print(json.dumps({'mode': 'apply' if options.apply else 'plan', **plan}, indent=2))
            if options.apply:
                result = apply_plan(docker, plan, options)
                print(json.dumps(result, indent=2))
                return 1 if result['errors'] else 0
            return 0
    except (RuntimeError, ValueError, OSError, subprocess.TimeoutExpired) as error:
        print(f'Cleanup stopped without broad pruning: {type(error).__name__}: {error}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
