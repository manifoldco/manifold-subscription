import { h } from '@stencil/core';
import SkeletonText from 'components/shared/SkeletonText';
import CostDisplay from 'components/shared/CostDisplay';

export const SkeletonDetails = () => (
  <section class="ManifoldSubscriptionCreate__Card">
    <header class="ManifoldSubscriptionCreate__Details__Header">
      <h2 class="ManifoldSubscriptionCreate__PlanSelector__Heading" itemprop="name">
        <SkeletonText>Selected Plan Name</SkeletonText>
      </h2>
    </header>
    <dl class="ManifoldSubscriptionCreate__Details__FeatureList">
      {[
        ['Feature', 'value'],
        ['Second Feature', 100],
        ['Third Feature', 'Another One'],
        ['Fourth', 'No'],
      ].map(([name, value]) => [
        <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">
          <SkeletonText>{name}</SkeletonText>
        </dt>,
        <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
          <SkeletonText>{value}</SkeletonText>
        </dd>,
      ])}
    </dl>
    <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
      <CostDisplay isCalculating baseCost={0} />
      <p class="ManifoldSubscriptionCreate__HelpText">
        <SkeletonText>Usage billed at the end of month</SkeletonText>
      </p>
    </footer>
  </section>
);
