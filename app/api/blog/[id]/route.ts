import { prisma } from "@/lib/db";
import { blogPatchSchema, slugify } from "@/lib/validation/blog";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function jsonError(status: number, code: string, message: string) {
  return Response.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const data = await prisma.blog.findUnique({ where: { id } });

  if (!data) {
    return jsonError(404, "not_found", "Blog not found.");
  }

  return Response.json({ data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body must be valid JSON.");
  }

  const payloadParse = blogPatchSchema.safeParse(rawPayload);
  if (!payloadParse.success) {
    return jsonError(
      400,
      "invalid_payload",
      payloadParse.error.issues[0]?.message ?? "Request body is invalid.",
    );
  }

  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    return jsonError(404, "not_found", "Blog not found.");
  }

  const payload = payloadParse.data;
  const data: {
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    coverImage?: string | null;
    tags?: string[];
    status?: "draft" | "published";
    publishedAt?: Date | null;
  } = {};

  if (payload.title) {
    data.title = payload.title;
  }

  if (payload.content) {
    data.content = payload.content;
  }

  if (payload.excerpt !== undefined) {
    data.excerpt = payload.excerpt;
  }

  if (payload.coverImage !== undefined) {
    data.coverImage = payload.coverImage;
  }

  if (payload.tags !== undefined) {
    data.tags = payload.tags;
  }

  if (payload.slug) {
    const slug = slugify(payload.slug);
    if (slug !== existing.slug) {
      const slugExists = await prisma.blog.findUnique({ where: { slug } });
      if (slugExists) {
        return jsonError(409, "slug_exists", "Slug already exists.");
      }
    }
    data.slug = slug;
  }

  if (payload.status) {
    data.status = payload.status;
    if (data.status === "published") {
      data.publishedAt = payload.publishedAt
        ? new Date(payload.publishedAt)
        : (existing.publishedAt ?? new Date());
    } else {
      data.publishedAt = null;
    }
  } else if (payload.publishedAt !== undefined) {
    data.publishedAt = payload.publishedAt
      ? new Date(payload.publishedAt)
      : null;
  }

  const updated = await prisma.blog.update({
    where: { id },
    data,
  });

  return Response.json({ data: updated });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    return jsonError(404, "not_found", "Blog not found.");
  }

  await prisma.blog.delete({ where: { id } });
  return Response.json({ data: null });
}
