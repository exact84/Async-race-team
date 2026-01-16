import { httpClient } from '../shared/http-client/http-client';
import { EngineService } from './engine-service/engine.service';
import { GarageService } from './garage-service/garage.service';
import { RaceService } from './race-service/race.service';
import { WinnersService } from './winners-service/winners.service';

export const serviceProvider = {
  engineService(): EngineService {
    return EngineService.getInstance(httpClient);
  },
  garageService(): GarageService {
    return GarageService.getInstance(httpClient);
  },
  raceService(): RaceService {
    return RaceService.getInstance(
      serviceProvider.garageService(),
      serviceProvider.engineService(),
      serviceProvider.winnersService()
    );
  },
  winnersService(): WinnersService {
    return WinnersService.getInstance(httpClient);
  },
} as const;
