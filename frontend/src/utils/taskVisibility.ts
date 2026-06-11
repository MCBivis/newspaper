import type { AppUser, TaskRecord } from "@/types/task";

export function isSameUser(
  user: AppUser | null | undefined,
  identity: { id?: number | string } | null | undefined,
): boolean {
  return Boolean(
    user?.id && identity?.id && String(user.id) === String(identity.id),
  );
}

type TaskVisibilityContext = {
  isSuperAdmin: boolean;
  isEditor: boolean;
  isAuthor: boolean;
  isIllustrator: boolean;
  isAdvertiser: boolean;
};

export function filterVisibleTasks(
  tasks: TaskRecord[],
  identity: { id?: number | string } | null | undefined,
  context: TaskVisibilityContext,
): TaskRecord[] {
  const { isSuperAdmin, isEditor, isAuthor, isIllustrator, isAdvertiser } =
    context;

  if (isSuperAdmin) return tasks;

  return tasks.filter((task) => {
    const responsibleEditor = task.newspaper?.responsibleEditor;
    if (isEditor && (!responsibleEditor || isSameUser(responsibleEditor, identity))) {
      return true;
    }

    if (
      (isAuthor || isIllustrator || isAdvertiser) &&
      isSameUser(task.assignee, identity)
    ) {
      return true;
    }

    return false;
  });
}

export function getVisibleIssueTasks(
  tasks: TaskRecord[],
  identity: { id?: number | string } | null | undefined,
  context: Pick<TaskVisibilityContext, "isSuperAdmin" | "isEditor">,
): TaskRecord[] {
  const { isSuperAdmin, isEditor } = context;

  if (isSuperAdmin || isEditor) {
    return tasks;
  }

  return tasks.filter((task) => isSameUser(task.assignee, identity));
}

export function canAccessIssueSummary(
  tasks: TaskRecord[],
  identity: { id?: number | string } | null | undefined,
  context: TaskVisibilityContext,
): boolean {
  const { isSuperAdmin, isEditor } = context;

  if (isSuperAdmin || isEditor) {
    return true;
  }

  return getVisibleIssueTasks(tasks, identity, { isSuperAdmin, isEditor }).length > 0;
}
