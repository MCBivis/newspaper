"use client";

import React from "react";
import {
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  CameraOutlined,
  LayoutOutlined,
  DollarOutlined,
  FileProtectOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

export const resources = [
  {
    name: "newspapers",
    list: "/newspapers",
    create: "/newspapers/create",
    edit: "/newspapers/edit/:id",
    show: "/newspapers/show/:id",
    meta: { label: "Газеты", icon: <BookOutlined /> },
  },
  {
    name: "issues",
    list: "/issues",
    create: "/issues/create",
    edit: "/issues/edit/:id",
    show: "/issues/show/:id",
    meta: { label: "Выпуски", icon: <CalendarOutlined /> },
  },
  {
    name: "articles",
    list: "/articles",
    create: "/articles/create",
    edit: "/articles/edit/:id",
    show: "/articles/show/:id",
    meta: { label: "Статьи", icon: <EditOutlined /> },
  },
  {
    name: "photos",
    list: "/photos",
    create: "/photos/create",
    edit: "/photos/edit/:id",
    show: "/photos/show/:id",
    meta: { label: "Фотографии", icon: <CameraOutlined /> },
  },
  {
    name: "layouts",
    list: "/layouts",
    create: "/layouts/create",
    edit: "/layouts/edit/:id",
    show: "/layouts/show/:id",
    meta: { label: "Макеты", icon: <LayoutOutlined /> },
  },
  {
    name: "advertisments",
    list: "/advertisments",
    create: "/advertisments/create",
    edit: "/advertisments/edit/:id",
    show: "/advertisments/show/:id",
    meta: { label: "Реклама", icon: <DollarOutlined /> },
  },
  {
    name: "advertisement-templates",
    list: "/advertisement-templates",
    create: "/advertisement-templates/create",
    edit: "/advertisement-templates/edit/:id",
    show: "/advertisement-templates/show/:id",
    meta: { label: "Шаблоны рекламы", icon: <FileProtectOutlined /> },
  },
  {
    name: "tasks",
    list: "/tasks",
    create: "/tasks/create",
    edit: "/tasks/edit/:id",
    show: "/tasks/show/:id",
    meta: { label: "Задачи", icon: <CheckSquareOutlined /> },
  },
] as const;

