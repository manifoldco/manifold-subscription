import { h, FunctionalComponent } from '@stencil/core';
import check from '@manifoldco/mercury/icons/check.svg';
import CostDisplay from './CostDisplay';

interface PlanCardProps {
  isLoading?: boolean;
  isChecked?: boolean;
  plan?: {
    displayName: string;
    cost: number;
  };
}

const defaultPlan: PlanCardProps['plan'] = {
  displayName: 'Plan Name',
  cost: 0,
};

const PlanCard: FunctionalComponent<PlanCardProps> = (
  { isLoading, isChecked, plan = defaultPlan },
  cta
) => (
  <div class="ManifoldSubscriptionCreate__Card" data-is-checked={isChecked}>
    <div class="ManifoldSubscriptionCreate__PlanName" data-is-loading={isLoading}>
      {plan.displayName}
    </div>
    <span class="ManifoldSubscriptionCreate__Cost" data-is-loading={isLoading}>
      <CostDisplay baseCost={plan.cost} isConfigurable compact />
    </span>
    {cta}
    <i class="ManifoldSubscriptionCreate__Card__Checkmark" innerHTML={check} />
  </div>
);

export default PlanCard;
