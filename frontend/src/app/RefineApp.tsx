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
} from "@ant-design/icons";

const allResources = [
  {
    name: "layouts",
    list: "/layouts",
    meta: {
      label: "Layouts",
      icon: <AppstoreOutlined />,
    },
  },
  {
    name: "photos",
    list: "/photos",
    meta: {
      label: "Photos",
      icon: <PictureOutlined />,
    },
  },
  {
    name: "newspapers",
    list: "/newspapers",
    meta: {
      label: "Newspapers",
      icon: <ContainerOutlined />,
    },
  },
  {
    name: "articles",
    list: "/articles",
    meta: {
      label: "Articles",
      icon: <ProfileOutlined />,
    },
  },
  {
    name: "advertisments",
    list: "/advertisments",
    meta: {
      label: "Advertisements",
      icon: <FileDoneOutlined />,
    },
  },
  {
    name: "advertisement-templates",
    list: "/advertisement-templates",
    meta: {
      label: "Advertisement Templates",
      icon: <FileTextOutlined />,
    },
  },
  {
    name: "issues",
    list: "/issues",
    meta: {
      label: "Issues",
      icon: <FileSearchOutlined />,
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
