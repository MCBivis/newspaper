"use client";

import { Create, useForm } from "@refinedev/antd";
import { Breadcrumb, Form, Input } from "antd";
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import CustomSelect from "@components/custom/custom-select";

export default function ArticleCreate() {
    const { formProps, saveButtonProps, form } = useForm({});
    const [text, setText] = useState("");

    return (
        <Create
            title="Создать статью"
            breadcrumb={
                <Breadcrumb
                    items={[
                        { title: "Статьи", href: "/articles" },
                        { title: "Создать" },
                    ]}
                />
            }
            saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={"Название"}
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                            message: "Введите название статьи",
                        },
                    ]}
                >
                    <Input placeholder="Например: Итоги недели" />
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
                >
                    <CustomSelect
                        resource="issues"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Выберите выпуск"
                    />
                </Form.Item>
                <Form.Item
                    label={"Фото"}
                    name={["photos"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <CustomSelect
                        resource="photos"
                        mode="multiple"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Выберите фото"
                    />
                </Form.Item>
                <Form.Item
                    label={"Текст"}
                    name={["text"]}
                    rules={[
                        {
                            required: true,
                            message: "Введите текст статьи",
                        },
                    ]}
                >
                    <div data-color-mode="light">
                        <MDEditor
                            preview="edit"
                            value={text}
                            onChange={(value) => {
                                setText(value || "");
                                form.setFieldValue("text", value);
                            }}
                        />
                    </div>
                </Form.Item>
            </Form>
        </Create>
    );
}