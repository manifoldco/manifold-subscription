import set from 'lodash/set';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import store, { SubscriptionDetailsStore } from './store';
import { SubscriptionQuery } from '../../../types/graphql';
import { toFeatureMap, FeatureMap } from '../../../utils/plan';
import subscriptionQuery from './subscription.graphql';

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

export const loadSubscription = async (subscriptionId: string) => {
  setState('view.isLoading', true);

  const res = await store.state.connection?.graphqlFetch<SubscriptionQuery>({
    query: subscriptionQuery,
    variables: { id: subscriptionId },
  });

  if (res?.data) {
    const { status, plan, configuredFeatures } = res.data.subscription;
    const featureMap = toFeatureMap(configuredFeatures);
    setState('view.subscription', {
      status,
      plan,
      configuredFeatures: featureMap,
    });

    if (configuredFeatures.edges.length > 0) {
      setState('view.cost.isLoading', true);
      const cost = await loadCost(plan.id, featureMap);
      setState('view.cost', {
        ...cost,
        isLoading: false,
      });
    }
  }

  setState('view.isLoading', false);
};

export const selectPlan = (planId: string) => setState('edit.selectedPlanId', planId);

export const getSelectedPlan = () => {
  const { plans, selectedPlanId } = store.state.edit;
  return plans?.find(plan => plan.node.id === selectedPlanId)?.node;
};

// TODO
export const editSubscription = () => ({});
export const cancelEditSubscription = () => ({});
export const updateSubscription = () => ({});
