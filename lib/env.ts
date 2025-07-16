import { z, ZodError } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    error: () => ({ message: 'zod => The value must be one of: development, production, test.' }),
  }),
  TURSO_DATABASE_URL: z.url({
    error: () => ({ message: 'zod => The value must be a valid url.' }),
  }),
  TURSO_AUTH_TOKEN: z.string({
    error: () => ({ message: 'zod => The value must be a valid token.' }),
  }),
  BETTER_AUTH_SECRET: z.string({
    error: () => ({ message: 'zod => The value must be a valid token.' }),
  }),
  BETTER_AUTH_URL: z.string({
    error: () => ({ message: 'zod => The value must be a valid url.' }),
  }),
  AUTH_GITHUB_CLIENT_ID: z.string({
    error: () => ({ message: 'zod => The value must be a valid ID.' }),
  }),
  AUTH_GITHUB_CLIENT_SECRET: z.string({
    error: () => ({ message: 'zod => The value must be a valid token.' }),
  }),
});

function tryProcessEnv() {
  try {
    // eslint-disable-next-line node/no-process-env
    const validatedEnv = EnvSchema.parse(process.env);

    console.log('zod => Environment variables are correct.');

    return validatedEnv;
  }
  catch (error) {
    if (error instanceof ZodError) {
      console.error('zod => Environment variable validation error! Application cannot be started.\n');

      const formattedErrors = error.issues.map((issue) => {
        const path = issue.path.join('.');
        const message = issue.message;

        return `zod => Variable '${path}': ${message}`;
      });

      console.error(formattedErrors.join('\n'));
    }
    else {
      console.error(`zod => An unexpected error occurred while validating .env: ${error}`);
    }

    process.exit(1);
  }
}

const env = tryProcessEnv();

export default env;
