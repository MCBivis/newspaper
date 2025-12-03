"use client";

import {
  DeleteButton,
  List,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

const relationsQuery = {
  populate: {
    newspaper: {
      populate: "*",
    },
  },
};

export default function IssueList() {
  const { tableProps } = useTable<{
    id: number | string;
    name: string;
    status: string;
    PublishDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }[]>({
    syncWithLocation: true,
    meta: relationsQuery,
    sorters: {
      initial: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Название"} />
        <Table.Column
          dataIndex="status"
          title={"Статус"}
          render={(value: string) => {
            const statusMap: Record<string, string> = {
              draft: "Черновик",
              in_progress: "В работе",
              review: "На проверке",
              ready: "Готово",
              published: "Опубликовано",
            };
            return statusMap[value] || value;
          }}
        />
        <Table.Column
          dataIndex="newspaper"
          title={"Газета"}
          render={(_, record: BaseRecord) => {
            return record.newspaper?.name || "-";
          }}
        />
        <Table.Column
          dataIndex="PublishDate"
          title={"Дата публикации"}
          render={(value: Date) => {
            if (!value) return "-";
            return new Date(value).toLocaleDateString("ru-RU");
          }}
        />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

