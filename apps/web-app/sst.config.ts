/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'strixy',
      home: 'aws',
    };
  },
  async run() {
    const domainName = $app.stage === 'prod' ? 'strixy.ai' : $app.stage + '.strixy.ai';

    const NODE_ENV = $app.stage === 'prod' ? 'production' : 'development';

    new sst.aws.Nextjs('WebApp', {
      buildCommand: 'echo buildeded by turbo',
      // domain: { name: domainName }
    });
  },
});
