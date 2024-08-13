/* eslint-disable no-console */
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { getServerAuthSession } from '../auth';

const DEFAULT_SERVER_ERROR_MESSAGE = 'An error occurred while executing the action.';

// Base client.
export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z
      .object({
        actionName: z.string().optional(),
      })
      .optional();
  },
  // Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
  console.log('LOGGING MIDDLEWARE');

  // Here we await the action execution.
  const result = await next({ ctx: null });

  console.log('Result ->', result);
  console.log('Client input ->', clientInput);
  console.log('Metadata ->', metadata);

  // And then return the result of the awaited action.
  return result;
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
    const session = await getServerAuthSession();

    if (!session) {
      throw new Error('Session not found!');
    }

    const userId = session.user.id;

    if (!userId) {
      throw new Error('Session is not valid!');
    }

    // Return the next middleware with `userId` value in the context
    return next({ ctx: { user: session.user } });
  });

// Here is my own version of this

/* eslint-disable no-console */
// import { type z } from 'zod';
// import { getServerAuthSession } from '../auth';

// type Session = Awaited<ReturnType<typeof getServerAuthSession>>;

// type AuthenticatedServerAction<Input, Return> = (args: { session: Session; input: Input }) => Promise<Return>;

// type Role = 'user' | 'admin' | 'superadmin'; //

// class ServerActionBuilder<Input = void> {
//   private inputSchema?: z.ZodType<Input>;
//   private requireAuth = false;
//   private requiredRoles: Role[] = [];

//   input<NewInput>(schema: z.ZodType<NewInput>): ServerActionBuilder<NewInput> {
//     const builder = new ServerActionBuilder<NewInput>();
//     builder.inputSchema = schema;
//     builder.requireAuth = this.requireAuth;
//     builder.requiredRoles = this.requiredRoles;
//     return builder;
//   }

//   auth(roles?: Role | Role[]): this {
//     this.requireAuth = true;
//     if (roles) {
//       this.requiredRoles = Array.isArray(roles) ? roles : [roles];
//     }
//     return this;
//   }

//   action<Return>(fn: AuthenticatedServerAction<Input, Return>): (data?: Input) => Promise<Return> {
//     return async (data?: Input): Promise<Return> => {
//       let session: Session;

//       if (this.requireAuth) {
//         session = await getServerAuthSession();
//         if (!session || !session.user) {
//           throw new Error('Not authenticated');
//         }
//         // if (this.requiredRoles.length > 0) {
//         //   const userRole = session.user.role as Role; // Assume role is stored in the session
//         //   if (!this.requiredRoles.includes(userRole)) {
//         //     throw new Error('Insufficient permissions');
//         //   }
//         // }
//       } else {
//         session = await getServerAuthSession();
//       }

//       let validatedInput: Input;
//       if (this.inputSchema) {
//         validatedInput = this.inputSchema.parse(data);
//       } else {
//         validatedInput = data as Input;
//       }

//       return fn({ session, input: validatedInput });
//     };
//   }
// }

// export const serverAction = () => new ServerActionBuilder();
