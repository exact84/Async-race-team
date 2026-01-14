import { httpClient } from '../shared/http-client/http-client';
import { EngineService } from './engine-service/engine.service';

export const serviceProvider = {
  engineService(): EngineService {
    return EngineService.getInstance(httpClient);
  },
} as const;
