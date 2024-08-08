/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */

import buildLocalServer from './local-server';

// this fix was recommended here https://github.com/wclr/ts-node-dev/issues/258
// But was causing issues with restarting so I removed it
// process.on('uncaughtException', (error) => {
//   // make sure the process exits if we hit a compilation error, so ts-node-dev can restart on next change
//   if (error.message.includes('Unable to compile TypeScript')) process.exit(0);
// });

buildLocalServer();
