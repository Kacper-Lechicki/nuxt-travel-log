import type { H3Event, H3EventContext } from 'h3';

import type { UserWithId } from '~/lib/auth';

import { auth } from '~/lib/auth';

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

export default function defineAuthenticatedEventHandler(
  handler: (event: AuthenticatedEvent) => any,
) {
  return defineEventHandler(async (event: H3Event) => {
    const session = await auth.api.getSession({
      headers: event.node.req.headers as any,
    });

    if (!session?.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: 'Unauthorized.',
      }));
    }

    event.context.user = {
      ...session.user,
      id: Number(session.user.id),
    };

    return handler(event as AuthenticatedEvent);
  });
}
