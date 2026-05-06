"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { API_URL, TOKEN_KEY } from "@utility/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Card, Form, Input, Typography, Alert } from "antd";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = useMemo(() => from || "/layouts", [from]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/local`, {
        identifier: values.email,
        password: values.password,
      });

      if (!data?.jwt) {
        throw new Error("Strapi did not return jwt");
      }

      Cookies.set(TOKEN_KEY, data.jwt, {
        expires: 7,
        sameSite: "lax",
        path: "/",
      });

      router.push(redirectTo);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "64px auto", padding: 16 }}>
      <Card title="Login">
        <Typography.Paragraph>
          Введите email и пароль пользователя Strapi.
        </Typography.Paragraph>

        {error && (
          <Alert
            style={{ marginBottom: 16 }}
            type="error"
            message={error}
            showIcon
          />
        )}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Введите email" }]}
          >
            <Input placeholder="name@example.com" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

