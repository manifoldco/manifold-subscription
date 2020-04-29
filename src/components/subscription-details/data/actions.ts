import set from 'lodash/set';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import store, { SubscriptionDetailsStore } from './store';
import {
  SubscriptionViewQuery,
  SubscriptionEditQueryVariables,
  SubscriptionEditQuery,
  SubscriptionUpdateMutationVariables,
  SubscriptionUpdateMutation,
  PlanEdge,
} from '../../../types/graphql';
import { toFeatureMap, FeatureMap, configurableFeatureDefaults } from '../../../utils/plan';
import subscriptionQuery from './subscription-view.graphql';
import subscriptionPlanListQuery from './subscription-edit.graphql';
import updateSubscriptionMutation from './subscription-update.graphql';

export const setState = (
  path: string,
  value?: unknown,
  state: SubscriptionDetailsStore['state'] = store.state
) => {
  set(state, path, value);
  store.state = state;
};

export const setConnection = (value: Connection) => setState('connection', value);

export const setIsEditing = (value: boolean) => setState('isEditing', value);

export const setViewCost = (value: number) => setState('view.cost', value);

let controller: AbortController;

export const loadCost = async (
  planId: string,
  features: FeatureMap = {}
): Promise<{ amount?: number; error?: Error }> => {
  // If a request is in flight, cancel it
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();

  try {
    interface CostResponse {
      cost: number;
    }
    interface CostRequest {
      features: FeatureMap;
    }

    const res = await store.state.connection?.gateway.post<CostResponse, CostRequest>(
      `/id/plan/${planId}/cost`,
      {
        features,
      },
      { signal: controller.signal }
    );

    return { amount: res?.cost };
  } catch (error) {
    if (error.name !== 'AbortError') {
      return { error };
    }
  }

  return {};
};

// TODO separate fetch logic from state logic
export const loadSubscription = async (subscriptionId: string) => {
  setState('view.isLoading', true);

  const res = await store.state.connection?.graphqlFetch<SubscriptionViewQuery>({
    query: subscriptionQuery,
    variables: { id: subscriptionId },
  });

  if (res?.data) {
    const { subscription } = res.data;
    const featureMap = toFeatureMap(subscription.configuredFeatures);
    setState('view.subscription', {
      ...subscription,
      configuredFeatures: featureMap,
    });

    if (subscription.configuredFeatures.edges.length > 0) {
      setState('view.cost.isLoading', true);
      const cost = await loadCost(subscription.plan.id, featureMap);
      setState('view.cost', {
        ...cost,
        isLoading: false,
      });
    }
  }

  setState('view.isLoading', false);
};

export const selectPlan = (planId: string) => {
  setState('edit', {
    ...store.state.edit,
    selectedPlanId: planId,
    configuredFeatures: configurableFeatureDefaults(store.state.edit.plans as PlanEdge[], planId),
  });
};

export const getSelectedPlan = () => {
  const { plans, selectedPlanId } = store.state.edit;
  return plans?.find(plan => plan.node.id === selectedPlanId)?.node;
};

const fetchSubscriptionEdit = async (variables: SubscriptionEditQueryVariables) => {
  const res = await store.state.connection?.graphqlFetch<SubscriptionEditQuery>({
    query: subscriptionPlanListQuery,
    variables,
  });

  if (res?.data) {
    const { plan, configuredFeatures } = res.data.subscription;
    return {
      data: {
        selectedPlanId: plan.id,
        plans: plan.product.plans.edges,
        configuredFeatures,
      },
    };
  }
  return { errors: res?.errors };
};

export const editSubscription = async () => {
  setIsEditing(true);
  setState('edit.isLoading', true);

  const res = await fetchSubscriptionEdit({ subscriptionId: store.state.subscriptionId || '' });

  if (res.data) {
    setState('edit', {
      ...res.data,
      configuredFeatures: toFeatureMap(res.data.configuredFeatures),
    });
  }

  setState('edit.isLoading', false);
};

export const cancelEditSubscription = () => {
  setIsEditing(false);
};

const fetchUpdateSubscription = async (variables: SubscriptionUpdateMutationVariables) => {
  const res = await store.state.connection?.graphqlFetch<SubscriptionUpdateMutation>({
    query: updateSubscriptionMutation,
    variables,
  });

  if (res?.data) {
    return {
      data: res.data.updateSubscription.data,
    };
  }

  return { errors: res?.errors };
};

const fromFeatureMap = (features: FeatureMap = {}) =>
  Object.entries(features).map(([label, value]) => ({
    label,
    value: `${value}`,
  }));

export const updateSubscription = async () => {
  setState('edit.isUpdating', true);
  const { subscriptionId, edit } = store.state;
  const planId = getSelectedPlan()?.id || '';
  const { data } = await fetchUpdateSubscription({
    id: subscriptionId || '',
    planId,
    configuredFeatures: fromFeatureMap(edit.configuredFeatures),
  });

  if (data) {
    const featureMap = toFeatureMap(data.configuredFeatures);
    setState('view.subscription', {
      ...data,
      configuredFeatures: featureMap,
    });

    setIsEditing(false);
  }

  setState('edit.isUpdating', false);
};
