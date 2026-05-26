"use client";

import { useGetIdentity } from "@refinedev/core";

function getRoleName(identity: any): string {
  const raw =
    identity?.role?.name ??
    identity?.roles?.[0]?.name ??
    identity?.role ??
    identity?.roles?.[0] ??
    "";

  return String(raw).trim();
}

export function useRoleAccess() {
  const { data: identity, isLoading } = useGetIdentity<any>();
  const roleName = getRoleName(identity);

  // Case-insensitive to avoid mismatch from data sources
  const role = roleName.toLowerCase();
  const isSuperAdmin = role === "superadmin";
  const isIllustrator = role === "illustrator";
  const isAuthor = role === "author";
  const isEditor = role === "editor";
  const isAdvertiser = role === "advertiser";
  const canReviewTasks = isSuperAdmin || isEditor;
  const canWorkOnTasks = isSuperAdmin || isAuthor || isIllustrator || isAdvertiser;

  return {
    isLoading,
    roleName,
    isSuperAdmin,
    isIllustrator,
    isAuthor,
    isEditor,
    isAdvertiser,
    canManageNewspapers: isSuperAdmin,
    canManagePhotos: isSuperAdmin || isIllustrator,
    canManageArticles: isSuperAdmin || isAuthor,
    canManageIssues: isSuperAdmin || isEditor,
    canManageLayouts: isSuperAdmin || isEditor,
    canManageAdvertisments: isSuperAdmin || isAdvertiser,
    canManageAdvertisementTemplates: isSuperAdmin || isAdvertiser,
    canViewTasks: isSuperAdmin || isEditor || isAuthor || isIllustrator || isAdvertiser,
    canCreateTasks: isSuperAdmin || isEditor,
    canReviewTasks,
    canWorkOnTasks,
    canManageTasks: isSuperAdmin || isEditor,
    canViewNewspaperSummary: isSuperAdmin || isEditor,
  };
}

