import { FunctionalComponent, h } from '@stencil/core';
import errorIcon from '@manifoldco/mercury/icons/alert-circle.svg';
import { $ } from '../../utils/currency';
import { meteredFeatureDisplayValue } from '../../utils/plan';
import { PlanMeteredFeatureEdge } from '../../types/graphql';

/**
 * Base Cost
 */
interface BaseCostProps {
  cost: number;
  isFreeMonthly?: boolean;
  hasMeteredFeatures?: boolean;
  compact?: boolean;
}
const BaseCost: FunctionalComponent<BaseCostProps> = props => {
  const { cost, isFreeMonthly, hasMeteredFeatures, compact } = props;

  if (typeof cost !== 'number') {
    return null;
  }
  // If there are measurable costs but no monthly cost, only show measurable
  if (isFreeMonthly && hasMeteredFeatures) {
    return null;
  }

  if (isFreeMonthly) {
    // Show the badge for compact, large text otherwise
    return compact ? (
      <span class="ManifoldSubscriptionCreate__Badge" data-tag="free">
        Free
      </span>
    ) : (
      'Free'
    );
  }
  // $5 / mo
  return compact ? $(cost) : [$(cost), <small>&nbsp;/&nbsp;mo</small>];
};

/**
 * Metered Cost
 */
interface MeteredCostProps {
  meteredFeatures: PlanMeteredFeatureEdge[];
}
const MeteredCost: FunctionalComponent<MeteredCostProps> = ({ meteredFeatures }) => {
  if (meteredFeatures.length === 0) {
    return null;
  }

  if (meteredFeatures.length > 1) {
    return <small>metered usage</small>;
  }

  const displayValue = meteredFeatureDisplayValue(meteredFeatures[0].node.numericDetails);

  return [displayValue.cost, displayValue.per ? <small>&nbsp;{displayValue.per}</small> : ''];
};

interface CostDisplayProps {
  baseCost: number;
  isCalculating?: boolean;
  compact?: boolean;
  isConfigurable?: boolean;
  meteredFeatures?: PlanMeteredFeatureEdge[];
  hasError?: boolean;
}

const CostDisplay: FunctionalComponent<CostDisplayProps> = props => {
  // Render loading state
  if (props.isCalculating) {
    return (
      <div class="ManifoldSubscriptionCreate__CostDisplay" data-compact={props.compact}>
        <div
          class="ManifoldSubscriptionCreate__CostDisplay__Calculating"
          title="Calculating cost..."
        />
      </div>
    );
  }

  if (props.hasError) {
    return (
      <div class="ManifoldSubscriptionCreate__CostDisplay" data-compact={props.compact}>
        <div class="ManifoldSubscriptionCreate__CostDisplay__Error">
          <i innerHTML={errorIcon} /> Error calculating cost
        </div>
      </div>
    );
  }

  // Render cost
  const { compact, isConfigurable, baseCost, meteredFeatures = [] } = props;

  const showStartingAt = compact && isConfigurable;
  const isFreeMonthly = baseCost === 0;
  const isMetered = meteredFeatures.length > 0;
  const isCompositeCost = !isFreeMonthly && isMetered;

  return (
    <div class="ManifoldSubscriptionCreate__CostDisplay" data-compact={compact}>
      <span itemprop="price">
        {showStartingAt && <span class="starting">Starting at&nbsp;</span>}
        <BaseCost
          compact={compact}
          cost={baseCost}
          isFreeMonthly={isFreeMonthly}
          hasMeteredFeatures={isMetered}
        />
        {isCompositeCost && ' + '}
        <MeteredCost meteredFeatures={meteredFeatures} />
      </span>
    </div>
  );
};

export default CostDisplay;
