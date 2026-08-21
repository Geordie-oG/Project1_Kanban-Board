export const TASK_STATUS = Object.freeze({
  TODO: "TODO",
  DOING: "DOING",
  DONE: "DONE",
});

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function getTasks(tasks) {
  if (!Array.isArray(tasks)) {
    return [];
  }

  return tasks.filter(
    (task) => task !== null && typeof task === "object" && !Array.isArray(task),
  );
}

function getDateKey(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    const year = String(value.getFullYear()).padStart(4, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (typeof value !== "string") {
    return null;
  }

  const dateKey = value.trim();
  const match = ISO_DATE_PATTERN.exec(dateKey);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsed = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return dateKey;
}

/**
 * Normalizes values used by forms, Local Storage, or imported seed data to the
 * three statuses used throughout the app.
 */
export function normalizeStatus(status) {
  if (status === null || status === undefined) {
    return "";
  }

  const original = String(status).trim().toUpperCase();
  const compact = original.replace(/[\s_-]+/g, "");

  if (compact === "TODO") {
    return TASK_STATUS.TODO;
  }

  if (compact === "DOING" || compact === "INPROGRESS") {
    return TASK_STATUS.DOING;
  }

  if (["DONE", "COMPLETE", "COMPLETED"].includes(compact)) {
    return TASK_STATUS.DONE;
  }

  return original;
}

/**
 * Returns a local-calendar date in the same YYYY-MM-DD format as an HTML date
 * input. A supplied string must already be a valid YYYY-MM-DD value.
 */
export function getTodayDateKey(today = new Date()) {
  const dateKey = getDateKey(today);

  if (!dateKey) {
    throw new TypeError("Expected a valid Date or a YYYY-MM-DD date string.");
  }

  return dateKey;
}

/**
 * A task is overdue only after its due date has passed and while it is not DONE.
 */
export function isTaskOverdue(task, today = new Date()) {
  if (!task || typeof task !== "object" || Array.isArray(task)) {
    return false;
  }

  if (normalizeStatus(task.status) === TASK_STATUS.DONE) {
    return false;
  }

  const dueDate = getDateKey(task.dueDate);
  if (!dueDate) {
    return false;
  }

  return dueDate < getTodayDateKey(today);
}

export function getTaskStatusCounts(tasks) {
  const counts = {
    [TASK_STATUS.TODO]: 0,
    [TASK_STATUS.DOING]: 0,
    [TASK_STATUS.DONE]: 0,
  };

  for (const task of getTasks(tasks)) {
    const status = normalizeStatus(task.status);
    if (Object.hasOwn(counts, status)) {
      counts[status] += 1;
    }
  }

  return counts;
}

export function getTaskSummary(tasks, today = new Date()) {
  const validTasks = getTasks(tasks);
  const statusCounts = getTaskStatusCounts(validTasks);

  return {
    total: validTasks.length,
    todo: statusCounts[TASK_STATUS.TODO],
    doing: statusCounts[TASK_STATUS.DOING],
    done: statusCounts[TASK_STATUS.DONE],
    overdue: validTasks.filter((task) => isTaskOverdue(task, today)).length,
  };
}

export function getStatusChartData(tasks) {
  const counts = getTaskStatusCounts(tasks);

  return {
    labels: ["TO DO", "DOING", "DONE"],
    data: [
      counts[TASK_STATUS.TODO],
      counts[TASK_STATUS.DOING],
      counts[TASK_STATUS.DONE],
    ],
  };
}

function getCategoryName(task) {
  if (typeof task.category === "string" && task.category.trim()) {
    return task.category.trim();
  }

  if (
    task.category &&
    typeof task.category === "object" &&
    typeof task.category.name === "string" &&
    task.category.name.trim()
  ) {
    return task.category.name.trim();
  }

  return "Uncategorized";
}

export function getCategoryCounts(tasks) {
  const counts = {};

  for (const task of getTasks(tasks)) {
    const category = getCategoryName(task);
    counts[category] = (counts[category] ?? 0) + 1;
  }

  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) =>
      left.localeCompare(right, undefined, { sensitivity: "base" }),
    ),
  );
}

export function getCategoryChartData(tasks) {
  const entries = Object.entries(getCategoryCounts(tasks));

  return {
    labels: entries.map(([category]) => category),
    data: entries.map(([, count]) => count),
  };
}

/**
 * Counts only completed tasks that have valid due and completion dates.
 */
export function getCompletionPerformance(tasks) {
  const performance = {
    early: 0,
    onTime: 0,
    late: 0,
  };

  for (const task of getTasks(tasks)) {
    if (normalizeStatus(task.status) !== TASK_STATUS.DONE) {
      continue;
    }

    const dueDate = getDateKey(task.dueDate);
    const completeDate = getDateKey(task.completeDate);

    if (!dueDate || !completeDate) {
      continue;
    }

    if (completeDate < dueDate) {
      performance.early += 1;
    } else if (completeDate === dueDate) {
      performance.onTime += 1;
    } else {
      performance.late += 1;
    }
  }

  return performance;
}

export function getPerformanceChartData(tasks) {
  const performance = getCompletionPerformance(tasks);

  return {
    labels: ["Early", "On Time", "Late"],
    data: [performance.early, performance.onTime, performance.late],
  };
}
