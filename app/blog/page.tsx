import { prisma } from "@/lib/db";
import BlogCard from "./_components/BlogCard";

export const revalidate = 600;

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div>
      {blogs.map((item) => (
        <BlogCard key={item.id} blog={item} />
      ))}
    </div>
  );
}
