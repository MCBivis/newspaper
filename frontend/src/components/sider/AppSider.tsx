"use client";

import React from "react";
import { Layout, Menu, Button } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@utility/constants";
import { resources } from "@/app/resources";
import { useRoleAccess } from "@hooks/useRoleAccess";

const { Sider } = Layout;

export function AppSider() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { canViewTasks, isLoading } = useRoleAccess();

  const menuItems = resources
    .filter((r) => r.name !== "tasks" || isLoading || canViewTasks)
    .map((r) => ({
      key: r.list,
      icon: r.meta?.icon,
      label: r.meta?.label ?? r.name,
      onClick: () => router.push(r.list),
    }));

  const selectedKeys = menuItems
    .map((i) => i.key)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`));

  return (
    <Sider
      width={220}
      style={{
        background: "#fff",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 12, fontWeight: 700 }}>Newspaper</div>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems as any}
        />
      </div>

      <div style={{ padding: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <Button
          danger
          block
          onClick={() => {
            Cookies.remove(TOKEN_KEY, { path: "/" });
            router.replace("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}

