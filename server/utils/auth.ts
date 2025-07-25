import type { H3Event } from 'h3';

import { auth } from '~/lib/auth';

export async function requireAuth(event: H3Event) {
  const session = await auth.api.getSession({
    headers: event.node.req.headers as any,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  event.context.user = {
    ...session.user,
    id: Number(session.user.id),
  };

  return event.context.user;
}
