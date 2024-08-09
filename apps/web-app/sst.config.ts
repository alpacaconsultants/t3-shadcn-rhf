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

    new sst.aws.Nextjs('WebApp', {
      buildCommand: 'yarn open:next:build',
      // domain: { name: domainName }
    });
  },
});
