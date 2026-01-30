import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { mlConfig } from '../../config/ml.config';
import {
  ClassificationRequest,
  ClassificationResult,
} from './dto/classification.dto';

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly mlServiceUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly httpService: HttpService) {
    this.mlServiceUrl = mlConfig.serviceUrl;
    this.timeoutMs = mlConfig.timeout;
  }

  async classifyBookmark(
    url: string,
    title: string,
    description?: string,
  ): Promise<ClassificationResult> {
    try {
      const request: ClassificationRequest = {
        url,
        title,
        description,
      };

      this.logger.log(`Classifying bookmark: ${url}`);

      const response = await firstValueFrom(
        this.httpService
          .post<ClassificationResult>(
            `${this.mlServiceUrl}/classify`,
            request,
          )
          .pipe(timeout(this.timeoutMs)),
      );

      this.logger.log(
        `Classification result: ${response.data.category} (${response.data.confidence}%)`,
      );

      return response.data;
    } catch (error) {
      // Graceful fallback - don't break bookmark creation if ML fails
      this.logger.error(
        `ML service call failed: ${error.message}. Using fallback.`,
      );

      return {
        category: 'uncategorized',
        confidence: 0,
        suggested_tags: [],
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.mlServiceUrl}/health`)
          .pipe(timeout(3000)),
      );
      return response.data.status === 'healthy';
    } catch (error) {
      this.logger.warn(`ML service health check failed: ${error.message}`);
      return false;
    }
  }
}
