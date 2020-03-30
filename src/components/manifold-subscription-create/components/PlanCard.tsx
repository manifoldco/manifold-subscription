import { h, FunctionalComponent } from '@stencil/core';
import { PlanQuery } from '../../../types/graphql';
import { $ } from '../../../utils/currency';

interface PlanCardProps {
  isLoading?: boolean;
  plan?: PlanQuery['plan'];
}

const defaultPlan: PlanCardProps['plan'] = {
  displayName: 'Plan Name',
  cost: 0,
};

const PlanCard: FunctionalComponent<PlanCardProps> = ({ isLoading, plan = defaultPlan }) => (
  <div class="ManifoldSubscriptionCreate__Card">
    <div class="ManifoldSubscriptionCreate__PlanName" data-is-loading={isLoading}>
      {plan.displayName}
    </div>
    <span class="ManifoldSubscriptionCreate__Cost" data-is-loading={isLoading}>
      {$(plan.cost)}
      <span class="ManifoldSubscriptionCreate__Cost__Suffix">/mo</span>
    </span>
    <button class="ManifoldSubscriptionCreate__ModifyPlanButton">Change Plan</button>
  </div>
);

export default PlanCard;
