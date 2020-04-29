import { h, FunctionalComponent } from '@stencil/core';
import FixedFeature from 'components/shared/FixedFeature';
import MeteredFeature from 'components/shared/MeteredFeature';
import ConfigurableFeature from 'components/shared/ConfigurableFeature';
import PlanCard from '../../shared/PlanCard';
import {
  PlanFixedFeatureEdge,
  PlanMeteredFeatureEdge,
  PlanConfigurableFeatureEdge,
  UpdateSubscriptionMutation,
  UpdateSubscriptionMutationVariables,
} from '../../../types/graphql';
import state from '../store';

import updateSubscriptionMutation from '../update-subscription.graphql';
import { toFeatureMap } from '../../../utils/plan';

const updateSubscription = async () => {
  if (!state.connection || !state.planId) {
    return;
  }

  state.isUpdating = true;

  const variables: UpdateSubscriptionMutationVariables = {
    id: state.subscriptionId,
    planId: state.planId,
    configuredFeatures: Object.entries(state.configuredFeatures).map(([label, value]) => ({
      label,
      value: `${value}`,
    })),
  };

  const { data, errors } = await state.connection.graphqlFetch<UpdateSubscriptionMutation>({
    query: updateSubscriptionMutation,
    variables,
  });

  state.isUpdating = false;
  state.isEditing = false;
  const id = data?.updateSubscription?.data?.plan?.id;
  state.planId = id;
  state.subscribedPlan = state.plans?.find(plan => plan.node.id === id)?.node;
  state.configuredFeatures = data
    ? toFeatureMap(data?.updateSubscription?.data?.configuredFeatures)
    : {};

  console.log(data, errors);
};

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

  const { currentPlan } = state;

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
              state.configuredFeatures = {
                ...state.configuredFeatures,
                [label]: value,
              };
            }}
            configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
            value={state.configuredFeatures?.[configurableFeature.node.label]}
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
          onClick={updateSubscription}
          disabled={state.isUpdating}
        >
          Update Subscription
        </button>
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
