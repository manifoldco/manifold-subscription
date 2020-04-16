import { h, FunctionalComponent } from '@stencil/core';
import {
  PlanListQuery,
  PlanConfigurableFeatureEdge,
  PlanFixedFeatureEdge,
  PlanMeteredFeatureEdge,
  PlanEdge,
} from '../../types/graphql';
import FixedFeature from './FixedFeature';
import MeteredFeature from './MeteredFeature';
import ConfigurableFeature from './ConfigurableFeature';
import PlanCard from './PlanCard';
import { FeatureMap, configurableFeatureDefaults } from '../../utils/plan';
import CostDisplay from './CostDisplay';
import SkeletonPlanSelector from './SkeletonPlanSelector';

interface PlanMenuProps {
  plans: PlanListQuery['product']['plans']['edges'];
  selectedPlanId: string;
  setPlanId: (planId: string) => void;
  setAllConfiguredFeatures: (configuredFeatures: FeatureMap) => void;
}

const PlanMenu: FunctionalComponent<PlanMenuProps> = ({
  plans,
  selectedPlanId,
  setPlanId,
  setAllConfiguredFeatures,
}) => (
  <ul class="ManifoldSubscriptionCreate__PlanSelector__Menu">
    {plans.map(({ node: plan }) => (
      <li>
        <label>
          <input
            type="radio"
            value={plan.id}
            checked={plan.id === selectedPlanId}
            onClick={() => {
              setPlanId(plan.id);
              setAllConfiguredFeatures(configurableFeatureDefaults(plans as PlanEdge[], plan.id));
            }}
          />
          <PlanCard plan={plan} isChecked={plan.id === selectedPlanId} />
        </label>
      </li>
    ))}
  </ul>
);

interface PlanId {
  value: string;
  set: (planId: string) => void;
}

interface ConfiguredFeatures {
  value: FeatureMap;
  set: (label: string, value: string | number | boolean) => void;
  setAll: (configuredFeatures: FeatureMap) => void;
}

interface PlanSelectorProps {
  planId: PlanId;
  configuredFeatures: ConfiguredFeatures;
  calculatedCost?: number;
  data?: PlanListQuery;
  isLoading?: boolean;
}

const PlanSelector: FunctionalComponent<PlanSelectorProps> = props => {
  if (props.isLoading) {
    return <SkeletonPlanSelector />;
  }

  const { planId, configuredFeatures, data } = props;

  if (!data) {
    return null;
  }

  const plans = data.product.plans.edges;

  const currentPlan = plans.find(({ node: plan }) => plan.id === planId.value)?.node;

  return (
    <div class="ManifoldSubscriptionCreate__PlanSelector">
      <PlanMenu
        plans={plans}
        selectedPlanId={planId.value}
        setPlanId={planId.set}
        setAllConfiguredFeatures={configuredFeatures.setAll}
      />
      <div
        class="ManifoldSubscriptionCreate__PlanSelector__Details"
        itemscope
        itemtype="https://schema.org/IndividualProduct"
      >
        <h2 class="ManifoldSubscriptionCreate__PlanSelector__Heading" itemprop="name">
          {currentPlan?.displayName}
        </h2>
        <dl class="ManifoldSubscriptionCreate__PlanSelector__FeatureList">
          {currentPlan?.fixedFeatures.edges.map(fixedFeature => (
            <FixedFeature fixedFeature={fixedFeature as PlanFixedFeatureEdge} />
          ))}
          {currentPlan?.meteredFeatures.edges.map(meteredFeature => (
            <MeteredFeature meteredFeature={meteredFeature as PlanMeteredFeatureEdge} />
          ))}
          {currentPlan?.configurableFeatures.edges.map(configurableFeature => (
            <ConfigurableFeature
              setConfiguredFeature={configuredFeatures.set}
              configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
              value={configuredFeatures.value[configurableFeature.node.label]}
            />
          ))}
        </dl>
        {/* TODO add regions */}
        <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
          <CostDisplay
            isCalculating={props.calculatedCost === undefined}
            baseCost={props.calculatedCost || currentPlan?.cost || 0}
            meteredFeatures={currentPlan?.meteredFeatures.edges as PlanMeteredFeatureEdge[]}
            isConfigurable={currentPlan ? currentPlan.configurableFeatures.edges.length > 0 : false}
          />
          <p class="ManifoldSubscriptionCreate__HelpText">Usage billed at the end of month</p>
        </footer>
      </div>
    </div>
  );
};

export default PlanSelector;
