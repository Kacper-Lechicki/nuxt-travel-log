import type { DrizzleError } from 'drizzle-orm';

import slugify from 'slug';

import { findExistingLocation, findUniqueSlug, insertLocation } from '~/lib/db/queries/location';
import { InsertLocation } from '~/lib/db/schema';
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

  const existingLocation = await findExistingLocation(result.data, user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'A location with that name already exists.',
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return await insertLocation(result.data, slug, user.id);
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
