export function hasPermission(permissionKey: string) {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const permissions = user.permissions || [];
  return permissions.includes(permissionKey);
}

export function hasAnyPermission(list: string[]) {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const permissions = user.permissions || [];
  return list.some(p => permissions.includes(p));
}
