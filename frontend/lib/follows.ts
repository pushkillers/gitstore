const KEY = "gitstore.following";
const EVENT = "gitstore.follows.change";

export function getFollowing(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch { return []; }
}

export function isFollowing(username: string): boolean {
  return getFollowing().includes(username);
}

export function toggleFollow(username: string): boolean {
  const list = getFollowing();
  const following = list.includes(username);
  const updated = following
    ? list.filter((u) => u !== username)
    : [...list, username];
  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(EVENT));
  return !following;
}

export const FOLLOWS_EVENT = EVENT;
