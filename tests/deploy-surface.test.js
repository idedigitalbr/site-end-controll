const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const dockerignore = fs.readFileSync(path.join(root, '.dockerignore'), 'utf8');
const dockerignoreLines = dockerignore.split(/\r?\n/);

test('excludes internal documentation and test artifacts from the Docker context', () => {
  const requiredPatterns = [
    'MD/',
    'docs/',
    'tests/',
    '*.md',
    '*.docx',
    '*.pdf',
    '*.txt',
    '*.ps1',
    'backup-secao-cta-final.html',
    'componentes-cards-.html',
    'identidade-visual.html'
  ];

  for (const pattern of requiredPatterns) {
    assert.ok(dockerignoreLines.includes(pattern), `.dockerignore precisa excluir ${pattern}`);
  }
});
