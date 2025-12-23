"use client";

import { Create, useForm } from "@refinedev/antd";
import {Breadcrumb, Form, Input, InputNumber, Space, Typography, Popconfirm, Tooltip, Button} from "antd";
import {useState} from "react";
import UploadImage from "@components/Upload";
import {DeleteOutlined} from "@ant-design/icons";
import CustomSelect from "@components/custom/custom-select";

export default function PhotoCreate() {
    const { formProps, saveButtonProps, form } = useForm({});
    const [photo, setPhoto] = useState<null>(form?.getFieldValue('photo'));

    return (
        <Create
            title="Создать фотографию"
            breadcrumb={
                <Breadcrumb
                    items={[
                        { title: "Фотографии", href: "/photos" },
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
                        },
                    ]}
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
                        rules={[{ required: true, message: 'Загрузите фото' }]}
                        style={{ margin: 0 }}
                        name='photo'
                    >
                        <UploadImage value={photo} index={0} accepts=".png,.jpg,.jpeg" onChange={(value) => {
                            setPhoto(value);
                            form?.setFieldValue('photo', value);
                        }}/>
                    </Form.Item>

                    {photo && (<Popconfirm
                        title='Удалить вложение'
                        description='Уверены, что хотите удалить вложение?'
                        onConfirm={() => {
                            form?.setFieldValue('photo', null);
                            setPhoto(null);
                        }}
                        okText='Да'
                        cancelText='Нет'
                    >
                        <Tooltip placement='top' title={'Удалить'}>
                            <Button
                                style={{width: 120,}}
                                size='small'
                                block
                                danger
                                icon={<DeleteOutlined />}
                            >
                                Удалить
                            </Button>
                        </Tooltip>
                    </Popconfirm>)}
                </Space>
            </Form>
        </Create>
    );
}