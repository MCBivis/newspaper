"use client";

import { EditButton, List, useTable } from "@refinedev/antd";
import { useGetIdentity, useUpdate } from "@refinedev/core";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useRoleAccess } from "@hooks/useRoleAccess";
import type { AppUser, TaskDialogueEntry, TaskRecord, TaskStatus } from "@/types/task";

const statusColumns: Array<{ key: TaskStatus; title: string; color: string }> = [
  { key: "todo", title: "To do", color: "default" },
  { key: "doing", title: "Doing", color: "processing" },
  { key: "review", title: "Review", color: "warning" },
  { key: "completed", title: "Completed", color: "success" },
];

const relationsQuery = {
  populate: {
    newspaper: {
      populate: {
        responsibleEditor: {
          populate: ["role"],
        },
      },
    },
    issue: "*",
    assignee: {
      populate: ["role"],
    },
    articles: "*",
    photos: "*",
    advertisments: "*",
  },
};

function isSameUser(user: AppUser | null | undefined, identity: any) {
  return Boolean(user?.id && identity?.id && String(user.id) === String(identity.id));
}

function appendDialogue(
  task: TaskRecord,
  identity: any,
  message: string,
  nextStatus: TaskStatus
): TaskDialogueEntry[] {
  return [
    ...(Array.isArray(task.dialogue) ? task.dialogue : []),
    {
      author: identity?.username || "User",
      role: identity?.role?.name,
      message,
      status: nextStatus,
      createdAt: new Date().toISOString(),
    },
  ];
}

export default function TaskList() {
  const router = useRouter();
  const { data: identity } = useGetIdentity<any>();
  const {
    isSuperAdmin,
    isEditor,
    isAuthor,
    isIllustrator,
    isAdvertiser,
    canCreateTasks,
    canManageTasks,
    canReviewTasks,
  } = useRoleAccess();
  const { mutate: updateTask, isLoading: isUpdating } = useUpdate();

  const { tableProps, tableQueryResult } = useTable<TaskRecord>({
    resource: "tasks",
    syncWithLocation: true,
    pagination: {
      pageSize: 100,
    },
    sorters: {
      initial: [{ field: "deadline", order: "asc" }],
    },
    meta: relationsQuery,
  });

  const visibleTasks = useMemo(() => {
    const tasks = (tableProps.dataSource || []) as TaskRecord[];

    if (isSuperAdmin) return tasks;

    return tasks.filter((task) => {
      const responsibleEditor = task.newspaper?.responsibleEditor;
      if (isEditor && (!responsibleEditor || isSameUser(responsibleEditor, identity))) {
        return true;
      }

      if ((isAuthor || isIllustrator || isAdvertiser) && isSameUser(task.assignee, identity)) {
        return true;
      }

      return false;
    });
  }, [
    identity,
    isAdvertiser,
    isAuthor,
    isEditor,
    isIllustrator,
    isSuperAdmin,
    tableProps.dataSource,
  ]);

  const moveTask = (task: TaskRecord, status: TaskStatus, message: string) => {
    updateTask(
      {
        resource: "tasks",
        id: task.id,
        values: {
          status,
          dialogue: appendDialogue(task, identity, message, status),
        },
      },
      {
        onSuccess: () => tableQueryResult.refetch(),
      }
    );
  };

  return (
    <List
      title="Задачи"
      createButtonProps={{
        children: "Создать задачу",
        style: { display: canCreateTasks ? "inline-flex" : "none" },
      }}
    >
      <Row gutter={[16, 16]}>
        {statusColumns.map((column) => (
          <Col xs={24} md={12} xl={6} key={column.key}>
            <Card
              title={
                <Space>
                  <Tag color={column.color}>{column.title}</Tag>
                  <Typography.Text type="secondary">
                    {visibleTasks.filter((task) => task.status === column.key).length}
                  </Typography.Text>
                </Space>
              }
              style={{ minHeight: 520 }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {visibleTasks
                  .filter((task) => task.status === column.key)
                  .map((task) => {
                    const isAssignee = isSameUser(task.assignee, identity);
                    const isResponsibleEditor = isSameUser(
                      task.newspaper?.responsibleEditor,
                      identity
                    );
                    const assigneeCanMove = isSuperAdmin || isAssignee;
                    const editorCanReview =
                      canReviewTasks &&
                      (isSuperAdmin ||
                        isResponsibleEditor ||
                        !task.newspaper?.responsibleEditor);

                    return (
                      <Card key={task.id} size="small" title={task.name}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Typography.Paragraph ellipsis={{ rows: 3 }}>
                            {task.description || "Без описания"}
                          </Typography.Paragraph>
                          <div>
                            <Tag>{task.taskType || "other"}</Tag>
                            {task.deadline && (
                              <Tag color="red">
                                {new Date(task.deadline).toLocaleString("ru-RU")}
                              </Tag>
                            )}
                          </div>
                          <Typography.Text type="secondary">
                            Газета: {task.newspaper?.name || "-"}
                          </Typography.Text>
                          <Typography.Text type="secondary">
                            Исполнитель: {task.assignee?.username || "-"}
                          </Typography.Text>
                          <Space wrap>
                            <Button
                              size="small"
                              onClick={() => router.push(`/tasks/show/${task.id}`)}
                            >
                              Открыть
                            </Button>
                            {canManageTasks && (
                              <EditButton
                                hideText
                                size="small"
                                recordItemId={task.id}
                              />
                            )}
                            {task.status === "todo" && assigneeCanMove && (
                              <Button
                                size="small"
                                type="primary"
                                loading={isUpdating}
                                onClick={() =>
                                  moveTask(task, "doing", "Task accepted")
                                }
                              >
                                В работу
                              </Button>
                            )}
                            {task.status === "doing" && assigneeCanMove && (
                              <Button
                                size="small"
                                type="primary"
                                loading={isUpdating}
                                onClick={() =>
                                  moveTask(task, "review", "Task submitted for review")
                                }
                              >
                                На проверку
                              </Button>
                            )}
                            {task.status === "review" && editorCanReview && (
                              <>
                                <Button
                                  size="small"
                                  loading={isUpdating}
                                  onClick={() =>
                                    moveTask(task, "doing", "Changes requested")
                                  }
                                >
                                  Вернуть
                                </Button>
                                <Button
                                  size="small"
                                  type="primary"
                                  loading={isUpdating}
                                  onClick={() =>
                                    moveTask(task, "completed", "Task completed")
                                  }
                                >
                                  Завершить
                                </Button>
                              </>
                            )}
                          </Space>
                        </Space>
                      </Card>
                    );
                  })}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </List>
  );
}
