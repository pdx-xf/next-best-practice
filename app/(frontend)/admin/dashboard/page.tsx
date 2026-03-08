"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { authClient } from "@/lib/auth-client";

export default function DashBoardPage() {
  const router = useRouter();
  const { data: sessionData, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isPending && !sessionData) {
      router.replace("/admin/sign-in");
    }
  }, [isPending, router, sessionData]);

  const handleSignOut = async () => {
    setErrorMessage("");
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result?.error) {
        setErrorMessage(result.error.message || "退出登录失败，请稍后重试。");
        return;
      }

      router.replace("/admin/sign-in");
      router.refresh();
    } catch {
      setErrorMessage("退出登录失败，请稍后重试。");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
        <div className="w-full max-w-5xl animate-pulse space-y-4">
          <div className="h-28 rounded-2xl bg-zinc-200" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-36 rounded-2xl bg-zinc-200" />
            <div className="h-36 rounded-2xl bg-zinc-200" />
            <div className="h-36 rounded-2xl bg-zinc-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!sessionData) {
    return null;
  }

  const expiresAt = sessionData.session.expiresAt
    ? new Date(sessionData.session.expiresAt).toLocaleString("zh-CN", {
        hour12: false,
      })
    : "-";

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">管理员控制台</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                欢迎回来，{sessionData.user.name}
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                当前登录账号：{sessionData.user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon
                icon="material-symbols:logout-rounded"
                className="h-4 w-4"
              />
              {isSigningOut ? "退出中..." : "退出登录"}
            </button>
          </div>

          {errorMessage ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <Icon
                icon="material-symbols:verified-user-outline-rounded"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium">邮箱验证</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-zinc-900">
              {sessionData.user.emailVerified ? "已验证" : "未验证"}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              建议保持验证状态，提升账号安全性。
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <Icon
                icon="material-symbols:schedule-outline-rounded"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium">会话到期时间</span>
            </div>
            <p className="mt-4 text-base font-semibold text-zinc-900">
              {expiresAt}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              到期前保持活跃可自动刷新会话。
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <Icon
                icon="material-symbols:devices-outline-rounded"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium">当前设备</span>
            </div>
            <p className="mt-4 line-clamp-2 text-sm font-medium text-zinc-900">
              {sessionData.session.userAgent || "未记录设备信息"}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              IP：{sessionData.session.ipAddress || "未记录"}
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-semibold text-zinc-900">快捷入口</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/blog"
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              前往博客列表
              <Icon
                icon="material-symbols:arrow-forward-rounded"
                className="h-4 w-4"
              />
            </Link>

            <button
              type="button"
              onClick={() => router.refresh()}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              刷新当前页面
              <Icon
                icon="material-symbols:refresh-rounded"
                className="h-4 w-4"
              />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
