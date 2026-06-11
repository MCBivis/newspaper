"use client";

import {
  DeleteButton,
  EditButton,
  ImageField,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useGetIdentity } from "@refinedev/core";
import { Progress, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { MEDIA_URL } from "../../utility/constants";
import { useRoleAccess } from "@hooks/useRoleAccess";
import type { TaskRecord } from "@/types/task";
import { sortIssuesByPublishProximity } from "@/utils/issueSort";
import { getProgressStrokeColor, getTaskProgress } from "@/utils/taskProgress";
import {
  canAccessIssueSummary,
  getVisibleIssueTasks,
} from "@/utils/taskVisibility";

const relationsQuery = {
  populate: {
    newspaper: {
      populate: {
        layout: {
          populate: "*",
        },
      },
    },
    cover: {
      populate: "*",
    },
    tasks: {
      populate: {
        assignee: {
          populate: ["role"],
        },
      },
    },
  },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Черновик", color: "default" },
  in_progress: { label: "В работе", color: "orange" },
  review: { label: "На проверке", color: "blue" },
  ready: { label: "Готов", color: "cyan" },
  published: { label: "Опубликован", color: "green" },
};

export default function IssueList() {
  const { data: identity } = useGetIdentity<any>();
  const {
    canManageIssues,
    isSuperAdmin,
    isEditor,
    isAuthor,
    isIllustrator,
    isAdvertiser,
  } = useRoleAccess();
  const taskVisibilityContext = {
    isSuperAdmin,
    isEditor,
    isAuthor,
    isIllustrator,
    isAdvertiser,
  };
  const searchParams = useSearchParams();
  const newspaperId = searchParams.get("newspaperId");
  const router = useRouter();

  const { tableProps } = useTable<
    {
      name: string;
      PublishDate: Date;
      status: string;
      newspaper: { name: string };
      cover: { url: string; name: string };
      tasks: TaskRecord[];
      createdAt: Date;
      updatedAt: Date;
      id: number | string;
    }[]
  >({
    resource: "issues",
    syncWithLocation: true,
    meta: relationsQuery,
    filters: {
      initial: newspaperId
        ? [
            {
              field: "newspaper",
              operator: "eq",
              value: newspaperId,
            },
          ]
        : [],
    },
    pagination: {
      pageSize: 100,
    },
  });

  const sortedDataSource = useMemo(
    () => sortIssuesByPublishProximity(tableProps.dataSource ?? []),
    [tableProps.dataSource],
  );

  return (
    <List
      createButtonProps={{
        children: "Создать выпуск",
        style: { display: canManageIssues ? "inline-flex" : "none" },
        onClick: () =>
          router.push(
            newspaperId
              ? `/issues/create?newspaperId=${newspaperId}`
              : "/issues/create",
          ),
      }}
    >
      <Table {...tableProps} dataSource={sortedDataSource} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} width={60} />
        <Table.Column
          title={"Обложка"}
          dataIndex="cover"
          width={100}
          render={(_, record: BaseRecord) =>
            record.cover?.url ? (
              <ImageField
                value={`${MEDIA_URL}${record.cover.url}`}
                title={record.cover.name}
                width={50}
                height={50}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#999" }}>Нет фото</span>
            )
          }
        />
        <Table.Column dataIndex="name" title={"Название"} />
        <Table.Column
          dataIndex="PublishDate"
          title={"Дата публикации"}
          render={(_, record: BaseRecord) =>
            record.PublishDate
              ? dayjs(record.PublishDate).format("DD.MM.YYYY")
              : "—"
          }
          width={140}
        />
        <Table.Column
          title={"Газета"}
          dataIndex="newspaper"
          render={(_, record: BaseRecord) =>
            record.newspaper?.name ?? (
              <span style={{ color: "#999" }}>Не указана</span>
            )
          }
        />
        <Table.Column
          title={"Статус"}
          dataIndex="status"
          width={140}
          render={(_, record: BaseRecord) => {
            const status = STATUS_LABELS[record.status] ?? {
              label: record.status,
              color: "default",
            };
            return <Tag color={status.color}>{status.label}</Tag>;
          }}
        />
        <Table.Column
          title={"Прогресс"}
          dataIndex="progress"
          width={160}
          render={(_, record: BaseRecord) => {
            const issueTasks = (record.tasks as TaskRecord[]) ?? [];
            const progressTasks = getVisibleIssueTasks(
              issueTasks,
              identity,
              { isSuperAdmin, isEditor },
            );
            const canOpenSummary = canAccessIssueSummary(
              issueTasks,
              identity,
              taskVisibilityContext,
            );

            if (!canOpenSummary && progressTasks.length === 0) {
              return <span style={{ color: "#999" }}>—</span>;
            }

            const { total, completed, percent } = getTaskProgress(progressTasks);
            const progressBar = (
              <div style={{ minWidth: 120 }}>
                <Progress
                  percent={percent}
                  size="small"
                  strokeColor={getProgressStrokeColor(percent)}
                  format={() => `${percent}%`}
                />
                <span style={{ fontSize: 12, color: "#999" }}>
                  {completed}/{total} задач
                </span>
              </div>
            );

            if (!canOpenSummary) {
              return progressBar;
            }

            return (
              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  router.push(
                    `/issues/summary/${record.id}${
                      newspaperId ? `?newspaperId=${newspaperId}` : ""
                    }`,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    router.push(
                      `/issues/summary/${record.id}${
                        newspaperId ? `?newspaperId=${newspaperId}` : ""
                      }`,
                    );
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {progressBar}
              </div>
            );
          }}
        />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          width={120}
          render={(_, record: BaseRecord) => (
            <Space>
              {canManageIssues && (
                <EditButton hideText size="small" recordItemId={record.id} />
              )}
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() =>
                  router.push(
                    `/issues/show/${record.id}${
                      newspaperId ? `?newspaperId=${newspaperId}` : ""
                    }`,
                  )
                }
              />
              {canManageIssues && (
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  resource="issues"
                />
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
