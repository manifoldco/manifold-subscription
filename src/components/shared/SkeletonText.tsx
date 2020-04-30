import { h, FunctionalComponent } from '@stencil/core';

const SkeletonText: FunctionalComponent = (_, text) => (
  <span class="ManifoldSubscription__SkeletonText">{text}</span>
);

export default SkeletonText;
