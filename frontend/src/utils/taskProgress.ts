import type { TaskRecord } from "@/types/task";

export function getTaskProgress(tasks: TaskRecord[] | undefined | null) {
  const list = tasks ?? [];
  const total = list.length;
  const completed = list.filter((task) => task.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, percent };
}

export function getProgressStrokeColor(percent: number): string {
  if (percent === 0) return "#d9d9d9";
  if (percent < 34) return "#ff4d4f";
  if (percent < 67) return "#faad14";
  if (percent < 100) return "#1677ff";
  return "#52c41a";
}
