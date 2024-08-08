/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
/* eslint-disable max-classes-per-file */

import AWS from 'aws-sdk';
import jsonBeautify from 'json-beautify';
import { commonConfig as config } from 'src';

const ssm = new AWS.SSM({ region: 'ap-southeast-1' });

type SSMParamType = 'JSON' | 'DOTENV';

class SSMConfigUtil<T> {
  protected readonly paramPath: string;

  stage: string;

  private paramValue: T;

  type: SSMParamType;

  constructor(stage: string, type: SSMParamType) {
    this.stage = stage;
    this.type = type;
  }

  getParamPath(): string {
    const pathItems = ['', config.PROJECT_NAME, this.stage, this.paramPath].filter((v) => v != null);
    return pathItems.join('/');
  }

  paramValueToSsmString(paramValue: T): string {
    if (this.type === 'DOTENV') {
      let envFile = '';
      for (const key of Object.keys(paramValue)) {
        envFile += `${key}=${paramValue[key]}\n`;
      }
      return envFile;
    }
    return jsonBeautify(paramValue, null, 2, 100);
  }

  // Only works with JSON type
  async getParamValueAsObject(forceRenew = false): Promise<T> {
    if (this.type === 'DOTENV') throw new Error('getParamValueAsObject only works with JSON type');
    if (!this.paramValue || forceRenew) {
      const param = await ssm.getParameter({ Name: this.getParamPath() }).promise();
      this.paramValue = JSON.parse(param.Parameter.Value) as T;
    }
    return this.paramValue;
  }

  async putParamValue(newValue: T): Promise<void> {
    await ssm
      .putParameter({
        Name: this.getParamPath(),
        Value: this.paramValueToSsmString(newValue),
        Type: 'String',
        Overwrite: true,
      })
      .promise();
  }
}

interface IAwsExports {
  VITE_AWS_REGION: string;
  // Dont need this for now
  // VITE_AWS_COGNITO_IDENDITY_POOL_ID: string;
  VITE_AWS_USER_POOLS_ID: string;
  VITE_AWS_USER_POOLS_WEB_CLIENT_ID: string;
  VITE_AWS_TFINAPI_ENDPOINT_AUTHUSER: string;
  VITE_AWS_TFINAPI_ENDPOINT_AUTHROLE: string;
  VITE_AWS_TFINAPI_ENDPOINT_AUTHNONE: string;
  VITE_AWS_OATH_DOMAIN: string;
}

export class AwsExports extends SSMConfigUtil<IAwsExports> {
  protected readonly paramPath = 'aws-exports';
}

// Why can't I move this to config/types
interface IOutlookAuthConfig {
  token: string;
  expiryDate: Date;
}

export class OutlookAuthConfig extends SSMConfigUtil<IOutlookAuthConfig> {
  protected readonly paramPath = 'outlook-auth-config';
}
