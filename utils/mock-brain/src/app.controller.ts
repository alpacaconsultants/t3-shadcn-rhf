import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import * as path from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

interface IProcessFileInput {
  downloadUrl: string;
  uploadUrl: string;
  callbackUrl: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() processFile: IProcessFileInput): true {
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
      await axios.put(processFile.uploadUrl, fileStream, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Length': size,
        },
        maxBodyLength: Infinity, // This allows for larger file uploads
        timeout: 4000,
      });

      await axios.get(processFile.callbackUrl);
    }, 10);
    return true;
  }
}
