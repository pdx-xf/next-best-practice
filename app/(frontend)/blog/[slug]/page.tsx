import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    select: { slug: true },
  });

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({ where: { slug } });

  if (!blog) {
    notFound();
  }

  const { coverImage, title, content, tags } = blog;

  return (
    <div>
      <div>{coverImage}</div>
      <div>{title}</div>
      <div>{content}</div>
      <div>
        {tags?.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
