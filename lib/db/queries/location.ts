import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

import type { InsertLocation } from '~/lib/db/schema';

import db from '..';
import { location } from '../schema';

export async function findExistingLocation(existing: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where:
      and(
        eq(location.userId, userId),
        eq(location.name, existing!.name),
      ),
    columns: { id: true },
  });
}

export async function findUniqueSlug(baseSlug: string) {
  const existing = !!(await findLocationBySlug(baseSlug));
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);

  if (existing) {
    for (let attempts = 0; attempts < 10; attempts++) {
      const idSlug = `${baseSlug}-${nanoid()}`;
      const exists = !!(await findLocationBySlug(idSlug));

      if (!exists) {
        baseSlug = idSlug;
        break;
      }
    }
  }

  return baseSlug;
}

export async function findLocationBySlug(slug: string) {
  return await db.query.location.findFirst({
    where:
      eq(location.slug, slug),
    columns: { id: true },
  });
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();

  return created;
}
