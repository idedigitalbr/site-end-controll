export function isCmsAdmin(role: string | undefined | null): boolean {
  return role === "admin";
}

export function isCmsEditor(role: string | undefined | null): boolean {
  return role === "admin" || role === "editor";
}
