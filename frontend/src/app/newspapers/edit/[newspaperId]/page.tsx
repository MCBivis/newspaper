"use client";

import { DeleteOutlined } from "@ant-design/icons";
import UploadImage from "@components/Upload";
import { RequireRole } from "@components/auth/RequireRole";
import RoleUserSelect from "@components/users/RoleUserSelect";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
    Button,
    Form,
    Input,
    Popconfirm,
    Select,
    Space,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useState } from "react";

export default function NewspaperEdit() {
    const { form, formProps, query, saveButtonProps } = useForm<any>({
        meta: {
            populate: {
                photo: "*",
                layout: "*",
                responsibleEditor: "*",
            },
            fields: ["*"],
        },
    });

    const { selectProps: layoutSelectProps } = useSelect({
        resource: "layouts",
        optionLabel: "name" as any,
        optionValue: "id" as any,
    });

    const [photo, setPhoto] = useState<null | any>(null);

    // Устанавливаем значения формы после загрузки данных
    useEffect(() => {
        if (query?.data?.data) {
            const data = query.data.data;
            const photoData = data.photo;
            const layoutData = data.layout;
            const responsibleEditor = data.responsibleEditor;

            const photoValue = photoData
                ? {
                    url: photoData.url,
                    id: photoData.id,
                    fileName: `${photoData.hash}${photoData.ext}`,
                    type: photoData.mime?.split("/")[0],
                    ext: photoData.ext.replace(".", ""),
                }
                : null;

            setPhoto(photoValue);

            form.setFieldsValue({
                name: data.name,
                photo: photoValue,
                layout: layoutData ? { id: layoutData.id } : undefined,
                responsibleEditor: responsibleEditor
                    ? { id: responsibleEditor.id }
                    : undefined,
            });
        }
    }, [query?.data?.data, form]);

    return (
        <RequireRole allowedRoles={["SuperAdmin"]}>
        <Edit saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}>
            <Form
                {...formProps}
                layout="vertical"
                form={form}
                onFinish={(values: any) => {
                    formProps.onFinish?.({
                        ...values,
                        photo: values.photo?.id || values.photo,
                        responsibleEditor:
                            values.responsibleEditor?.id || values.responsibleEditor,
                    });
                }}
            >
                <Form.Item
                    label={"Название"}
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                            message: "Введите название газеты",
                        },
                    ]}
                >
                    <Input placeholder="Например: Вечерний город" />
                </Form.Item>
                <Form.Item
                    label={"Макет"}
                    name={["layout", "id"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Select {...layoutSelectProps} placeholder="Выберите макет" />
                </Form.Item>
                <Form.Item
                    label={"Ответственный редактор"}
                    name={["responsibleEditor", "id"]}
                    rules={[
                        {
                            required: true,
                            message: "Выберите ответственного редактора",
                        },
                    ]}
                >
                    <RoleUserSelect
                        roles={["Editor"]}
                        placeholder="Выберите редактора"
                    />
                </Form.Item>
                <Space direction="vertical">
                    <Form.Item
                        label={<Typography.Text strong>Обложка</Typography.Text>}
                        rules={[{ required: true, message: "Загрузите обложку" }]}
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
        </RequireRole>
    );
}