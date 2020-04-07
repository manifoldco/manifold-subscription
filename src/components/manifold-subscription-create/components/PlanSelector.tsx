import { h, FunctionalComponent } from '@stencil/core';
import { PlanListQuery, PlanConfigurableFeatureEdge } from '../../../types/graphql';
import FixedFeature from './FixedFeature';
import MeteredFeature from './MeteredFeature';
import ConfigurableFeature from './ConfigurableFeature';
import PlanCard from './PlanCard';
import { FeatureMap, configurableFeatureDefaults } from '../../../utils/plan';
import CostDisplay from './CostDisplay';

interface PlanMenuProps {
  plans: PlanListQuery['product']['plans']['edges'];
  selectedPlanId: string;
  setPlanId: (planId: string) => void;
  resetConfiguredFeatures: (configuredFeatures: FeatureMap) => void;
}

const PlanMenu: FunctionalComponent<PlanMenuProps> = ({
  plans,
  selectedPlanId,
  setPlanId,
  resetConfiguredFeatures,
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
              resetConfiguredFeatures(configurableFeatureDefaults(plans as any, plan.id));
            }}
          />
          <PlanCard plan={plan} isChecked={plan.id === selectedPlanId} />
        </label>
      </li>
    ))}
  </ul>
);

interface PlanSelectorProps {
  planId: string;
  configuredFeatures: FeatureMap;
  calculatedCost?: number;
  data?: PlanListQuery;
  setPlanId: (planId: string) => void;
  setConfiguredFeature: (label: string, value: string | number | boolean) => void;
  resetConfiguredFeatures: (configuredFeatures: FeatureMap) => void;
}

const PlanSelector: FunctionalComponent<PlanSelectorProps> = props => {
  const { planId, setPlanId, data } = props;
  const { configuredFeatures, setConfiguredFeature, resetConfiguredFeatures } = props;

  if (!data) {
    return null;
  }

  const plans = data.product.plans.edges;

  const currentPlan = plans.find(({ node: plan }) => plan.id === planId)?.node;

  return (
    <div class="ManifoldSubscriptionCreate__PlanSelector">
      <PlanMenu
        plans={plans}
        selectedPlanId={planId}
        setPlanId={setPlanId}
        resetConfiguredFeatures={resetConfiguredFeatures}
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
            <FixedFeature fixedFeature={fixedFeature as any} />
          ))}
          {currentPlan?.meteredFeatures.edges.map(meteredFeature => (
            <MeteredFeature meteredFeature={meteredFeature as any} />
          ))}
          {currentPlan?.configurableFeatures.edges.map(configurableFeature => (
            <ConfigurableFeature
              setConfiguredFeature={setConfiguredFeature}
              configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
              value={configuredFeatures[configurableFeature.node.label]}
            />
          ))}
        </dl>
        {/* TODO add regions */}
        <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
          <CostDisplay
            isCalculating={props.calculatedCost === undefined}
            baseCost={props.calculatedCost || currentPlan?.cost || 0}
            meteredFeatures={currentPlan?.meteredFeatures.edges as any}
            isConfigurable={currentPlan ? currentPlan.configurableFeatures.edges.length > 0 : false}
          />
          <p class="ManifoldSubscriptionCreate__HelpText">Usage billed at the end of month</p>
        </footer>
      </div>
    </div>
  );
};

export default PlanSelector;
