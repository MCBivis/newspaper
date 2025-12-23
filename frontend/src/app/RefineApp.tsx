// src/app/RefineApp.tsx
"use client";
import { DevtoolsProvider } from "@providers/devtools";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import React, {
  Suspense,
} from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";
import {
  AppstoreOutlined,
  PictureOutlined,
  ContainerOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  CameraOutlined,
  LayoutOutlined,
  DollarOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";

const allResources = [
  {
    name: "newspapers",
    list: "/newspapers",
    create: '/newspapers/create',
    edit: '/newspapers/edit/:id',
    show: '/newspapers/show/:id',
    meta: {
      label: "Газеты",
      icon: <BookOutlined />,
    },
  },
  {
    name: "issues",
    list: "/issues",
    create: '/issues/create',
    edit: '/issues/edit/:id',
    show: '/issues/show/:id',
    meta: {
      label: "Выпуски",
      icon: <CalendarOutlined />,
    },
  },
  {
    name: "articles",
    list: "/articles",
    create: '/articles/create',
    edit: '/articles/edit/:id',
    show: '/articles/show/:id',
    meta: {
      label: "Статьи",
      icon: <EditOutlined />,
    },
  },
  {
    name: "photos",
    list: "/photos",
    create: '/photos/create',
    edit: '/photos/edit/:id',
    show: '/photos/show/:id',
    meta: {
      label: "Фотографии",
      icon: <CameraOutlined />,
    },
  },
  {
    name: "layouts",
    list: "/layouts",
    create: '/layouts/create',
    edit: '/layouts/edit/:id',
    show: '/layouts/show/:id',
    meta: {
      label: "Макеты",
      icon: <LayoutOutlined />,
    },
  },
  {
    name: "advertisments",
    list: "/advertisments",
    create: '/advertisments/create',
    edit: '/advertisments/edit/:id',
    show: '/advertisments/show/:id',
    meta: {
      label: "Реклама",
      icon: <DollarOutlined />,
    },
  },
  {
    name: "advertisement-templates",
    list: "/advertisement-templates",
    create: "/advertisement-templates/create",
    edit: "/advertisement-templates/edit/:id",
    show: "/advertisement-templates/show/:id",
    meta: {
      label: "Шаблоны рекламы",
      icon: <FileProtectOutlined />,
    },
  },
];

export default function RefineApp({
  children,
  defaultMode,
}: {
  children: React.ReactNode;
  defaultMode: "light" | "dark";
}) {

  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              resources={allResources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "5dXQNc-LgkBeL-IkhHJz",
                title: {
                  text: "Newspaper"
                },
              }}
            >
              <Suspense fallback={<div>Loading content…</div>}>
                {children}
              </Suspense>
              <RefineKbar />
            </Refine>
          </DevtoolsProvider>
        </ColorModeContextProvider>
      </AntdRegistry>
    </RefineKbarProvider>
  );
}
