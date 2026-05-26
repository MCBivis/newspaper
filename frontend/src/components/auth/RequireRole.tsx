"use client";

import { useGetIdentity } from "@refinedev/core";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export type RequireRoleProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

function extractRoleName(identity: any): string | null {
  return (
    identity?.role?.name ||
    identity?.roles?.[0]?.name ||
    identity?.role?.id ||
    identity?.role ||
    null
  );
}

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const router = useRouter();
  const { data: identity, isLoading } = useGetIdentity<any>();

  const roleName = extractRoleName(identity);
  const normalizedRole = roleName ? String(roleName).toLowerCase() : null;
  const allowed = normalizedRole
    ? allowedRoles.some((role) => role.toLowerCase() === normalizedRole)
    : false;

  useEffect(() => {
    if (isLoading) return;

    // If identity is missing, treat as unauthorized.
    if (!identity || !allowed) {
      router.replace("/unauthorized");
    }
  }, [allowed, identity, isLoading, router]);

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  if (!identity || !allowed) {
    return null;
  }

  return <>{children}</>;
}

