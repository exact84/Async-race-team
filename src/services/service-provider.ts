import { httpClient } from '../shared/http-client/http-client';
import { EngineService } from './engine-service/engine.service';
import { WinnersService } from './winners-service/winners.service';

export const serviceProvider = {
  engineService(): EngineService {
    return EngineService.getInstance(httpClient);
  },
  winnersService(): WinnersService {
    return WinnersService.getInstance(httpClient);
  },
} as const;
