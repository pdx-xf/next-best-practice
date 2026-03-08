"use client";

import { useRouter } from "next/navigation";

export default function Pagination({
  totalPage,
  currentPage,
}: {
  totalPage: number;
  currentPage: number;
}) {
  const router = useRouter();
  
  return (
    <div>
      <button
        onClick={() => {
          if (currentPage === 1) return;
          router.push(`/blog?page=${currentPage - 1}`);
        }}
      >
        上一页
      </button>
      <button
        onClick={() => {
          if (currentPage === totalPage) return;
          router.push(`/blog?page=${currentPage + 1}`);
        }}
      >
        下一页
      </button>
    </div>
  );
}
