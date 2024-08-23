import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import * as path from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

interface IEnrichFileInput {
  downloadUrl: string;
  uploadUrl: string;
  callbackUrl: string;
  context: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() enrichFileInput: IEnrichFileInput): true {
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

      // await axios.get(enrichFileInput.callbackUrl);
    }, 10);

    console.log('processFileinput', JSON.stringify(enrichFileInput));

    return true;
  }
}
