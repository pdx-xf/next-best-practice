"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: SignUpForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState<SignUpForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("两次输入的密码不一致，请检查后重试。");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("密码长度至少为 8 位。");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        callbackURL: "/",
      });

      if (result.error) {
        setErrorMessage(result.error.message || "注册失败，请稍后重试。");
        return;
      }

      setSuccessMessage("注册成功，正在跳转...");
      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("注册失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">创建账号</h1>
        <p className="mt-2 text-sm text-zinc-600">填写信息后即可完成注册。</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              昵称
            </span>
            <input
              required
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
              placeholder="请输入昵称"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              邮箱
            </span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
              placeholder="请输入邮箱"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              密码
            </span>
            <input
              required
              minLength={8}
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
              placeholder="至少 8 位"
              autoComplete="new-password"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              确认密码
            </span>
            <input
              required
              minLength={8}
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
              placeholder="再次输入密码"
              autoComplete="new-password"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          已有账号？
          <Link
            href="/sign-in"
            className="ml-1 font-medium text-zinc-900 hover:underline"
          >
            去登录
          </Link>
        </p>
      </section>
    </main>
  );
}
