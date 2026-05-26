"use client";

import { Select, SelectProps } from "antd";
import { axiosInstance } from "@utility/axios-instance";
import { useEffect, useMemo, useState } from "react";

type AppUser = {
  id: number;
  username: string;
  email?: string;
  role?: {
    name?: string;
  } | null;
};

type RoleUserSelectProps = Omit<SelectProps, "options"> & {
  roles?: string[];
};

export default function RoleUserSelect({ roles, ...props }: RoleUserSelectProps) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);

  const rolesKey = useMemo(() => roles?.join(",") || "", [roles]);

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/app-users", {
          params: rolesKey ? { roles: rolesKey } : undefined,
        });

        if (mounted) {
          setUsers(response.data?.data || []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [rolesKey]);

  return (
    <Select
      {...props}
      loading={loading}
      options={users.map((user) => ({
        value: user.id,
        label: `${user.username}${user.role?.name ? ` (${user.role.name})` : ""}`,
      }))}
      showSearch
      optionFilterProp="label"
    />
  );
}
