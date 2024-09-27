/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />

import * as path from 'node:path';
import * as dotenv from 'dotenv';
// dotenv.config({ path: path.join(process.env.INIT_CWD!, `/.env.${$app.stage}`) });

const getConstructName = (constuctName: string): string => [$app.name, $app.stage, constuctName].join('-');

export default $config({
  app(input) {
    return {
      name: 'strixy',
      home: 'aws',
    };
  },
  async run() {
    dotenv.config({
      path: path.join(require.resolve('@strixy/web-app'), `./../.env.${$app.stage}`),
      override: true,
    });
    if (!process.env.APP_URL) throw new Error('APP_URL not set');

    const domainName = process.env.APP_URL.split('//').pop();

    if (!domainName) throw new Error('APP_URL not found');

    const NODE_ENV = $app.stage === 'prod' ? 'production' : 'development';

    const bucketSurveyUploads = new sst.aws.Bucket('BucketSurveyUploads');
    const bucketSurveyProcessed = new sst.aws.Bucket('BucketSurveyEnriched');

    const email = new sst.aws.Email('EmailAlpaca', {
      sender: 'alpacaconsultants.com',
      dmarc: 'v=DMARC1; p=quarantine; adkim=s; aspf=s;',
    });

    // const resultsBucket = new sst.aws.Bucket('SurveyBucket');
    // const surveyBucket = new sst.aws.Bucket('SurveyBucket', {transform: {bucket: {bucket: getConstructName('survey-bucket')}}});

    new sst.aws.Nextjs('WebApp', {
      path: path.join(require.resolve('@strixy/web-app'), `./..`),
      buildCommand: 'echo buildeded by turbo',
      link: [bucketSurveyUploads, bucketSurveyProcessed, email],
      domain: { name: domainName },
    });
  },
});
