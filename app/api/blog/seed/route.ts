import { prisma } from "@/lib/db";
import { blogSeedSchema, slugify } from "@/lib/validation/blog";

export const dynamic = "force-dynamic";

function jsonError(status: number, code: string, message: string) {
  return Response.json(
    {
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body must be valid JSON.");
  }

  const payloadParse = blogSeedSchema.safeParse(rawPayload);
  if (!payloadParse.success) {
    return jsonError(
      400,
      "invalid_payload",
      payloadParse.error.issues[0]?.message ?? "Request body is invalid.",
    );
  }

  const prepared = payloadParse.data.map((item) => {
    const slug = item.slug ? slugify(item.slug) : slugify(item.title);
    const status = item.status ?? "draft";
    const publishedAt =
      status === "published"
        ? item.publishedAt
          ? new Date(item.publishedAt)
          : new Date()
        : null;

    return {
      title: item.title,
      slug,
      excerpt: item.excerpt ?? null,
      content: item.content,
      coverImage: item.coverImage ?? null,
      tags: item.tags,
      status,
      publishedAt,
    };
  });

  const slugSet = new Set<string>();
  for (const item of prepared) {
    if (slugSet.has(item.slug)) {
      return jsonError(409, "slug_conflict", "Duplicate slug in request.");
    }
    slugSet.add(item.slug);
  }

  const existing = await prisma.blog.findMany({
    where: { slug: { in: Array.from(slugSet) } },
    select: { slug: true },
  });

  if (existing.length > 0) {
    return jsonError(409, "slug_exists", "Slug already exists.");
  }

  const result = await prisma.blog.createMany({
    data: prepared,
  });

  return Response.json({ data: { inserted: result.count } }, { status: 201 });
}
