import { type z } from 'zod';
import { getServerAuthSession } from '../auth';

type Session = Awaited<ReturnType<typeof getServerAuthSession>>;

type AuthenticatedServerAction<Input, Return> = (args: { session: Session; input: Input }) => Promise<Return>;

type Role = 'user' | 'admin' | 'superadmin'; //

class ServerActionBuilder<Input = void> {
  private inputSchema?: z.ZodType<Input>;
  private requireAuth = false;
  private requiredRoles: Role[] = [];

  input<NewInput>(schema: z.ZodType<NewInput>): ServerActionBuilder<NewInput> {
    const builder = new ServerActionBuilder<NewInput>();
    builder.inputSchema = schema;
    builder.requireAuth = this.requireAuth;
    builder.requiredRoles = this.requiredRoles;
    return builder;
  }

  auth(roles?: Role | Role[]): this {
    this.requireAuth = true;
    if (roles) {
      this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    }
    return this;
  }

  action<Return>(fn: AuthenticatedServerAction<Input, Return>): (data?: Input) => Promise<Return> {
    return async (data?: Input): Promise<Return> => {
      let session: Session | undefined;

      if (this.requireAuth) {
        session = await getServerAuthSession();
        if (!session || !session.user) {
          throw new Error('Not authenticated');
        }
        // if (this.requiredRoles.length > 0) {
        //   const userRole = session.user.role as Role; // Assume role is stored in the session
        //   if (!this.requiredRoles.includes(userRole)) {
        //     throw new Error('Insufficient permissions');
        //   }
        // }
      } else {
        session = await getServerAuthSession();
      }

      let validatedInput: Input;
      if (this.inputSchema) {
        validatedInput = this.inputSchema.parse(data);
      } else {
        validatedInput = data as Input;
      }

      return fn({ session, input: validatedInput });
    };
  }
}

export const serverAction = () => new ServerActionBuilder();
