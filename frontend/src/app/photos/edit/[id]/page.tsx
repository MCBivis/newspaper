"use client";

import { DeleteOutlined } from "@ant-design/icons";
import CustomSelect from "@components/custom/custom-select";
import UploadImage from "@components/Upload";
import { Edit, useForm } from "@refinedev/antd";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Space,
    Tooltip,
    Typography,
} from "antd";
import { useMemo, useState } from "react";

export default function PhotoEdit() {
    const { form, formProps, query, saveButtonProps } = useForm<any>({
        meta: {
            populate: {
                photo: "*",
                article: "*",
                issue: "*",
            },
            fields: ["*"],
        },
    });

    const initialValues = useMemo(() => {
        const photo = query?.data?.data?.photo;
        return {
            ...query?.data?.data,
            photo: {
                url: photo?.url,
                id: photo?.id,
                fileName: `${photo?.hash}${photo?.ext}`,
                type: photo?.mime?.split("/")[0],
                ext: photo?.ext.replace(".", ""),
            },
        };
    }, [query?.data?.data?.photo]);

    const [photo, setPhoto] = useState<null | any>(initialValues.photo);

    return (
        <Edit saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}>
            <Form
                {...formProps}
                form={form}
                layout="vertical"
                initialValues={initialValues}
            >
                <Form.Item
                    label={"Название"}
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                            message: "Введите название",
                        },
                    ]}
                >
                    <Input placeholder="Например: Обложка выпуска" />
                </Form.Item>
                <Form.Item
                    label={"Выпуск"}
                    name={["issue"]}
                    rules={[
                        {
                            required: true,
                            message: "Выберите выпуск",
                        },
                    ]}
                    getValueProps={(value) => {
                        // Преобразуем данные из Strapi в формат для селекта
                        if (value && typeof value === 'object' && value.id) {
                            return { value: value.id };
                        }
                        if (Array.isArray(value)) {
                            return { value: value.map((issue) => issue.id || issue) };
                        }
                        return { value: value };
                    }}
                >
                    <CustomSelect
                        resource="issues"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Выберите выпуск"
                    />
                </Form.Item>
                <Form.Item
                    label={"Статья"}
                    name={["article"]}
                    rules={[
                        {
                            required: false,
                            message: "Выберите статью",
                        },
                    ]}
                    getValueProps={(value) => {
                        // Преобразуем данные из Strapi в формат для селекта
                        if (value && typeof value === 'object' && value.id) {
                            return { value: value.id };
                        }
                        if (Array.isArray(value)) {
                            return { value: value.map((article) => article.id || article) };
                        }
                        return { value: value };
                    }}
                >
                    <CustomSelect
                        resource="articles"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Выберите статью"
                    />
                </Form.Item>
                <Form.Item
                    label={"Ширина"}
                    name={["width"]}
                    rules={[
                        {
                            required: true,
                            message: "Укажите ширину",
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label={"Высота"}
                    name={["height"]}
                    rules={[
                        {
                            required: true,
                            message: "Укажите высоту",
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Space direction="vertical">
                    <Form.Item
                        label={<Typography.Text strong>Фото</Typography.Text>}
                        rules={[{ required: true, message: "Загрузите фото" }]}
                        style={{ margin: 0 }}
                        name="photo"
                    >
                        <UploadImage
                            value={photo}
                            index={0}
                            accepts=".png,.jpg,.jpeg"
                            onChange={(value) => {
                                setPhoto(value);
                                form?.setFieldValue("photo", value);
                            }}
                        />
                    </Form.Item>
                    {photo && (
                        <Popconfirm
                            title="Удалить вложение"
                            description="Уверены, что хотите удалить вложение?"
                            onConfirm={() => {
                                form?.setFieldValue("photo", null);
                                setPhoto(null);
                            }}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Tooltip placement="top" title={"Удалить"}>
                                <Button
                                    style={{ width: 120 }}
                                    size="small"
                                    block
                                    danger
                                    icon={<DeleteOutlined />}
                                >
                                    Удалить
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            </Form>
        </Edit>
    );
}