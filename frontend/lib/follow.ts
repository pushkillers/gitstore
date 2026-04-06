const FOLLOWS_KEY = "gitstore.following";
const FOLLOW_EVENT = "gitstore.follow.change";

export function getFollowing(): string[] {
  try {
    const raw = localStorage.getItem(FOLLOWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function isFollowing(username: string): boolean {
  return getFollowing().includes(username);
}

export function toggleFollow(username: string): boolean {
  const following = getFollowing();
  const already = following.includes(username);
  const updated = already
    ? following.filter((u) => u !== username)
    : [...following, username];
  localStorage.setItem(FOLLOWS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(FOLLOW_EVENT));
  return !already;
}

export const FOLLOW_EVENT_NAME = FOLLOW_EVENT;
