import { prisma } from "@/lib/db";
import BlogCard from "./_components/BlogCard";
import Pagination from "./_components/Pagination";

export const revalidate = 600;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page = 1 } = await searchParams;

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    skip: (+page - 1) * 10,
  });
  const count = await prisma.blog.count();
  const totalPage = Math.ceil(count / 10);

  return (
    <div>
      {blogs.map((item) => (
        <BlogCard key={item.id} blog={item} />
      ))}
      <Pagination totalPage={totalPage} currentPage={+page} />
    </div>
  );
}
