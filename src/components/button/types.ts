/* eslint-disable perfectionist/sort-interfaces */
/* eslint-disable perfectionist/sort-union-types */
export interface ButtonProperties {
  label: string;
  size?: ButtonSize;
  disabled?: boolean;
  onClick(): void;
}
export type ButtonSize = 's' | 'm' | 'l';
export type ButtonState = object;
