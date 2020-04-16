import { h, FunctionalComponent } from '@stencil/core';
import CostDisplay from './CostDisplay';
import PlanCard from './PlanCard';

const SkeletonPlanSelector: FunctionalComponent = () => (
  <div class="ManifoldSubscriptionCreate__PlanSelector">
    <ul class="ManifoldSubscriptionCreate__PlanSelector__Menu">
      {[
        ['First Plan', 10],
        ['Second Plan', 100],
        ['Third Plan', 1000],
      ].map(([displayName, cost]) => (
        <li>
          <PlanCard isLoading plan={{ displayName: displayName as string, cost: cost as number }} />
        </li>
      ))}
    </ul>
    <div
      class="ManifoldSubscriptionCreate__PlanSelector__Details"
      itemscope
      itemtype="https://schema.org/IndividualProduct"
    >
      <h2 class="ManifoldSubscriptionCreate__PlanSelector__Heading" itemprop="name">
        <span data-is-loading>Selected Plan Name</span>
      </h2>
      <dl class="ManifoldSubscriptionCreate__PlanSelector__FeatureList">
        {[
          ['Feature', 'value'],
          ['Second Feature', 100],
          ['Third Feature', 'Another One'],
        ].map(([name, value]) => [
          <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">
            <span data-is-loading>{name}</span>
          </dt>,
          <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
            <span data-is-loading>{value}</span>
          </dd>,
        ])}
      </dl>
      <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
        <CostDisplay isCalculating baseCost={0} />
        <p class="ManifoldSubscriptionCreate__HelpText">
          <span data-is-loading>Usage billed at the end of month</span>
        </p>
      </footer>
    </div>
  </div>
);

export default SkeletonPlanSelector;
