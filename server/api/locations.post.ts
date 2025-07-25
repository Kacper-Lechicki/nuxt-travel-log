import type { DrizzleError } from 'drizzle-orm';

import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import slugify from 'slug';

import db from '~/lib/db';
import { InsertLocation, location } from '~/lib/db/schema';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = 'Please check your input and try again.';

    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join('')] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  let slug = slugify(result.data.name);
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);

  const existingLocation = await db.query.location.findFirst({
    where:
      and(
        eq(location.slug, slug),
        eq(location.userId, user.id),
        eq(location.name, result.data.name),
      ),
    columns: { id: true },
  });

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'A location with that name already exists.',
    }));
  }

  const existing = !!(await db.query.location.findFirst({
    where:
      eq(location.slug, slug),
    columns: { id: true },
  }));

  if (existing) {
    for (let attempts = 0; attempts < 10; attempts++) {
      const candidateSlug = `${slug}-${nanoid()}`;

      const exists = await db.query.location.findFirst({
        where: eq(location.slug, candidateSlug),
        columns: { id: true },
      });

      if (!exists) {
        slug = candidateSlug;
        break;
      }
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: user.id,
    }).returning();

    return created;
  }
  catch (e) {
    const error = e as DrizzleError;

    if (error.cause?.toString().includes('UNIQUE constraint failed: location.slug')) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: 'Slug must be unique (the location name is used to generate the slug).',
      }));
    }

    throw e;
  }
});
