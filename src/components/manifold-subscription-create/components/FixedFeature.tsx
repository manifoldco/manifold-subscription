import { h, FunctionalComponent } from '@stencil/core';
import check from '@manifoldco/mercury/icons/check.svg';
import { PlanFixedFeatureEdge } from '../../../types/graphql';

export const fixedDisplayValue = (displayValue: string = '') => {
  // normalize true/false features
  if (['true', 'yes'].includes(displayValue.toLowerCase())) {
    return (
      <span class="ManifoldSubscriptionCreate__PlanSelector__FixedValue" data-value="true">
        <i class="icon" innerHTML={check} title="Yes" />
      </span>
    );
  }
  if (['false', 'no', 'none'].includes(displayValue.toLowerCase())) {
    return (
      <span class="ManifoldSubscriptionCreate__PlanSelector__FixedValue" data-value="false">
        No
      </span>
    );
  }
  return displayValue;
};

interface FixedFeatureProps {
  fixedFeature: PlanFixedFeatureEdge;
}

const FixedFeature: FunctionalComponent<FixedFeatureProps> = ({ fixedFeature }) => {
  const {
    node: { displayName, displayValue },
  } = fixedFeature;
  return [
    <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">{displayName}</dt>,
    <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
      {fixedDisplayValue(displayValue)}
    </dd>,
  ];
};

export default FixedFeature;
