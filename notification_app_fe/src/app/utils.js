export const API_BASE_URL = "/api";

export async function Log(stack, level, pkg, message) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (error) {
    console.error("Logger dispatch failure:", error.message);
  }
}

const PRIORITY_MAP = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};

export function getPriorityNotifications(notifications, limit = 10) {
  if (!notifications || !Array.isArray(notifications)) return [];

  return [...notifications]
    .sort((a, b) => {
      const weightA = PRIORITY_MAP[a.Type] || 0;
      const weightB = PRIORITY_MAP[b.Type] || 0;

      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, limit);
}