import { h, FunctionalComponent } from '@stencil/core';
import { $ } from '../../../utils/currency';

interface SubscriptionCardProps {
  isLoading?: boolean;
  plan?: {
    displayName: string;
    cost: number;
  };
}

const defaultPlan: SubscriptionCardProps['plan'] = {
  displayName: 'Plan Name',
  cost: 0,
};

const SubscriptionCard: FunctionalComponent<SubscriptionCardProps> = ({
  isLoading,
  plan = defaultPlan,
}) => (
  <div class="ManifoldSubscription__Card ManifoldSubscription__List__Card">
    <div class="ManifoldSubscription__PlanName" data-is-loading={isLoading}>
      {plan.displayName}
    </div>
    <span class="ManifoldSubscription__Cost" data-is-loading={isLoading}>
      {$(plan.cost)}
      <span class="ManifoldSubscription__Cost__Suffix">/mo</span>
    </span>
    <button class="ManifoldSubscription__List__Button">Modify Subscription</button>
  </div>
);

export default SubscriptionCard;
