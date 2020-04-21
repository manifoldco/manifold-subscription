import { h, FunctionalComponent } from '@stencil/core';
import check from '@manifoldco/mercury/icons/check.svg';
import sliders from '@manifoldco/mercury/icons/sliders.svg';
import CostDisplay from './CostDisplay';
import { UIError } from '../../utils/error';

interface PlanCardProps {
  isLoading?: boolean;
  isChecked?: boolean;
  calculatedCost?: number | null;
  errors?: UIError[];
  plan?: {
    displayName: string;
    cost: number;
    configurableFeatures?: {
      edges: object[];
    };
  };
}

const defaultPlan: PlanCardProps['plan'] = {
  displayName: 'Plan Name',
  cost: 100,
};

const PlanCard: FunctionalComponent<PlanCardProps> = (props, cta) => {
  const { isLoading, isChecked, plan = defaultPlan, calculatedCost, errors = [] } = props;

  if (errors.length > 0) {
    return null;
  }

  const isConfigurable = (plan.configurableFeatures?.edges.length || 0) > 0;

  return (
    <div class="ManifoldSubscriptionCreate__Card" data-is-checked={isChecked}>
      <div class="ManifoldSubscriptionCreate__PlanName">
        <span data-is-loading={isLoading}>{plan.displayName}</span>
        {isConfigurable && (
          <i
            class="ManifoldSubscriptionCreate__Card__ConfigurableIndicator"
            innerHTML={sliders}
            title="Configurable"
          />
        )}
      </div>
      <span class="ManifoldSubscriptionCreate__Cost">
        <span data-is-loading={isLoading}>
          <CostDisplay
            isCalculating={calculatedCost === null}
            baseCost={calculatedCost || plan.cost || 0}
            isConfigurable
            compact
          />
        </span>
      </span>
      {cta}
      <i class="ManifoldSubscriptionCreate__Card__Checkmark" innerHTML={check} />
    </div>
  );
};
export default PlanCard;
