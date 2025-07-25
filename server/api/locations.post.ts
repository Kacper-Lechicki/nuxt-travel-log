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

  const [created] = await db.insert(location).values({
    ...result.data,
    slug: result.data.name.replaceAll(' ', '-').toLowerCase(),
    userId: user.id,
  }).returning();

  return created;
});
