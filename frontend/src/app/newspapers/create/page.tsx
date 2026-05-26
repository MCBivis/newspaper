"use client";

import UploadImage from "@components/Upload";
import { RequireRole } from "@components/auth/RequireRole";
import RoleUserSelect from "@components/users/RoleUserSelect";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Breadcrumb, Form, Input, Select } from "antd";
import { useState } from "react";

export default function NewspaperCreate() {
    const { form, formProps, saveButtonProps } = useForm({
        onMutationSuccess: (data) => {
            console.log("Newspaper created successfully:", data);
        },
        onMutationError: (error) => {
            console.error("Error creating newspaper:", error);
            console.error("Full error object:", JSON.stringify(error, null, 2));
        },
    });
    const [cover, setCover] = useState<null | any>(null);

    const { selectProps: layoutSelectProps } = useSelect({
        resource: "layouts",
        optionLabel: "name",
        optionValue: "id",
    });

    return (
        <RequireRole allowedRoles={["SuperAdmin"]}>
        <Create
            title="Создать газету"
            breadcrumb={
                <Breadcrumb
                    items={[
                        { title: "Газеты", href: "/newspapers" },
                        { title: "Создать" },
                    ]}
                />
            }
            saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}
        >
            <Form
                {...formProps}
                layout="vertical"
                form={form}
                onFinish={(values: any) => {
                    console.log("Form values before submit:", values);

                    // Форматируем данные для отправки (для photo поля отправляем только ID)
                    const formattedValues = {
                        ...values,
                        photo: values.photo?.id || values.photo,
                        responsibleEditor:
                            values.responsibleEditor?.id || values.responsibleEditor,
                    };

                    console.log("Formatted values:", formattedValues);
                    formProps.onFinish?.(formattedValues);
                }}
            >
                <Form.Item
                    label="Название"
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
                    label="Обложка"
                    name={["photo"]}
                    rules={[
                        {
                            required: false,
                            message: "Загрузите обложку",
                        },
                    ]}
                >
                    <UploadImage
                        value={cover}
                        index={0}
                        accepts=".png,.jpg,.jpeg"
                        onChange={(value) => {
                            setCover(value);
                            form?.setFieldValue("photo", value);
                        }}
                    />
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
            </Form>
        </Create>
        </RequireRole>
    );
}