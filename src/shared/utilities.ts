const STRING_LENGTH = 6;

export function createFragment(...elements: HTMLElement[]): DocumentFragment {
  const documentFragment = document.createDocumentFragment();

  documentFragment.append(...elements);

  return documentFragment;
}

export function getRandomHexColor(): string {
  const hexDigits = '0123456789ABCDEF';
  let color = '#';

  for (let index = 0; index < STRING_LENGTH; index++) {
    const randomIndex = Math.floor(Math.random() * hexDigits.length);
    color += hexDigits[randomIndex];
  }

  return color;
}

export function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export function toggleScroll(element: HTMLElement, className: string, lock: boolean): void {
  element.classList.toggle(className, lock);
}
