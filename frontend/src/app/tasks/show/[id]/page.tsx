"use client";

import { EditButton, ListButton, Show } from "@refinedev/antd";
import { useGetIdentity, useShow, useUpdate } from "@refinedev/core";
import { Button, Card, Descriptions, Input, List, Space, Tag, Typography } from "antd";
import { useState } from "react";
import { useRoleAccess } from "@hooks/useRoleAccess";
import type { AppUser, TaskDialogueEntry, TaskRecord, TaskStatus } from "@/types/task";

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

function nextDialogue(
  task: TaskRecord,
  identity: any,
  message: string,
  status?: TaskStatus
): TaskDialogueEntry[] {
  return [
    ...(Array.isArray(task.dialogue) ? task.dialogue : []),
    {
      author: identity?.username || "User",
      role: identity?.role?.name,
      message,
      status,
      createdAt: new Date().toISOString(),
    },
  ];
}

export default function TaskShow() {
  const [comment, setComment] = useState("");
  const { data: identity } = useGetIdentity<any>();
  const { canManageTasks, canReviewTasks, isSuperAdmin } = useRoleAccess();
  const { mutate: updateTask, isLoading: isUpdating } = useUpdate();
  const { queryResult } = useShow<TaskRecord>({
    resource: "tasks",
    meta: relationsQuery,
  });
  const { data, isLoading, refetch } = queryResult;
  const record = data?.data;

  const isAssignee = isSameUser(record?.assignee, identity);
  const isResponsibleEditor = isSameUser(record?.newspaper?.responsibleEditor, identity);
  const assigneeCanMove = isSuperAdmin || isAssignee;
  const editorCanReview =
    Boolean(record) &&
    canReviewTasks &&
    (isSuperAdmin || isResponsibleEditor || !record?.newspaper?.responsibleEditor);

  const updateRecord = (status?: TaskStatus, message?: string) => {
    if (!record) return;

    const text = message || comment.trim();
    if (!text) return;

    updateTask(
      {
        resource: "tasks",
        id: record.id,
        values: {
          ...(status ? { status } : {}),
          dialogue: nextDialogue(record, identity, text, status || record.status),
        },
      },
      {
        onSuccess: () => {
          setComment("");
          refetch();
        },
      }
    );
  };

  return (
    <Show
      isLoading={isLoading}
      headerButtons={[
        <ListButton key="list" />,
        canManageTasks ? <EditButton key="edit" type="primary" /> : null,
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card title="Информация о задаче">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Название">{record?.name}</Descriptions.Item>
            <Descriptions.Item label="Статус">
              <Tag>{record?.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Тип">{record?.taskType || "other"}</Descriptions.Item>
            <Descriptions.Item label="Газета">
              {record?.newspaper?.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Выпуск">{record?.issue?.name || "-"}</Descriptions.Item>
            <Descriptions.Item label="Исполнитель">
              {record?.assignee?.username || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Ответственный редактор">
              {record?.newspaper?.responsibleEditor?.username || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Дедлайн">
              {record?.deadline ? new Date(record.deadline).toLocaleString("ru-RU") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Описание">
              <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: "pre-wrap" }}>
                {record?.description || "-"}
              </Typography.Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Действия">
          <Space wrap>
            {record?.status === "todo" && assigneeCanMove && (
              <Button
                type="primary"
                loading={isUpdating}
                onClick={() => updateRecord("doing", "Task accepted")}
              >
                В работу
              </Button>
            )}
            {record?.status === "doing" && assigneeCanMove && (
              <Button
                type="primary"
                loading={isUpdating}
                onClick={() => updateRecord("review", "Task submitted for review")}
              >
                На проверку
              </Button>
            )}
            {record?.status === "review" && editorCanReview && (
              <>
                <Button
                  loading={isUpdating}
                  onClick={() => updateRecord("doing", comment || "Changes requested")}
                >
                  Вернуть в работу
                </Button>
                <Button
                  type="primary"
                  loading={isUpdating}
                  onClick={() => updateRecord("completed", comment || "Task completed")}
                >
                  Завершить
                </Button>
              </>
            )}
          </Space>
        </Card>

        <Card title="Диалог проверки">
          <Space direction="vertical" style={{ width: "100%" }}>
            <List
              dataSource={record?.dialogue || []}
              locale={{ emptyText: "Комментариев пока нет" }}
              renderItem={(entry) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${entry.author || "User"}${entry.role ? ` (${entry.role})` : ""}`}
                    description={
                      <Space direction="vertical">
                        <Typography.Text>{entry.message}</Typography.Text>
                        <Typography.Text type="secondary">
                          {new Date(entry.createdAt).toLocaleString("ru-RU")}
                          {entry.status ? ` · ${entry.status}` : ""}
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
            <Input.TextArea
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Напишите комментарий для исполнителя или редактора"
            />
            <Button
              disabled={!comment.trim()}
              loading={isUpdating}
              onClick={() => updateRecord(undefined)}
            >
              Добавить комментарий
            </Button>
          </Space>
        </Card>
      </Space>
    </Show>
  );
}
