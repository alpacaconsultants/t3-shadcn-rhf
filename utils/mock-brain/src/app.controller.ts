import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import * as path from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(process.env.PROJECT_CWD!, `apps/web-app/.env`),
});

interface IEnrichFileInput {
  downloadUrl: string;
  uploadUrl: string;
  callbackUrl: string;
  context: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/juicer')
  juicer(@Body() enrichFileInput: IEnrichFileInput): true {
    console.log('enrichFileInput!', JSON.stringify(enrichFileInput));
    setTimeout(async () => {
      // Create a read stream for the CSV file
      const filePath = path.join(
        process.env.INIT_CWD,
        '/src/mocks/processed-file.csv',
      );

      console.log(filePath);
      const fileStream = createReadStream(filePath);

      // Get file size
      const { size } = await stat(filePath);

      console.log('uploading file...', size);
      // Upload the file
      await axios.put(enrichFileInput.uploadUrl, fileStream, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Length': size,
        },
        maxBodyLength: Infinity, // This allows for larger file uploads
        timeout: 4000,
      });

      try {
        await axios.get(enrichFileInput.callbackUrl, {
          headers: { api_key: 'f2491365539c99daef760c0db4881bf5' },
        });
      } catch (error) {
        console.error('Error processing CSV:', error);
      }
    }, 10);

    console.log('processFileinput', process.env.WEBHOOK_API_KEY);

    return true;
  }
}
