"use client";

import CustomSelect from "@components/custom/custom-select";
import { Edit, useForm } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input } from "antd";
import { useEffect, useState } from "react";

export default function ArticleEdit() {
    const { formProps, saveButtonProps, form, queryResult } = useForm({
        meta: {
            populate: ["photos", "issue"],
        },
    });
    const [text, setText] = useState("");

    // Отслеживаем загрузку данных и обновляем текст ТОЛЬКО при изменении данных
    useEffect(() => {
        if (queryResult?.data?.data) {
            const articleData = queryResult.data.data;
            const initialText = articleData.text || "";
            setText(initialText);
            // Также устанавливаем значение в форму
            form.setFieldValue("text", initialText);
        }
    }, [queryResult?.data]); // Убираем form из зависимостей

    // Упрощенная функция сохранения
    const handleSave = () => {
        // Просто сохраняем текущий текст
        form.setFieldValue("text", text);

        // Вызываем оригинальное сохранение
        setTimeout(() => {
            if (saveButtonProps.onClick) {
                saveButtonProps.onClick();
            }
        }, 50);
    };

    const customSaveButtonProps = {
        ...saveButtonProps,
        onClick: handleSave,
    };

    return (
        <Edit saveButtonProps={{ ...customSaveButtonProps, children: "Сохранить" }}>
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
                    label={"Фото"}
                    name={["photos"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                    getValueProps={(value) => {
                        // Преобразуем данные из Strapi в формат для селекта
                        if (Array.isArray(value)) {
                            return { value: value.map((photo) => photo.id || photo) };
                        }
                        return { value: value };
                    }}
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
                            preview="live"
                            value={text}
                            onChange={(value) => {
                                setText(value || "");
                                form.setFieldValue("text", value || "");
                            }}
                            data-color-mode="light"
                        />
                    </div>
                </Form.Item>
            </Form>
        </Edit>
    );
}