"use client";

import { EditButton, ListButton, Show } from "@refinedev/antd";
import { useGetIdentity, useShow } from "@refinedev/core";
import {
  Card,
  Col,
  Descriptions,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useRoleAccess } from "@hooks/useRoleAccess";
import type { TaskRecord, TaskStatus } from "@/types/task";
import { getProgressStrokeColor, getTaskProgress } from "@/utils/taskProgress";
import {
  canAccessIssueSummary,
  getVisibleIssueTasks,
} from "@/utils/taskVisibility";

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  doing: "Doing",
  review: "Review",
  completed: "Completed",
};

const ISSUE_STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  in_progress: "В работе",
  review: "На проверке",
  ready: "Готов",
  published: "Опубликован",
};

const relationsQuery = {
  populate: {
    newspaper: {
      populate: {
        layout: "*",
        responsibleEditor: {
          populate: ["role"],
        },
      },
    },
    cover: "*",
    tasks: {
      populate: {
        assignee: {
          populate: ["role"],
        },
        articles: "*",
        photos: "*",
        advertisments: "*",
      },
    },
  },
};

export default function IssueSummary() {
  const { data: identity, isLoading: isIdentityLoading } = useGetIdentity<any>();
  const {
    canManageIssues,
    isSuperAdmin,
    isEditor,
    isAuthor,
    isIllustrator,
    isAdvertiser,
  } = useRoleAccess();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const newspaperId = searchParams.get("newspaperId");
  const issueId = Array.isArray(params.issueId)
    ? params.issueId[0]
    : params.issueId;

  const taskVisibilityContext = {
    isSuperAdmin,
    isEditor,
    isAuthor,
    isIllustrator,
    isAdvertiser,
  };

  const { queryResult } = useShow<any>({
    resource: "issues",
    id: issueId,
    meta: relationsQuery,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const allTasks = (record?.tasks || []) as TaskRecord[];

  const visibleTasks = useMemo(
    () =>
      getVisibleIssueTasks(allTasks, identity, { isSuperAdmin, isEditor }),
    [allTasks, identity, isSuperAdmin, isEditor],
  );

  const hasAccess = useMemo(
    () => canAccessIssueSummary(allTasks, identity, taskVisibilityContext),
    [allTasks, identity, isSuperAdmin, isEditor, isAuthor, isIllustrator, isAdvertiser],
  );

  const isLimitedView = !isSuperAdmin && !isEditor;
  const { total, completed, percent } = getTaskProgress(visibleTasks);

  useEffect(() => {
    if (isLoading || isIdentityLoading) return;
    if (!hasAccess) {
      router.replace("/unauthorized");
    }
  }, [hasAccess, isIdentityLoading, isLoading, router]);

  if (isLoading || isIdentityLoading || !hasAccess) {
    return null;
  }

  return (
    <Show
      title={isLimitedView ? "Мои задачи в выпуске" : "Сводка выпуска"}
      isLoading={isLoading}
      headerButtons={[
        <ListButton
          key="list"
          onClick={() =>
            router.push(
              newspaperId ? `/issues?newspaperId=${newspaperId}` : "/issues",
            )
          }
        />,
        canManageIssues ? (
          <EditButton
            key="edit"
            type="primary"
            recordItemId={issueId}
            onClick={() => router.push(`/issues/edit/${issueId}`)}
          />
        ) : null,
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card title={record?.name || "Выпуск"}>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Газета">
              {record?.newspaper?.name || "Не указана"}
            </Descriptions.Item>
            {!isLimitedView && (
              <Descriptions.Item label="Ответственный редактор">
                {record?.newspaper?.responsibleEditor?.username || "Не назначен"}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Дата публикации">
              {record?.PublishDate
                ? dayjs(record.PublishDate).format("DD.MM.YYYY")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Статус выпуска">
              <Tag>
                {ISSUE_STATUS_LABELS[record?.status] || record?.status || "—"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={isLimitedView ? "Моих задач" : "Задач"}>
              {total}
            </Descriptions.Item>
            <Descriptions.Item label="Выполнено">
              {completed} ({percent}%)
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 16, maxWidth: 400 }}>
            <Progress
              percent={percent}
              strokeColor={getProgressStrokeColor(percent)}
              format={() => `${percent}%`}
            />
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
            <Col xs={24} md={12} xl={6} key={status}>
              <Card>
                <Statistic
                  title={statusLabels[status]}
                  value={
                    visibleTasks.filter((task) => task.status === status).length
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Card title={isLimitedView ? "Мои задачи" : "Задачи выпуска"}>
          <Table
            rowKey="id"
            dataSource={visibleTasks}
            pagination={false}
            locale={{ emptyText: "Задачи не созданы" }}
            onRow={(task: TaskRecord) => ({
              onClick: () => router.push(`/tasks/show/${task.id}`),
              style: { cursor: "pointer" },
            })}
          >
            <Table.Column title="Название" dataIndex="name" />
            <Table.Column
              title="Статус"
              dataIndex="status"
              render={(status: TaskStatus) => (
                <Tag>{statusLabels[status] || status}</Tag>
              )}
            />
            {!isLimitedView && (
              <Table.Column
                title="Исполнитель"
                render={(_, task: TaskRecord) => task.assignee?.username || "-"}
              />
            )}
            <Table.Column
              title="Дедлайн"
              render={(_, task: TaskRecord) =>
                task.deadline
                  ? dayjs(task.deadline).format("DD.MM.YYYY HH:mm")
                  : "-"
              }
            />
          </Table>
        </Card>

        <Typography.Text type="secondary">
          {isLimitedView
            ? "Показаны только ваши задачи по выбранному выпуску."
            : "Сводка показывает задачи, исполнителей и состояние работ по выбранному выпуску."}
        </Typography.Text>
      </Space>
    </Show>
  );
}
