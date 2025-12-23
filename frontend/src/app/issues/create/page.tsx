"use client";

import UploadImage from "@components/Upload";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Breadcrumb, Form, Input, DatePicker, Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function IssueCreate() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const newspaperId = searchParams.get("newspaperId"); // Extract newspaperId from query parameters
    const [cover, setCover] = useState<null | any>(null);

    const { form, formProps, saveButtonProps } = useForm({
        resource: "issues",
        action: "create",
        redirect: false,
        onMutationSuccess: (data) => {
            console.log("Issue created successfully:", data);
            router.push(`/issues?newspaperId=${newspaperId}`);
        },
        onMutationError: (error) => {
            console.error("Error creating issue:", error);
            console.error("Full error object:", JSON.stringify(error, null, 2));
        },
    });

    const { selectProps: newspaperSelectProps } = useSelect({
        resource: "newspapers",
        optionLabel: "name",
        optionValue: "id",
    });

    return (
        <Create
            title="Создать выпуск"
            breadcrumb={
                <Breadcrumb
                    items={[
                        { title: "Выпуски", href: "/issues" },
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

                    const transformedValues = {
                        name: values.name,
                        status: values.status,
                        PublishDate: values.PublishDate
                            ? values.PublishDate.toISOString()
                            : null,
                        newspaper: values.newspaper?.id || values.newspaper,
                        cover: values.cover?.id || null,
                    };

                    console.log("Transformed values:", transformedValues);

                    return formProps.onFinish?.(transformedValues);
                }}
            >
                <Form.Item
                    label={"Название"}
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                            message: "Введите название выпуска",
                        },
                    ]}
                >
                    <Input placeholder="Например: Январь 2025" />
                </Form.Item>
                <Form.Item
                    label={"Статус"}
                    name={["status"]}
                    rules={[
                        {
                            required: true,
                            message: "Выберите статус",
                        },
                    ]}
                    initialValue="in_progress"
                >
                    <Select placeholder="Выберите статус" defaultValue="in_progress">
                        <Select.Option value="in_progress">В работе</Select.Option>
                        <Select.Option value="published">Опубликован</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Обложка"}
                    name={["cover"]}
                    rules={[
                        {
                            required: true,
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
                            form?.setFieldValue("cover", value);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Дата публикации"}
                    name={["PublishDate"]}
                    rules={[
                        {
                            required: true,
                            message: "Выберите дату",
                        },
                    ]}
                >
                    <DatePicker
                        placeholder="Выберите дату"
                        style={{ width: '100%' }}
                        format="DD.MM.YYYY"
                    />
                </Form.Item>
                <Form.Item
                    label={"Газета"}
                    name={["newspaper", "id"]}
                    rules={[
                        {
                            required: true,
                            message: "Выберите газету",
                        },
                    ]}
                    initialValue={newspaperId ? parseInt(newspaperId) : undefined}
                >
                    <Select {...newspaperSelectProps} placeholder="Выберите газету" />
                </Form.Item>
            </Form>
        </Create>
    );
}