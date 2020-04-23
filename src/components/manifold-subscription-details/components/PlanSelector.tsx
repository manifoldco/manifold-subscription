import { h, FunctionalComponent } from '@stencil/core';
import state from '../store';
import { configurableFeatureDefaults } from '../../../utils/plan';
import {
  PlanEdge,
  PlanFixedFeatureEdge,
  PlanMeteredFeatureEdge,
  PlanConfigurableFeatureEdge,
} from '../../../types/graphql';
import PlanCard from '../../shared/PlanCard';
import FixedFeature from 'components/shared/FixedFeature';
import MeteredFeature from 'components/shared/MeteredFeature';
import ConfigurableFeature from 'components/shared/ConfigurableFeature';
import CostDisplay from 'components/shared/CostDisplay';
import { filterErrors } from 'utils/error';

const PlanMenu: FunctionalComponent = () => {
  if (!state.plans) {
    return null;
  }

  return (
    <ul class="ManifoldSubscriptionCreate__PlanSelector__Menu">
      {state.plans.map(({ node: plan }) => (
        <li>
          <label>
            <input
              type="radio"
              value={plan.id}
              checked={plan.id === state.planId}
              onClick={() => {
                state.planId = plan.id;
                state.configuredFeatures = configurableFeatureDefaults(
                  state.plans as PlanEdge[],
                  plan.id
                );
              }}
            />
            <PlanCard plan={plan} isChecked={plan.id === state.planId} />
          </label>
        </li>
      ))}
    </ul>
  );
};

const PlanDetails: FunctionalComponent = () => {
  if (!state.plans || !state.planId) {
    return null;
  }

  const currentPlan = state.plans.find(plan => plan.node.id === state.planId)?.node;

  return (
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
            setConfiguredFeature={(label, value) => {
              state.configuredFeatures[label] = value;
            }}
            configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
            value={state.configuredFeatures?.[configurableFeature.node.label]}
          />
        ))}
      </dl>
      <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
        {/* <div>
          <CostDisplay
            isCalculating={state.calculatedCost === null}
            baseCost={state.calculatedCost || currentPlan?.cost || 0}
            meteredFeatures={currentPlan?.meteredFeatures.edges as PlanMeteredFeatureEdge[]}
            isConfigurable={currentPlan ? currentPlan.configurableFeatures.edges.length > 0 : false}
            hasError={filterErrors(state.errors, 'label', ['cost']).length > 0}
          />
          <p class="ManifoldSubscriptionCreate__HelpText">Usage billed at the end of month</p>
        </div> */}
      </footer>
    </div>
  );
};

interface PlanSelectorProps {
  productId: string;
  planId?: string;
}

const PlanSelector: FunctionalComponent<PlanSelectorProps> = ({ productId, planId }) => {
  state.productId = productId;

  if (state.planId === undefined) {
    state.planId = planId;
  }

  if (state.isLoading) {
    return 'Loading...';
  }

  if (!state.plans) {
    return null;
  }

  return (
    <div class="ManifoldSubscriptionCreate__PlanSelector">
      <PlanMenu />
      <PlanDetails />
    </div>
  );
};

export default PlanSelector;
