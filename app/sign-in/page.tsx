"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { authClient } from "@/lib/auth-client";

type SignInForm = {
  email: string;
  password: string;
};

const initialForm: SignInForm = {
  email: "",
  password: "",
};

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState<SignInForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProviderLoading, setSocialProviderLoading] = useState<
    "github" | "google" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: "/",
      });

      if (result.error) {
        setErrorMessage(result.error.message || "登录失败，请检查账号和密码。");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("登录失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSocialSignIn = async (provider: "github" | "google") => {
    setErrorMessage("");
    setSocialProviderLoading(provider);

    const providerLabel = provider === "github" ? "GitHub" : "Google";

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || `${providerLabel} 登录失败，请稍后重试。`,
        );
      }
    } catch {
      setErrorMessage(`${providerLabel} 登录失败，请稍后重试。`);
    } finally {
      setSocialProviderLoading(null);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">登录账号</h1>
        <p className="mt-2 text-sm text-zinc-600">使用邮箱和密码登录。</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSocialSignIn("github")}
            disabled={isSubmitting || socialProviderLoading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon icon="mdi:github" className="h-4 w-4" />
            {socialProviderLoading === "github"
              ? "跳转 GitHub 中..."
              : "使用 GitHub 登录"}
          </button>

          <button
            type="button"
            onClick={() => onSocialSignIn("google")}
            disabled={isSubmitting || socialProviderLoading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon icon="logos:google-icon" className="h-4 w-4" />
            {socialProviderLoading === "google"
              ? "跳转 Google 中..."
              : "使用 Google 登录"}
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-500">或</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
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
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || socialProviderLoading !== null}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          还没有账号？
          <Link
            href="/sign-up"
            className="ml-1 font-medium text-zinc-900 hover:underline"
          >
            去注册
          </Link>
        </p>
      </section>
    </main>
  );
}
