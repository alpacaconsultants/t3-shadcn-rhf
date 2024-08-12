/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />

const getConstructName = (constuctName: string): string => [$app.name, $app.stage, constuctName].join('-');

export default $config({
  app(input) {
    return {
      name: 'strixy',
      home: 'aws',
    };
  },
  async run() {
    const domainName = $app.stage === 'prod' ? 'strixy.ai' : `${$app.stage}.strixy.ai`;

    const NODE_ENV = $app.stage === 'prod' ? 'production' : 'development';

    const surveyBucket = new sst.aws.Bucket('SurveyBucket');

    new sst.aws.Nextjs('WebApp', {
      buildCommand: 'echo buildeded by turbo',
      link: [surveyBucket],
      // domain: { name: domainName }
    });
  },
});
