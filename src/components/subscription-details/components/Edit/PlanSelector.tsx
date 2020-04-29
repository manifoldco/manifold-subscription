import { h, FunctionalComponent } from '@stencil/core';
import FixedFeature from 'components/shared/FixedFeature';
import MeteredFeature from 'components/shared/MeteredFeature';
import ConfigurableFeature from 'components/shared/ConfigurableFeature';
import PlanCard from 'components/shared/PlanCard';
import {
  PlanFixedFeatureEdge,
  PlanMeteredFeatureEdge,
  PlanConfigurableFeatureEdge,
} from '../../../../types/graphql';
import store from '../../data/store';
import { selectPlan, getSelectedPlan, setState } from '../../data/actions';

const PlanMenu: FunctionalComponent = () => {
  const { plans, selectedPlanId } = store.state.edit;
  if (!plans) {
    return null;
  }

  return (
    <ul class="ManifoldSubscriptionCreate__PlanSelector__Menu">
      {plans.map(({ node: plan }) => (
        <li>
          <label>
            <input
              type="radio"
              value={plan.id}
              checked={plan.id === selectedPlanId}
              onClick={() => {
                selectPlan(plan.id);
              }}
            />
            <PlanCard plan={plan} isChecked={plan.id === selectedPlanId} />
          </label>
        </li>
      ))}
    </ul>
  );
};

const PlanDetails: FunctionalComponent = () => {
  const plan = getSelectedPlan();

  if (!plan) {
    return null;
  }

  const { configuredFeatures, isLoading } = store.state.edit;

  return (
    <div
      class="ManifoldSubscriptionCreate__PlanSelector__Details"
      itemscope
      itemtype="https://schema.org/IndividualProduct"
    >
      <h2 class="ManifoldSubscriptionCreate__PlanSelector__Heading" itemprop="name">
        {plan?.displayName}
      </h2>
      <dl class="ManifoldSubscriptionCreate__PlanSelector__FeatureList">
        {plan?.fixedFeatures.edges.map(fixedFeature => (
          <FixedFeature fixedFeature={fixedFeature as PlanFixedFeatureEdge} />
        ))}
        {plan?.meteredFeatures.edges.map(meteredFeature => (
          <MeteredFeature meteredFeature={meteredFeature as PlanMeteredFeatureEdge} />
        ))}
        {plan?.configurableFeatures.edges.map(configurableFeature => (
          <ConfigurableFeature
            setConfiguredFeature={(label, value) =>
              setState(`edit.configuredFeatures.${label}`, value)
            }
            configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
            value={configuredFeatures?.[configurableFeature.node.label]}
          />
        ))}
      </dl>
      <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
        <div>
          {/* TODO add Cost component */}
          <p class="ManifoldSubscription__HelpText">Usage billed at the end of month</p>
        </div>
        <button
          class="ManifoldSubscription__Button"
          type="button"
          // onClick={updateSubscription}
          disabled={isLoading}
        >
          Update Subscription
        </button>
      </footer>
    </div>
  );
};

const PlanSelector: FunctionalComponent = () => {
  const { isLoading, plans } = store.state.edit;

  if (isLoading) {
    return 'Loading...';
  }

  if (!plans) {
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
