import { h, FunctionalComponent } from '@stencil/core';
import check from '@manifoldco/mercury/icons/check.svg';
import CostDisplay from './CostDisplay';
import { UIError } from '../../utils/error';

interface PlanCardProps {
  isLoading?: boolean;
  isChecked?: boolean;
  errors?: UIError[];
  plan?: {
    displayName: string;
    cost: number;
  };
}

const defaultPlan: PlanCardProps['plan'] = {
  displayName: 'Plan Name',
  cost: 100,
};

const PlanCard: FunctionalComponent<PlanCardProps> = (
  { isLoading, isChecked, plan = defaultPlan, errors = [] },
  cta
) => {
  if (errors.length > 0) {
    return null;
  }

  return (
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
};
export default PlanCard;
