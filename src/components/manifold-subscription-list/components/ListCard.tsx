import { h, FunctionalComponent } from '@stencil/core';
import { $ } from '../../../utils/currency';

interface ListCardProps {
  isLoading?: boolean;
  plan?: {
    displayName: string;
    cost: number;
  };
  isConfigurable?: boolean;
}

const defaultPlan: ListCardProps['plan'] = {
  displayName: 'Plan Name',
  cost: 0,
};

const ListCard: FunctionalComponent<ListCardProps> = ({
  isLoading,
  plan = defaultPlan,
  isConfigurable,
}) => (
  <div class="ManifoldSubscriptionCreate__List__Card">
    <div class="ManifoldSubscriptionCreate__PlanName" data-is-loading={isLoading}>
      {plan.displayName}
      {isConfigurable && (
        <svg
          class="ManifoldSubscriptionCreate__List__Icon"
          aria-label="sliders"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill-rule="evenodd" clip-rule="evenodd">
            <path d="M4 13a1 1 0 011 1v7a1 1 0 11-2 0v-7a1 1 0 011-1zM4 2a1 1 0 011 1v7a1 1 0 11-2 0V3a1 1 0 011-1zM12 11a1 1 0 011 1v9a1 1 0 11-2 0v-9a1 1 0 011-1zM12 2a1 1 0 011 1v5a1 1 0 11-2 0V3a1 1 0 011-1zM20 15a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zM20 2a1 1 0 011 1v9a1 1 0 11-2 0V3a1 1 0 011-1z" />
            <path d="M0 14a1 1 0 011-1h6a1 1 0 110 2H1a1 1 0 01-1-1zM8 8a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zM16 16a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" />
          </g>
        </svg>
      )}
    </div>
    <span class="ManifoldSubscriptionCreate__Cost" data-is-loading={isLoading}>
      {$(plan.cost)}
      <span class="ManifoldSubscriptionCreate__Cost__Suffix">/mo</span>
    </span>
    <button class="ManifoldSubscriptionCreate__List__Button">Modify Subscription</button>
  </div>
);

export default ListCard;
