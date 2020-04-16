import { h, FunctionalComponent } from '@stencil/core';
import sliders from '@manifoldco/mercury/icons/sliders.svg';
import { $ } from '../../../utils/currency';

interface ListCardProps {
  isLoading?: boolean;
  plan?: {
    displayName: string;
    cost: number;
  };
  isConfigurable?: boolean;
  ctaHref?: string;
  onCtaClick?: EventHandlerNonNull; // ?
}

const defaultPlan: ListCardProps['plan'] = {
  displayName: 'Plan Name',
  cost: 0,
};

const ListCard: FunctionalComponent<ListCardProps> = ({
  isLoading,
  plan = defaultPlan,
  isConfigurable,
  ctaHref,
  onCtaClick,
}) => (
  <div class="ManifoldSubscriptionCreate__List__Card">
    <div class="ManifoldSubscriptionCreate__PlanName" data-is-loading={isLoading}>
      {plan.displayName}
      {isConfigurable && (
        <span class="ManifoldSubscriptionCreate__List__Icon">
          <i innerHTML={sliders} />
        </span>
      )}
    </div>
    <span class="ManifoldSubscriptionCreate__Cost" data-is-loading={isLoading}>
      {$(plan.cost)}
      <span class="ManifoldSubscriptionCreate__Cost__Suffix">/mo</span>
    </span>
    <a href={ctaHref} onClick={onCtaClick} class="ManifoldSubscription__Button">
      Modify Subscription
    </a>
  </div>
);

export default ListCard;
