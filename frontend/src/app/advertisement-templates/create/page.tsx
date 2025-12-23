"use client";

import { Create, useForm } from "@refinedev/antd";
import { Breadcrumb, Form, Input, InputNumber, Row, Col } from "antd";
import { BannerPreview } from "@components/BannerPreview";

export default function AdvertisementTemplateCreate() {
    const { formProps, saveButtonProps } = useForm({});

    const name = Form.useWatch(['name'], formProps.form);
    const widthInColumns = Form.useWatch(['widthInColumns'], formProps.form);
    const heightInRows = Form.useWatch(['heightInRows'], formProps.form);

    return (
        <Create
            title="Создать шаблон"
            breadcrumb={
                <Breadcrumb
                    items={[
                        { title: "Шаблоны рекламы", href: "/advertisement-templates" },
                        { title: "Создать" },
                    ]}
                />
            }
            saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Form {...formProps} layout="vertical">
                        <Form.Item
                            label={"Название шаблона"}
                            name={["name"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Введите название шаблона",
                                },
                            ]}
                        >
                            <Input placeholder="Например: Баннер 2x3, Квадрат 1x1" />
                        </Form.Item>
                        <Form.Item
                            label={"Ширина (в колонках)"}
                            name={["widthInColumns"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Укажите ширину в колонках",
                                },
                            ]}
                        >
                            <InputNumber min={1} max={12} placeholder="Количество колонок" />
                        </Form.Item>
                        <Form.Item
                            label={"Высота (в строках)"}
                            name={["heightInRows"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Укажите высоту в строках",
                                },
                            ]}
                        >
                            <InputNumber min={1} max={20} placeholder="Количество строк" />
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <BannerPreview
                        name={name}
                        widthInColumns={widthInColumns}
                        heightInRows={heightInRows}
                        title="Интерактивный предпросмотр"
                    />
                </Col>
            </Row>
        </Create>
    );
}