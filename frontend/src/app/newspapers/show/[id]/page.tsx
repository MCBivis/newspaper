"use client";

import { EditButton, ListButton, Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Col, Descriptions, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { RequireRole } from "@components/auth/RequireRole";
import { useRoleAccess } from "@hooks/useRoleAccess";
import type { TaskRecord, TaskStatus } from "@/types/task";

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  doing: "Doing",
  review: "Review",
  completed: "Completed",
};

const relationsQuery = {
  populate: {
    photo: "*",
    layout: "*",
    responsibleEditor: {
      populate: ["role"],
    },
    issues: {
      populate: {
        tasks: {
          populate: {
            assignee: {
              populate: ["role"],
            },
          },
        },
      },
    },
    tasks: {
      populate: {
        assignee: {
          populate: ["role"],
        },
        issue: "*",
        articles: "*",
        photos: "*",
        advertisments: "*",
      },
    },
  },
};

export default function NewspaperSummary() {
  const router = useRouter();
  const { canManageNewspapers } = useRoleAccess();
  const { queryResult } = useShow<any>({
    resource: "newspapers",
    meta: relationsQuery,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const tasks = (record?.tasks || []) as TaskRecord[];
  const issues = record?.issues || [];

  return (
    <RequireRole allowedRoles={["SuperAdmin", "Editor"]}>
      <Show
        title="Сводка газеты"
        isLoading={isLoading}
        headerButtons={[
          <ListButton key="list" />,
          canManageNewspapers ? <EditButton key="edit" type="primary" /> : null,
        ]}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card title={record?.name || "Газета"}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Ответственный редактор">
                {record?.responsibleEditor?.username || "Не назначен"}
              </Descriptions.Item>
              <Descriptions.Item label="Макет">
                {record?.layout?.name || "Не выбран"}
              </Descriptions.Item>
              <Descriptions.Item label="Выпусков">{issues.length}</Descriptions.Item>
              <Descriptions.Item label="Задач">{tasks.length}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={[16, 16]}>
            {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
              <Col xs={24} md={12} xl={6} key={status}>
                <Card>
                  <Statistic
                    title={statusLabels[status]}
                    value={tasks.filter((task) => task.status === status).length}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <Card title="Задачи газеты">
            <Table
              rowKey="id"
              dataSource={tasks}
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
                render={(status: TaskStatus) => <Tag>{statusLabels[status] || status}</Tag>}
              />
              <Table.Column
                title="Исполнитель"
                render={(_, task: TaskRecord) => task.assignee?.username || "-"}
              />
              <Table.Column
                title="Выпуск"
                render={(_, task: TaskRecord) => task.issue?.name || "-"}
              />
              <Table.Column
                title="Дедлайн"
                render={(_, task: TaskRecord) =>
                  task.deadline ? new Date(task.deadline).toLocaleString("ru-RU") : "-"
                }
              />
            </Table>
          </Card>

          <Card title="Выпуски">
            <Table
              rowKey="id"
              dataSource={issues}
              pagination={false}
              locale={{ emptyText: "Выпуски не созданы" }}
            >
              <Table.Column title="Название" dataIndex="name" />
              <Table.Column
                title="Статус"
                dataIndex="status"
                render={(status: string) => <Tag>{status}</Tag>}
              />
              <Table.Column
                title="Дата публикации"
                render={(_, issue: any) =>
                  issue.PublishDate
                    ? new Date(issue.PublishDate).toLocaleDateString("ru-RU")
                    : "-"
                }
              />
              <Table.Column
                title="Задач"
                render={(_, issue: any) => issue.tasks?.length || 0}
              />
            </Table>
          </Card>

          <Typography.Text type="secondary">
            Сводка показывает редактора, задачи, исполнителей, выпуски и состояние работ по
            выбранной газете.
          </Typography.Text>
        </Space>
      </Show>
    </RequireRole>
  );
}
