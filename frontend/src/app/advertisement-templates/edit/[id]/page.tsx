"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Row, Col } from "antd";
import { BannerPreview } from "@components/BannerPreview";

export default function AdvertisementTemplateEdit() {
    const { formProps, saveButtonProps } = useForm({});

    const name = Form.useWatch(['name'], formProps.form);
    const widthInColumns = Form.useWatch(['widthInColumns'], formProps.form);
    const heightInRows = Form.useWatch(['heightInRows'], formProps.form);

    return (
        <Edit saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}>
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
                            <Input placeholder="Пример: Баннер 2x3, Квадрат 1x1" />
                        </Form.Item>
                        <Form.Item
                            label={"Ширина (в колонках)"}
                            name={["widthInColumns"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Введите ширину в колонках",
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
                                    message: "Введите высоту в строках",
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
                        title="Интерактивный предпросмотр баннера"
                    />
                </Col>
            </Row>
        </Edit>
    );
}