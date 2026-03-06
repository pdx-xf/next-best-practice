import { prisma } from "@/lib/db";
import {
  blogCreateSchema,
  blogListQuerySchema,
  slugify,
} from "@/lib/validation/blog";
import type { ApiErrorResponse, ApiListResponse } from "@/lib/types/api";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const dynamic = "force-dynamic";

type BlogListItem = Awaited<ReturnType<typeof prisma.blog.findMany>>[number];

function jsonError(status: number, code: string, message: string) {
  const payload: ApiErrorResponse = {
    error: {
      code,
      message,
    },
  };

  return Response.json(payload, { status });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParse = blogListQuerySchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!queryParse.success) {
    return jsonError(
      400,
      "invalid_query",
      queryParse.error.issues[0]?.message ?? "Invalid query parameters.",
    );
  }

  const { page, pageSize, search, tag, status } = queryParse.data;

  const where = {
    ...(status ? { status } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  } as any;

  // 利用 Promise 的特性
  //   const [total, data] = await Promise.all([
  //     prisma.blog.count({ where }),
  //     prisma.blog.findMany({
  //       where,
  //       orderBy: { createdAt: "desc" },
  //       skip: (page - 1) * pageSize,
  //       take: pageSize,
  //     }),
  //   ]);

  // 使用事务 (Transaction)
  const [total, data] = await prisma.$transaction([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const payload = {
    data,
    meta: {
      page,
      pageSize,
      total,
    },
  } satisfies ApiListResponse<BlogListItem>;

  return Response.json(payload);
}

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body must be valid JSON.");
  }

  const payloadParse = blogCreateSchema.safeParse(rawPayload);
  if (!payloadParse.success) {
    return jsonError(
      400,
      "invalid_payload",
      payloadParse.error.issues[0]?.message ?? "Request body is invalid.",
    );
  }

  const { title, content, excerpt, coverImage, tags, status, publishedAt } =
    payloadParse.data;
  const slug = payloadParse.data.slug
    ? slugify(payloadParse.data.slug)
    : slugify(title);

  const resolvedStatus = status ?? "draft";
  const resolvedPublishedAt =
    resolvedStatus === "published"
      ? publishedAt
        ? new Date(publishedAt)
        : new Date()
      : null;

  try {
    const data = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? null,
        content,
        coverImage: coverImage ?? null,
        tags,
        status: resolvedStatus,
        publishedAt: resolvedPublishedAt,
      },
    });

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonError(409, "slug_exists", "Slug already exists.");
    }

    throw error;
  }
}
