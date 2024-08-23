import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

interface IProcessFileInput {
  downloadUrl: string;
  uploadUrl: string;
  callbackUrl: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHello(@Body() processFile: IProcessFileInput): true {
    setTimeout(() => {
      console.log('Sending callback');
      axios.get(processFile.callbackUrl);
    }, 3000);
    return true;
  }
}
