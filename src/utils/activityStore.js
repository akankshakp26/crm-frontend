const KEY = "crm_activity_logs";

export const getActivityLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const addActivityLog = (text, type = "note") => {
  const logs = getActivityLogs();

  const newLog = {
    id: Date.now(),
    text,
    type,
    createdAt: new Date().toISOString(),
  };

  const updated = [newLog, ...logs].slice(0, 5); // keep last 5
  localStorage.setItem(KEY, JSON.stringify(updated));
};