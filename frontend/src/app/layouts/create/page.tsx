"use client";

import { Create, useForm } from "@refinedev/antd";
import { Breadcrumb, Form, Input, InputNumber, Select } from "antd";

const { TextArea } = Input;

// Типы для опций
type FontOption = { value: string; label: string };
type ColumnOption = { value: number; label: string };
type PageSizePreset = { value: string; label: string; width: number; height: number };

// Предустановленные значения
const FONT_OPTIONS: FontOption[] = [
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Courier New", label: "Courier New" },
];

const COLUMN_COUNT_OPTIONS: ColumnOption[] = [
    { value: 4, label: "4 columns" },
    { value: 8, label: "8 columns" },
    { value: 12, label: "12 columns" },
];

const PAGE_SIZE_PRESETS: PageSizePreset[] = [
    { value: "a4", label: "A4 (595×842)", width: 595, height: 842 },
    { value: "a5", label: "A5 (420×595)", width: 420, height: 595 },
    { value: "letter", label: "Letter (612×792)", width: 612, height: 792 },
    {
        value: "newspaper",
        label: "Newspaper format (800×1200)",
        width: 800,
        height: 1200,
    },
];

export default function LayoutCreate() {
    const { formProps, saveButtonProps, form } = useForm({
        defaultFormValues: {
            columnCount: 12,
            pageHeight: 842,
            pageWidth: 595,
            horizontalFieldsWidth: 50,
            verticalFieldsHeight: 50,
            fontFamily: "Arial",
            pagesCount: 2,
            availableTextStyles: JSON.stringify({
                fonts: [
                    { fontFamily: "Arial", name: "Arial" },
                    { fontFamily: "Times New Roman", name: "Times New Roman" },
                    { fontFamily: "Georgia", name: "Georgia" },
                ],
            }),
            editorJSData: JSON.stringify({ blocks: [] }),
        },
    });

    const handlePageSizeChange = (presetValue: string) => {
        const preset = PAGE_SIZE_PRESETS.find((p) => p.value === presetValue);
        if (preset) {
            form?.setFieldsValue({
                pageWidth: preset.width,
                pageHeight: preset.height,
            });
        }
    };

    return (
        <Create
            title="Создать макет"
            breadcrumb={
                <Breadcrumb
                    items={[
                        { title: "Макеты", href: "/layouts" },
                        { title: "Создать" },
                    ]}
                />
            }
            saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Название макета"
                    name="name"
                    rules={[{ required: true, message: "Введите название макета" }]}
                >
                    <Input placeholder="Например: Стандартный макет газеты" />
                </Form.Item>

                <Form.Item
                    label="Пресет размера страницы"
                    help="Выберите стандартный размер или задайте свой ниже"
                >
                    <Select
                        placeholder="Выберите размер"
                        onChange={handlePageSizeChange}
                        options={PAGE_SIZE_PRESETS.map((p) => ({
                            value: p.value,
                            label: p.label,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Ширина страницы (px)"
                    name="pageWidth"
                    rules={[{ required: true, message: "Укажите ширину" }]}
                >
                    <InputNumber min={200} max={2000} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Высота страницы (px)"
                    name="pageHeight"
                    rules={[{ required: true, message: "Укажите высоту" }]}
                >
                    <InputNumber min={200} max={3000} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Количество колонок"
                    name="columnCount"
                    rules={[{ required: true, message: "Укажите количество колонок" }]}
                >
                    <Select options={COLUMN_COUNT_OPTIONS} />
                </Form.Item>

                <Form.Item
                    label="Количество страниц"
                    name="pagesCount"
                    rules={[{ required: true, message: "Укажите количество страниц" }]}
                    help="Минимум 2 страницы (первая недоступна для редактирования)"
                >
                    <InputNumber min={2} max={50} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Основной шрифт"
                    name="fontFamily"
                    rules={[{ required: true, message: "Выберите шрифт" }]}
                >
                    <Select
                        options={FONT_OPTIONS}
                        showSearch
                        placeholder="Выберите шрифт"
                    />
                </Form.Item>

                <Form.Item
                    label="Горизонтальные поля (px)"
                    name="horizontalFieldsWidth"
                    help="Левые и правые отступы"
                >
                    <InputNumber min={0} max={200} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Вертикальные поля (px)"
                    name="verticalFieldsHeight"
                    help="Верхний и нижний отступы"
                >
                    <InputNumber min={0} max={200} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Доступные стили текста (JSON)"
                    name="availableTextStyles"
                    help="Конфигурация доступных шрифтов в формате JSON"
                >
                    <TextArea
                        rows={4}
                        placeholder='{"fonts": [{"fontFamily": "Arial", "name": "Arial"}]}'
                    />
                </Form.Item>

                <Form.Item
                    label="Данные редактора (JSON)"
                    name="editorJSData"
                    help="Структурированные данные редактора (обычно пусто при создании)"
                >
                    <TextArea rows={3} placeholder='{"blocks": []}' />
                </Form.Item>
            </Form>
        </Create>
    );
}