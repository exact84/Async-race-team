import { serviceProvider } from './services/service-provider';
import './styles/style.css';

const raceService = serviceProvider.raceService();
const winnersService = serviceProvider.winnersService();

const abortContrroller = new AbortController();

const startRaceButton = document.createElement('button');
startRaceButton.textContent = 'Start race';

startRaceButton.addEventListener('click', () => {
  raceService
    .startRace({
      onCarCrash(car) {
        console.warn(car.name + ' crashed');
      },
      onRaceEnded() {
        console.warn('RACE ENDED');
      },
      onRaceStart() {
        console.warn('RACE STARTED');
      },
      onWinner(car, time) {
        console.warn(`${car.name} finished with time: ${time.toString()} `);
      },
      signal: abortContrroller.signal,
    })
    .catch(console.warn);
});

const winnersButton = document.createElement('button');
winnersButton.textContent = 'get winners';
winnersButton.addEventListener('click', () => {
  winnersService.getAll().then(console.warn, console.warn);
});

const stop = document.createElement('button');
stop.textContent = 'Stop race';
stop.addEventListener('click', () => {
  raceService.stopRace().then(console.warn, console.warn);
});

document.body.append(startRaceButton, winnersButton, stop);
