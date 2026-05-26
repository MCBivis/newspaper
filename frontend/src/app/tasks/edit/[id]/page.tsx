"use client";

import { RequireRole } from "@components/auth/RequireRole";
import RoleUserSelect from "@components/users/RoleUserSelect";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { TaskType } from "@/types/task";

const taskTypeRoles: Record<TaskType, string[]> = {
  article: ["Author"],
  photo: ["Illustrator"],
  advertisement: ["Advertiser"],
  layout: ["Editor"],
  other: ["Author", "Illustrator", "Advertiser"],
};

export default function TaskEdit() {
  const { form, formProps, query, saveButtonProps } = useForm<any>({
    resource: "tasks",
    action: "edit",
    meta: {
      populate: {
        newspaper: "*",
        issue: "*",
        assignee: {
          populate: ["role"],
        },
        articles: "*",
        photos: "*",
        advertisments: "*",
      },
    },
  });
  const [taskType, setTaskType] = useState<TaskType>("article");

  const { selectProps: newspaperSelectProps } = useSelect({
    resource: "newspapers",
    optionLabel: "name",
    optionValue: "id",
  });
  const { selectProps: issueSelectProps } = useSelect({
    resource: "issues",
    optionLabel: "name",
    optionValue: "id",
  });
  const { selectProps: articleSelectProps } = useSelect({
    resource: "articles",
    optionLabel: "name",
    optionValue: "id",
  });
  const { selectProps: photoSelectProps } = useSelect({
    resource: "photos",
    optionLabel: "name",
    optionValue: "id",
  });
  const { selectProps: advertismentSelectProps } = useSelect({
    resource: "advertisments",
    optionLabel: "Header",
    optionValue: "id",
  });

  useEffect(() => {
    const task = query?.data?.data;
    if (!task) return;

    const nextTaskType = task.taskType || "article";
    setTaskType(nextTaskType);
    form.setFieldsValue({
      name: task.name,
      description: task.description,
      taskType: nextTaskType,
      assignee: task.assignee?.id,
      newspaper: task.newspaper?.id,
      issue: task.issue?.id,
      articles: task.articles?.map((article: any) => article.id),
      photos: task.photos?.map((photo: any) => photo.id),
      advertisments: task.advertisments?.map((advertisment: any) => advertisment.id),
      deadline: task.deadline ? dayjs(task.deadline) : undefined,
    });
  }, [form, query?.data?.data]);

  return (
    <RequireRole allowedRoles={["SuperAdmin", "Editor"]}>
      <Edit saveButtonProps={{ ...saveButtonProps, children: "Сохранить" }}>
        <Form
          {...formProps}
          form={form}
          layout="vertical"
          onFinish={(values: any) => {
            formProps.onFinish?.({
              ...values,
              deadline: values.deadline ? values.deadline.toISOString() : null,
            });
          }}
        >
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: "Введите название задачи" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Описание"
            name="description"
            rules={[{ required: true, message: "Опишите задачу" }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item
            label="Тип задачи"
            name="taskType"
            rules={[{ required: true, message: "Выберите тип задачи" }]}
          >
            <Select
              onChange={(value: TaskType) => setTaskType(value)}
              options={[
                { value: "article", label: "Статья" },
                { value: "photo", label: "Изображение" },
                { value: "advertisement", label: "Реклама" },
                { value: "layout", label: "Макет" },
                { value: "other", label: "Другое" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Исполнитель"
            name="assignee"
            rules={[{ required: true, message: "Выберите исполнителя" }]}
          >
            <RoleUserSelect
              roles={taskTypeRoles[taskType]}
              placeholder="Выберите исполнителя"
            />
          </Form.Item>
          <Form.Item
            label="Газета"
            name="newspaper"
            rules={[{ required: true, message: "Выберите газету" }]}
          >
            <Select {...newspaperSelectProps} placeholder="Выберите газету" />
          </Form.Item>
          <Form.Item label="Выпуск" name="issue">
            <Select {...issueSelectProps} allowClear placeholder="Выберите выпуск" />
          </Form.Item>
          <Form.Item label="Связанные статьи" name="articles">
            <Select {...articleSelectProps} mode="multiple" allowClear />
          </Form.Item>
          <Form.Item label="Связанные изображения" name="photos">
            <Select {...photoSelectProps} mode="multiple" allowClear />
          </Form.Item>
          <Form.Item label="Связанная реклама" name="advertisments">
            <Select {...advertismentSelectProps} mode="multiple" allowClear />
          </Form.Item>
          <Form.Item
            label="Дедлайн"
            name="deadline"
            rules={[{ required: true, message: "Укажите дедлайн" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} format="DD.MM.YYYY HH:mm" />
          </Form.Item>
        </Form>
      </Edit>
    </RequireRole>
  );
}
