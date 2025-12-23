"use client";

import { EditButton, ImageField, ListButton, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Tag, Row, Col } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { MEDIA_URL } from "@utility/constants";
import styled from "styled-components";

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-weight: bold !important;
    color: #292D30E0 !important;
  }
`;

const MarkdownContainer = styled.div`
  max-width: 300px;
  max-height: 200px;
  overflow: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  .w-md-editor {
    background-color: transparent !important;
    border: none !important;
  }
  .w-md-editor-content {
    background-color: transparent !important;
  }
`;

export default function PhotoShow() {
    const { queryResult } = useShow({
        meta: {
            populate: {
                photo: {
                    populate: "*"
                },
                article: {
                    populate: "*"
                },
                issue: {
                    populate: "*"
                }
            },
        },
    });
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show
            isLoading={isLoading}
            headerButtons={[
                <ListButton key="list" />,
                <EditButton key="edit" type="primary" />
            ]}
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Card title="Информация о фото" style={{ marginBottom: 16 }}>
                        <StyledDescriptions column={1} size="small">
                            <Descriptions.Item label="ID">
                                <Tag color="blue">{record?.id}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Название">
                                <TextField value={record?.name} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Ширина">
                                <Tag color="cyan">{record?.width}px</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Высота">
                                <Tag color="orange">{record?.height}px</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Выпуск">
                                {record?.issue ? (
                                    <Tag color="green">{record.issue.name}</Tag>
                                ) : (
                                    <Tag color="red">Не указан</Tag>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Статья">
                                {record?.article ? (
                                    <Tag color="purple">{record.article.name}</Tag>
                                ) : (
                                    <Tag color="gray">Не указана</Tag>
                                )}
                            </Descriptions.Item>
                        </StyledDescriptions>
                    </Card>

                    <Card title="Фото" style={{ marginBottom: 16 }}>
                        {record?.photo ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <ImageField
                                    value={`${MEDIA_URL}${record.photo.url}`}
                                    title={record.photo.name}
                                    width={300}
                                    height={300}
                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                />
                                <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                                    {record.photo.name}
                                </div>
                            </div>
                        ) : (
                            <Tag color="orange">Фото не загружено</Tag>
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Содержимое статьи" style={{ marginBottom: 16 }}>
                        <MarkdownContainer>
                            {record?.article?.text ? (
                                <MDEditor.Markdown
                                    source={
                                        typeof record.article.text === "string"
                                            ? record.article.text
                                            : JSON.stringify(record.article.text)
                                    }
                                    style={{
                                        backgroundColor: "transparent",
                                        padding: "10px",
                                    }}
                                />
                            ) : (
                                <Tag color="gray">Содержимое статьи отсутствует</Tag>
                            )}
                        </MarkdownContainer>
                    </Card>
                </Col>
            </Row>
        </Show>
    );
}