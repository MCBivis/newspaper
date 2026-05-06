"use client";

import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  theme,
  Typography,
} from "antd";
import React from "react";
import { useRoleAccess } from "@hooks/useRoleAccess";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { roleName } = useRoleAccess();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 32px",
    height: "72px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space size="middle">
        {roleName && (
          <Text type="secondary" style={{ marginRight: 8 }}>
            Role: {roleName}
          </Text>
        )}
        {(user?.name || user?.username || user?.email || user?.avatar) && (
          <Space style={{ marginLeft: "8px" }} size="middle">
            {(user?.name || user?.username || user?.email) && (
              <Text strong>{user?.name || user?.username || user?.email}</Text>
            )}
            {user?.avatar && (
              <Avatar
                src={user?.avatar}
                alt={user?.name || user?.username || user?.email}
              />
            )}
          </Space>
        )}
      </Space>
    </AntdLayout.Header>
  );
};
