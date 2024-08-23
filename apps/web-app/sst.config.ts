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

    const bucketSurveyUploads = new sst.aws.Bucket('BucketSurveyUploads');
    const bucketSurveyProcessed = new sst.aws.Bucket('BucketSurveyEnriched');

    // const resultsBucket = new sst.aws.Bucket('SurveyBucket');
    // const surveyBucket = new sst.aws.Bucket('SurveyBucket', {transform: {bucket: {bucket: getConstructName('survey-bucket')}}});

    new sst.aws.Nextjs('WebApp', {
      buildCommand: 'echo buildeded by turbo',
      link: [bucketSurveyUploads, bucketSurveyProcessed],
      // domain: { name: domainName }
    });
  },
});
