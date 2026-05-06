"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Result
      status="403"
      title="Нет доступа"
      subTitle="Ваш аккаунт не имеет прав на эту операцию."
      extra={[
        <Button key="back" type="primary" onClick={() => router.push("/layouts")}>
          На главную
        </Button>,
      ]}
    />
  );
}

