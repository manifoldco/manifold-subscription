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
  // const { planId, configuredFeatures, setPlan, setConfiguredFeature } = props;
  if (!props.data) {
    return null;
  }

  const currentPlan = props.data.product.plans.edges.find(
    ({ node: plan }) => plan.id === props.planId
  );
  return (
    <div class="ManifoldSubscriptionCreate__PlanSelector">
      <PlanMenu
        plans={props.data.product.plans.edges}
        selectedPlanId={props.planId}
        setPlanId={props.setPlanId}
        resetConfiguredFeatures={props.resetConfiguredFeatures}
      />
      <div
        class="ManifoldSubscriptionCreate__PlanSelector__Details"
        itemscope
        itemtype="https://schema.org/IndividualProduct"
      >
        <h2 class="ManifoldSubscriptionCreate__PlanSelector__Heading" itemprop="name">
          {currentPlan?.node.displayName}
        </h2>
        <dl class="ManifoldSubscriptionCreate__PlanSelector__FeatureList">
          {currentPlan?.node.fixedFeatures.edges.map(fixedFeature => (
            <FixedFeature fixedFeature={fixedFeature as any} />
          ))}
          {currentPlan?.node.meteredFeatures.edges.map(meteredFeature => (
            <MeteredFeature meteredFeature={meteredFeature as any} />
          ))}
          {currentPlan?.node.configurableFeatures.edges.map(configurableFeature => (
            <ConfigurableFeature
              setConfiguredFeature={props.setConfiguredFeature}
              configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
              value={props.configuredFeatures[configurableFeature.node.label]}
            />
          ))}
        </dl>
        <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
          {props.calculatedCost === undefined ? (
            <em>Calculating cost...</em>
          ) : (
            <CostDisplay
              baseCost={props.calculatedCost || currentPlan?.node.cost || 0}
              meteredFeatures={currentPlan?.node.meteredFeatures.edges as any}
              isConfigurable={
                currentPlan ? currentPlan.node.configurableFeatures.edges.length > 0 : false
              }
            />
          )}
          <p class="ManifoldSubscriptionCreate__HelpText">Usage billed at the end of month</p>
        </footer>
      </div>
    </div>
  );
};

export default PlanSelector;
