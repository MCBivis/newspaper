"use client";

import { Show, TextField, ImageField, EditButton, ListButton } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Tag, Row, Col} from "antd";
import MDEditor from "@uiw/react-md-editor";
import { MEDIA_URL } from "../../../../utility/constants";
import styled from "styled-components";


const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-weight: bold !important;
    color: #292D30E0 !important;
  }
`;

const MarkdownContainer = styled.div`
  max-width: 300px;
  .w-md-editor {
    background-color: transparent !important;
    border: none !important;
  }
  .w-md-editor-content {
    background-color: transparent !important;
  }
`;

export default function ArticleShow() {

    const { queryResult } = useShow({
        meta: {
            populate: {
                photos: {
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
                <EditButton key="edit" type="primary" />,
            ]}
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Card title="Информация о статье" style={{ marginBottom: 16 }}>
                        <StyledDescriptions column={1} size="small">
                            <Descriptions.Item label="ID">
                                <Tag color="blue">{record?.id}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Название">
                                <TextField value={record?.name} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Выпуск">
                                {record?.issue ? (
                                    <Tag color="green">{record.issue.name}</Tag>
                                ) : (
                                    <Tag color="red">Не указан</Tag>
                                )}
                            </Descriptions.Item>
                        </StyledDescriptions>
                    </Card>

                    <Card title="Фото" style={{ marginBottom: 16 }}>
                        {record?.photos && record.photos.filter((photo: any) => photo?.photo?.url).length > 0 ? (
                            <div>
                                {record.photos.map((photo: any) => (
                                    <div key={photo.id} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <ImageField
                                            value={`${MEDIA_URL}${photo?.photo?.url}`}
                                            title={photo.name}
                                            width={200}
                                            height={200}
                                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                        <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                                            {photo.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Tag color="orange">Нет фото</Tag>
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Содержимое статьи" style={{ marginBottom: 16 }}>
                        <MarkdownContainer>
                            {record?.text ? (
                                <MDEditor.Markdown
                                    source={
                                        typeof record.text === "string"
                                            ? record.text
                                            : JSON.stringify(record.text)
                                    }
                                    style={{
                                        backgroundColor: "transparent",
                                        padding: "10px",
                                    }}
                                />
                            ) : (
                                <Tag color="gray">Содержимое отсутствует</Tag>
                            )}
                        </MarkdownContainer>
                    </Card>
                </Col>
            </Row>
        </Show>
    );
}