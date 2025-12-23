"use client";

import {
  DeleteButton,
  List,
  useTable,
  ShowButton,
  EditButton,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function LayoutList() {
  const { tableProps} = useTable<{
    editorJSData: JSON,
    columnCount: number,
    pageHeight: number,
    availableTextStyles: JSON,
    pageWidth: number,
    horizontalFieldsWidth: number,
    verticalFieldsHeight: number,
    fontFamily: string,
    pagesCount: number,
    createdAt: Date,
    updatedAt: Date,
    id: number | string,
  }[]>({
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: 'id',
          order: 'desc',
        },
      ],
    },
  });

  const renderAvailableTextStyles = (value: any) => {
    let fonts: any[] = [];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        fonts = parsed.fonts || [];
      } catch {
        fonts = [];
      }
    } else if (value && typeof value === 'object' && Array.isArray(value.fonts)) {
      fonts = value.fonts;
    }
    if (!fonts.length) return '-';
    return (
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #d9d9d9' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 'bold', fontSize: 12, border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>Название</th>
            <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 'bold', fontSize: 12, border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>Шрифт</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font, idx) => (
            <tr key={idx}>
              <td style={{ padding: '4px 8px', fontSize: 12, border: '1px solid #d9d9d9' }}>{font.name}</td>
              <td style={{ padding: '4px 8px', fontFamily: font.fontFamily, fontSize: 12, border: '1px solid #d9d9d9' }}>{font.fontFamily}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPixelValue = (value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    return `${value}px`;
  };

  return (
      <List
        createButtonProps={{
          children: "Создать макет",
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="columnCount" title={"Колонок"} />
          <Table.Column dataIndex="pageHeight" title={"Высота заголовка"} render={renderPixelValue} />
          <Table.Column dataIndex="availableTextStyles" title={"Стили текста"} render={renderAvailableTextStyles} />
          <Table.Column dataIndex="pageWidth" title={"Ширина страницы"} render={renderPixelValue} />
          <Table.Column dataIndex="horizontalFieldsWidth" title={"Ширина полей"} render={renderPixelValue} />
          <Table.Column dataIndex="verticalFieldsHeight" title={"Высота полей"} render={renderPixelValue} />
          <Table.Column dataIndex="fontFamily" title={"Шрифт по умолчанию"} />
          <Table.Column dataIndex="pagesCount" title={"Страниц"} />
          <Table.Column
              title={"Действия"}
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                  <Space>
                    <EditButton hideText size="small" recordItemId={record.id} />
                    <ShowButton hideText size="small" recordItemId={record.id} />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                  </Space>
              )}
          />
        </Table>
      </List>
  );
}
