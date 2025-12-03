"use client";

import {
  DeleteButton,
  List,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function ArticleList() {
  const { tableProps } = useTable<{
    id: number | string;
    name: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }[]>({
    syncWithLocation: true,
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
          dataIndex="text"
          title={"Текст"}
          render={(value: string) => {
            if (!value) return "-";
            const preview = value.length > 100 ? value.substring(0, 100) + "..." : value;
            return <div style={{ maxWidth: "300px" }}>{preview}</div>;
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

