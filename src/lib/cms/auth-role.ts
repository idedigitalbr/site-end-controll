export type CmsSessionUserLike = {
  role?: string | null;
  banned?: boolean | null;
  banExpires?: Date | string | null;
};

export function isCmsAdmin(role: string | undefined | null): boolean {
  return role === "admin";
}

export function isCmsEditor(role: string | undefined | null): boolean {
  return role === "admin" || role === "editor";
}

export function isCmsUserActive(user: CmsSessionUserLike | null | undefined): boolean {
  if (!user) return false;
  if (user.banned !== true) return true;
  if (!user.banExpires) return false;
  const expiresMs =
    user.banExpires instanceof Date
      ? user.banExpires.getTime()
      : Date.parse(String(user.banExpires));
  if (!Number.isFinite(expiresMs)) return false;
  return expiresMs <= Date.now();
}

export function canAccessCmsAdmin(user: CmsSessionUserLike | null | undefined): boolean {
  return isCmsUserActive(user) && isCmsAdmin(user?.role);
}

export function canAccessCmsEditor(user: CmsSessionUserLike | null | undefined): boolean {
  return isCmsUserActive(user) && isCmsEditor(user?.role);
}
