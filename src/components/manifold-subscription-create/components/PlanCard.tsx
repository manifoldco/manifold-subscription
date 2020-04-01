import { h, FunctionalComponent } from '@stencil/core';
import check from '@manifoldco/mercury/icons/check.svg';
import { $ } from '../../../utils/currency';

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
  <div
    class={`ManifoldSubscriptionCreate__Card ${
      isChecked ? 'ManifoldSubscriptionCreate__Card--checked' : ''
    }`}
  >
    <div class="ManifoldSubscriptionCreate__PlanName" data-is-loading={isLoading}>
      {plan.displayName}
    </div>
    <span class="ManifoldSubscriptionCreate__Cost" data-is-loading={isLoading}>
      {$(plan.cost)}
      <span class="ManifoldSubscriptionCreate__Cost__Suffix">/mo</span>
    </span>
    {cta}
    <img class="ManifoldSubscriptionCreate__Card__Checkmark" src={check} alt="" />
  </div>
);

export default PlanCard;
