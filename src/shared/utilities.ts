const STRING_LENGTH = 6;

export function getRandomHexColor(): string {
  const hexDigits = '0123456789ABCDEF';
  let color = '#';

  for (let index = 0; index < STRING_LENGTH; index++) {
    const index = Math.floor(Math.random() * hexDigits.length);
    color += hexDigits[index];
  }

  return color;
}

export function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
}
