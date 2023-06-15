import type { StorybookConfig } from '@storybook/react-vite';
import { defineConfig, mergeConfig } from 'vite';

export default {
  core: { disableTelemetry: true },
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-essentials'],
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  viteFinal: (c) => mergeConfig(c, defineConfig({})),
} as StorybookConfig;
