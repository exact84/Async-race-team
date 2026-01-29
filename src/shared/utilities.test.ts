import { getFromLocalStorage, setToLocalStorage } from './local-storage';
import { isAppTheme } from './type-guards';
import { createFragment, getRandomHexColor, getRandomItem } from './utilities';

beforeEach(() => {
  localStorage.clear();
});

describe(getRandomHexColor.name, () => {
  it('should return a string starting with #', () => {
    const color = getRandomHexColor();

    expect(color).toBeTypeOf('string');
    expect(color[0]).toBe('#');
  });

  it('should return a string of length 7 (# + 6 hex digits)', () => {
    const color = getRandomHexColor();
    const expected = 7;

    expect(color.length).toBe(expected);
  });

  it('should contain only valid hex characters', () => {
    const color = getRandomHexColor();
    const hexPattern = /^#[0-9A-F]{6}$/;

    expect(hexPattern.test(color)).toBe(true);
  });
});

describe(getRandomItem.name, () => {
  it('should return an item from the array', () => {
    const array = ['a', 'b', 'c'];
    const item = getRandomItem(array);

    expect(array.includes(item)).toBe(true);
  });
});

describe(createFragment.name, () => {
  it('should be instance of DocumentFragment', () => {
    const result = createFragment();

    expect(result).toBeInstanceOf(DocumentFragment);
  });
});

describe(isAppTheme.name, () => {
  it('should return true for valid input', () => {
    const result = isAppTheme('dark');

    expect(result).toBe(true);
  });

  it('should return false for invalid input', () => {
    const result = isAppTheme('foo-bar-baz');

    expect(result).toBe(false);
  });
});

describe(getFromLocalStorage.name, () => {
  it('should return stored value', () => {
    setToLocalStorage('app-theme', 'dark');

    const stored = getFromLocalStorage('app-theme', isAppTheme, 'light');

    expect(stored).toBe('dark');
  });

  it('should return fallback value', () => {
    const stored = getFromLocalStorage('app-theme', isAppTheme, 'light');

    expect(stored).toBe('light');
  });
});

describe(setToLocalStorage.name, () => {
  it('should save value', () => {
    setToLocalStorage('app-theme', 'light');

    const result = getFromLocalStorage('app-theme', isAppTheme, 'dark');

    expect(result).toBe('light');
  });
});
