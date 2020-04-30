import { h, FunctionalComponent } from '@stencil/core';
import CostDisplay from './CostDisplay';
import SkeletonText from './SkeletonText';

const SkeletonPlanSelector: FunctionalComponent = () => (
  <div class="ManifoldSubscriptionCreate__PlanSelector">
    <ul class="ManifoldSubscriptionCreate__PlanSelector__Menu">
      {[
        ['First Plan', 10],
        ['Second Plan', 100],
        ['Third Plan', 1000],
      ].map(([displayName, cost]) => (
        <li>
          <div class="ManifoldSubscriptionCreate__Card">
            <div class="ManifoldSubscriptionCreate__PlanName">
              <SkeletonText>{displayName}</SkeletonText>
            </div>
            <span class="ManifoldSubscriptionCreate__Cost">
              <SkeletonText>
                <CostDisplay baseCost={cost as number} />
              </SkeletonText>
            </span>
          </div>
        </li>
      ))}
    </ul>
    <div
      class="ManifoldSubscriptionCreate__PlanSelector__Details"
      itemscope
      itemtype="https://schema.org/IndividualProduct"
    >
      <h2 class="ManifoldSubscriptionCreate__PlanSelector__Heading" itemprop="name">
        <SkeletonText>Selected Plan Name</SkeletonText>
      </h2>
      <dl class="ManifoldSubscriptionCreate__PlanSelector__FeatureList">
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
    </div>
  </div>
);

export default SkeletonPlanSelector;
