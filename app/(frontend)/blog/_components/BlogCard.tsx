"use client";

import { BlogListItem } from "@/app/api/blog/route";
import { useRouter } from "next/navigation";

export default function BlogCard({ blog }: { blog: BlogListItem }) {
  const router = useRouter();
  return (
    <div onClick={() => router.push(`/blog/${blog.slug}`)}>{blog.title}</div>
  );
}
