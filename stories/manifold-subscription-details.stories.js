import { storiesOf } from '@storybook/html';

storiesOf('<manifold-subscription-details>', module).add(
  'preview',
  () =>
    `<manifold-init></manifold-init><manifold-subscription-details preview></manifold-subscription-details>`
);
