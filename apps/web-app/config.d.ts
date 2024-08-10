import './.sst/platform/src/global.js';
import '../types.generated';
import { type AppInput, type App, type Config } from './.sst/platform/src/config.js';
import * as _aws from '@pulumi/aws';

declare global {
  // @ts-expect-error
  export import aws = _aws;
  interface Providers {
    providers?: {
      aws?: (_aws.ProviderArgs & { version?: string }) | boolean;
    };
  }
  export const $config: (
    input: Omit<Config, 'app'> & {
      app(input: AppInput): Omit<App, 'providers'> & Providers;
    }
  ) => Config;
}
