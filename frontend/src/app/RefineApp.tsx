// src/app/RefineApp.tsx
"use client";
import { DevtoolsProvider } from "@providers/devtools";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import React, {
  useEffect,
  useState,
  Suspense,
} from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import { authProvider } from "@providers/auth-provider";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@utility/constants";
import { usePathname, useRouter } from "next/navigation";
import "@refinedev/antd/dist/reset.css";
import { resources } from "@/app/resources";

function ClientAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const publicRoutes = ["/login", "/unauthorized"];
    const isPublic = publicRoutes.some((route) => pathname?.startsWith(route));
    if (isPublic) return;

    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      const from = pathname || "/";
      router.replace(`/login?from=${encodeURIComponent(from)}`);
    }
  }, [mounted, pathname, router]);

  const publicRoutes = ["/login", "/unauthorized"];
  const isPublic = publicRoutes.some((route) => pathname?.startsWith(route));
  if (isPublic) return <>{children}</>;

  // Hydration-safe: render nothing until mounted,
  // then decide based on cookie token.
  if (!mounted) return null;

  const hasToken = Boolean(Cookies.get(TOKEN_KEY));
  if (!hasToken) return null;

  return <>{children}</>;
}

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
              authProvider={authProvider}
              notificationProvider={useNotificationProvider}
              resources={resources as any}
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
                <ClientAuthGate>{children}</ClientAuthGate>
              </Suspense>
              <RefineKbar />
            </Refine>
          </DevtoolsProvider>
        </ColorModeContextProvider>
      </AntdRegistry>
    </RefineKbarProvider>
  );
}
