import assert from "node:assert/strict";
import test from "node:test";

import {
  TASK_STATUS,
  getCategoryChartData,
  getCategoryCounts,
  getCompletionPerformance,
  getPerformanceChartData,
  getStatusChartData,
  getTaskStatusCounts,
  getTaskSummary,
  getTodayDateKey,
  isTaskOverdue,
  normalizeStatus,
} from "../src/utils/taskCalculations.js";

test("normalizeStatus accepts common variants", () => {
  assert.equal(normalizeStatus("TODO"), TASK_STATUS.TODO);
  assert.equal(normalizeStatus("to do"), TASK_STATUS.TODO);
  assert.equal(normalizeStatus("to-do"), TASK_STATUS.TODO);
  assert.equal(normalizeStatus("to_do"), TASK_STATUS.TODO);
  assert.equal(normalizeStatus(" in progress "), TASK_STATUS.DOING);
  assert.equal(normalizeStatus("Completed"), TASK_STATUS.DONE);
  assert.equal(normalizeStatus(null), "");
});

test("getTaskStatusCounts and status chart data use canonical statuses", () => {
  const tasks = [
    { status: "TO DO" },
    { status: "TODO" },
    { status: "doing" },
    { status: "DONE" },
    { status: "blocked" },
  ];

  assert.deepEqual(getTaskStatusCounts(tasks), {
    TODO: 2,
    DOING: 1,
    DONE: 1,
  });
  assert.deepEqual(getStatusChartData(tasks), {
    labels: ["TO DO", "DOING", "DONE"],
    data: [2, 1, 1],
  });
});

test("overdue means due date passed and status is not DONE", () => {
  const today = "2026-08-21";

  assert.equal(
    isTaskOverdue({ dueDate: "2026-08-20", status: "TODO" }, today),
    true,
  );
  assert.equal(
    isTaskOverdue({ dueDate: "2026-08-21", status: "DOING" }, today),
    false,
  );
  assert.equal(
    isTaskOverdue({ dueDate: "2026-08-20", status: "DONE" }, today),
    false,
  );
  assert.equal(
    isTaskOverdue({ dueDate: "not-a-date", status: "TODO" }, today),
    false,
  );
});

test("getTaskSummary returns all five dashboard card values", () => {
  const tasks = [
    { status: "TO DO", dueDate: "2026-08-19" },
    { status: "DOING", dueDate: "2026-08-21" },
    { status: "DONE", dueDate: "2026-08-01" },
    { status: "TODO", dueDate: "2026-08-22" },
  ];

  assert.deepEqual(getTaskSummary(tasks, "2026-08-21"), {
    total: 4,
    todo: 2,
    doing: 1,
    done: 1,
    overdue: 1,
  });
});

test("category helpers trim, sort, and count category values", () => {
  const tasks = [
    { category: "Development" },
    { category: " Design " },
    { category: { name: "Development" } },
    { category: "" },
  ];

  assert.deepEqual(getCategoryCounts(tasks), {
    Design: 1,
    Development: 2,
    Uncategorized: 1,
  });
  assert.deepEqual(getCategoryChartData(tasks), {
    labels: ["Design", "Development", "Uncategorized"],
    data: [1, 2, 1],
  });
});

test("completion performance compares only valid DONE task date keys", () => {
  const tasks = [
    { status: "DONE", dueDate: "2026-08-10", completeDate: "2026-08-09" },
    { status: "completed", dueDate: "2026-08-10", completeDate: "2026-08-10" },
    { status: "DONE", dueDate: "2026-08-10", completeDate: "2026-08-11" },
    { status: "DOING", dueDate: "2026-08-10", completeDate: "2026-08-09" },
    { status: "DONE", dueDate: "2026-02-30", completeDate: "2026-02-28" },
    { status: "DONE", dueDate: "2026-08-10", completeDate: "" },
  ];

  assert.deepEqual(getCompletionPerformance(tasks), {
    early: 1,
    onTime: 1,
    late: 1,
  });
  assert.deepEqual(getPerformanceChartData(tasks), {
    labels: ["Early", "On Time", "Late"],
    data: [1, 1, 1],
  });
});

test("date and collection helpers reject invalid input safely", () => {
  assert.equal(getTodayDateKey("2024-02-29"), "2024-02-29");
  assert.throws(() => getTodayDateKey("2026-02-29"), TypeError);
  assert.deepEqual(getTaskSummary(undefined, "2026-08-21"), {
    total: 0,
    todo: 0,
    doing: 0,
    done: 0,
    overdue: 0,
  });
});
