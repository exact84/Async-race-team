import { input, label } from '@ripetchor/dom';

import { Component, defineElement } from '../../shared/component/component';
import { createFragment } from '../../shared/utilities';
import styles from './theme-switcher.module.css';

export type AppTheme = 'dark' | 'light' | 'system';

export interface ThemeSwitcherProperties {
  onChange(theme: AppTheme): void;
  selectedTheme?: AppTheme;
}

interface ThemeOption {
  label: string;
  value: AppTheme;
}

const THEME_OPTIONS: ThemeOption[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export class ThemeSwitcher extends Component<ThemeSwitcherProperties> {
  public constructor(properties: ThemeSwitcherProperties) {
    super(properties);

    this.className = styles.container;
  }

  public render(): DocumentFragment | HTMLElement {
    const selectedTheme = this.props.selectedTheme ?? 'system';

    return createFragment(
      ...THEME_OPTIONS.map((option) =>
        label(
          { className: styles.label, htmlFor: option.value },
          option.label,
          input({
            'change': () => {
              this.props.onChange(option.value);
            },
            'checked': selectedTheme === option.value,
            'className': styles.input,
            'data-testid': `input-${option.value}`,
            'id': option.value,
            'name': 'theme',
            'type': 'radio',
          })
        )
      )
    );
  }
}

defineElement('theme-switcher', ThemeSwitcher);
