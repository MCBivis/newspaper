"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useCustom } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";
import { API_URL } from "@utility/constants";
import { Space, Table } from "antd";
import qs from "qs";

const relationsQuery = {
  populate: {
    photos: {
      populate: "*",
    },
    text: "*",
    issue: {
      populate: "*",
    },
  },
};

type PhotoType = {
  name: string;
  width: number;
  height: number;
  photo: URL;
};

const query = qs.stringify(
    {
      fields: "*",
      populate: {
        photos: {
          fields: "*",
          populate: {
            photo: {
              fields: "*",
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
);

export default function ArticleList() {

  const { data } = useCustom<{
    data: {
      id: number;
      attributes: {
        id: number;
        text: any;
        name: string;
        photos: {
          data: [
            {
              id: number;
              attributes: {
                name: string;
                width: number;
                height: number;
                createdAt: string;
                updatedAt: string;
                photo: {
                  data: {
                    attributes: {
                      url: string;
                    };
                  };
                };
              };
            }
          ];
        };
      };
    }[];
  }>({
    url: `${API_URL}/api/articles?${query}`,
    method: "get",
  });

  const { tableProps } = useTable<
      {
        name: string;
        photos: PhotoType[];
        text: string;
        createdAt: Date;
        updatedAt: Date;
        id: number | string;
      }[]
  >({
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
      <List
          createButtonProps={{
            children: "Создать статью",
            style: {
              display:"inline-flex",
            },
          }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="name" title={"Название"} />
          <Table.Column
              title={"Выпуск"}
              dataIndex="issue"
              render={(_, record: BaseRecord) => {
                return record.issue?.name || "-";
              }}
          />

              <Table.Column
                  width="200px"
                  title={"Фото"}
                  dataIndex="photos"
                  render={(_, record: BaseRecord) => {
                    const val = data?.data.data.find(
                        (value) => String(value.id) === String(record.id)
                    )?.attributes;

                    // @ts-ignore
                    if (!val?.photos?.data || val?.photos?.data?.length === 0 || val?.photos?.data[0]?.attributes?.photo?.data === null) {
                      return "-";
                    }

                    return val.photos.data.map((photo) => (
                        <img
                            key={photo.id}
                            src={`http://127.0.0.1:1338${
                                photo.attributes.photo?.data?.attributes?.url || ""
                            }`}
                            alt={photo.attributes.name}
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 10,
                              margin: "4px",
                            }}
                        />
                    ));
                  }}
              />
          <Table.Column
              dataIndex="text"
              title={"Текст"}
              render={(_, record: BaseRecord) => {
                const val = data?.data.data.find(
                    (value) => String(value.id) === String(record.id)
                )?.attributes;
                const text = val?.text;
                const textContent =
                    typeof text === "string"
                        ? text
                        : typeof text === "object"
                            ? JSON.stringify(text)
                            : "";
                return (
                    <div
                        data-color-mode="light"
                        style={{
                          maxWidth: "300px",
                          maxHeight: "200px",
                          overflow: "auto",
                          border: "1px solid #f0f0f0",
                          borderRadius: "4px"
                        }}
                    >
                      <MDEditor.Markdown
                          source={textContent}
                          style={{
                            backgroundColor: "transparent",
                            padding: "10px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                      />
                    </div>
                );
              }}
          />
          <Table.Column
              title={"Действия"}
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                  <Space>
                    <ShowButton hideText size="small" recordItemId={record.id} />
                        <EditButton hideText size="small" recordItemId={record.id} />
                        <DeleteButton hideText size="small" recordItemId={record.id} />
                  </Space>
              )}
          />
        </Table>
      </List>
  );
}