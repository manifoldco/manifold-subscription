import { storiesOf } from '@storybook/html';

storiesOf('<manifold-subscription-create>', module).add(
  'preview',
  () =>
    `<manifold-init></manifold-init><manifold-subscription-create preview></manifold-subscription-create>`
);
