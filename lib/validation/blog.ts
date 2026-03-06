import { z } from "zod";

export const MAX_PAGE_SIZE = 50;

export const blogStatusSchema = z.enum(["draft", "published"]);

const trimString = (value: string) => value.trim();

const optionalTrimmedStringSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.string().optional());

const nullableTrimmedStringSchema = z.preprocess((value) => {
  if (value === null) return null;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}, z.string().nullable());

const tagsSchema = z.preprocess(
  (value) => {
    if (!Array.isArray(value)) return value;
    return value;
  },
  z
    .array(z.string())
    .transform((tags) => tags.map((tag) => tag.trim()).filter(Boolean)),
);

const publishedAtSchema = z.preprocess((value) => {
  if (value === null) return null;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}, z.string().datetime().nullable());

export const blogListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(10),
  search: z.string().optional().default("").transform(trimString),
  tag: z.string().optional().default("").transform(trimString),
  status: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, blogStatusSchema.optional()),
});

export const blogCreateSchema = z.object({
  title: z
    .string()
    .transform(trimString)
    .refine((value) => value.length > 0, { message: "Title is required." }),
  slug: optionalTrimmedStringSchema,
  excerpt: nullableTrimmedStringSchema.optional(),
  content: z
    .string()
    .transform(trimString)
    .refine((value) => value.length > 0, { message: "Content is required." }),
  coverImage: nullableTrimmedStringSchema.optional(),
  tags: tagsSchema.optional().default([]),
  status: blogStatusSchema.optional(),
  publishedAt: publishedAtSchema.optional(),
});

export const blogPatchSchema = z
  .object({
    title: z
      .string()
      .transform(trimString)
      .refine((value) => value.length > 0, {
        message: "Title cannot be empty.",
      })
      .optional(),
    slug: optionalTrimmedStringSchema,
    excerpt: nullableTrimmedStringSchema.optional(),
    content: z
      .string()
      .transform(trimString)
      .refine((value) => value.length > 0, {
        message: "Content cannot be empty.",
      })
      .optional(),
    coverImage: nullableTrimmedStringSchema.optional(),
    tags: tagsSchema.optional(),
    status: blogStatusSchema.optional(),
    publishedAt: publishedAtSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required.",
  });

export const blogSeedSchema = z
  .array(blogCreateSchema)
  .min(1, { message: "Request body must be a non-empty array." });

export function slugify(input: string) {
  const trimmed = input.trim().toLowerCase();
  const slug = trimmed
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return slug || "blog";
}
