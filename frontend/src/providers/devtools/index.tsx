"use client";

import React from "react";

export const DevtoolsProvider = (props: React.PropsWithChildren) => {
  // Disable refine devtools in this project setup to avoid noisy
  // local requests like `/:port/api/.auth/sessions/whoami`.
  return <>{props.children}</>;
};
