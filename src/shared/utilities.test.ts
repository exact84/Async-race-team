import { getRandomHexColor, getRandomItem } from './utilities';

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
