// api-call.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiCallService {
  constructor(private readonly httpService: HttpService) {}

  async callExternalApi(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<any> {
    try {
      const config = {
        headers: headers || {},
      };

      let response;

      switch (method) {
        case 'GET':
          response = await lastValueFrom(
            this.httpService.get(endpoint, { headers: config.headers, params: data }),
          );
          break;
        case 'POST':
          response = await lastValueFrom(
            this.httpService.post(endpoint, data, { headers: config.headers }),
          );
          break;
        case 'PUT':
          response = await lastValueFrom(
            this.httpService.put(endpoint, data, { headers: config.headers }),
          );
          break;
        case 'DELETE':
          response = await lastValueFrom(
            this.httpService.delete(endpoint, { headers: config.headers, params: data }),
          );
          break;
        default:
          throw new Error('Unsupported HTTP method');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error calling external API: ${error.message}`);
    }
  }
}
