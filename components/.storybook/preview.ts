import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import './preview.css';

export default {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/ } },
    theme: { ...themes.dark },
    docs: { theme: themes.dark },
    backgrounds: { values: [{ name: 'Primary', value: '#212121' }] },
  },
} as Preview;
