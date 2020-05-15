import { storiesOf } from '@storybook/html';

storiesOf('<manifold-subscription-list>', module).add(
  'preview',
  () =>
    `<manifold-init></manifold-init><manifold-subscription-list preview></manifold-subscription-list>`
);
