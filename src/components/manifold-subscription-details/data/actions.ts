import set from 'lodash/set';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import store, { SubscriptionDetailsStore } from './store';
import {
  SubscriptionViewQuery,
  SubscriptionEditPreviewQuery,
  SubscriptionEditQuery,
  SubscriptionUpdateMutationVariables,
  SubscriptionUpdateMutation,
  SubscriptionViewPreviewQuery,
  Plan,
  PlanFeatureType,
  ConfiguredFeaturesFragment,
} from '../../../types/graphql';
import { toFeatureMap, FeatureMap } from '../../../utils/plan';
import subscriptionQuery from './graphql/subscription-view.graphql';
import planFragment from './graphql/plan-fragment.graphql';
import subscriptionViewPreviewQuery from './graphql/subscription-view-preview.graphql';
import subscriptionEditPreviewQuery from './graphql/subscription-edit-preview.graphql';
import subscriptionPlanListQuery from './graphql/subscription-edit.graphql';
import updateSubscriptionMutation from './graphql/subscription-update.graphql';

export function configurableFeatureDefaults(plan: Plan) {
  const defaultFeatures: ConfiguredFeaturesFragment['edges'] = [];

  const configurableFeatures = plan.configurableFeatures.edges;

  if (configurableFeatures) {
    configurableFeatures.forEach(({ node: { label, numericDetails, featureOptions, type } }) => {
      switch (type) {
        case PlanFeatureType.Boolean: {
          defaultFeatures.push({
            node: {
              label,
              booleanValue: false,
            },
          });
          break;
        }
        case PlanFeatureType.Number:
          defaultFeatures.push({
            node: {
              label,
              numberValue: numericDetails?.min,
            },
          });
          break;
        case PlanFeatureType.String:
          defaultFeatures.push({
            node: {
              label,
              stringValue: featureOptions?.[0].value,
            },
          });
          break;
        default:
          break;
      }
    });
  }

  return { edges: defaultFeatures };
}

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
  const { connection } = store.state;

  // If a request is in flight, cancel it
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();

  try {
    interface CostSuccess {
      cost: number;
      currency: 'USD';
    }

    interface CostError {
      id: string;
      type: 'error';
      message: string;
    }

    interface CostRequest {
      features: FeatureMap;
    }

    const res = await connection?.gateway.post<CostSuccess | CostError, CostRequest>(
      `/id/plan/${planId}/cost`,
      {
        features,
      },
      { signal: controller.signal }
    );

    const success = res as CostSuccess;
    const error = res as CostError;

    if (error?.type === 'error') {
      throw new Error(error.message);
    }

    return { amount: success?.cost };
  } catch (error) {
    if (error.name !== 'AbortError') {
      return { error };
    }
  }

  return {};
};

const updateCost = async (
  context: 'view' | 'edit',
  planId: string,
  configuredFeatures: FeatureMap
) => {
  if (Object.keys(configuredFeatures).length > 0) {
    setState(`${context}.cost.isLoading`, true);
    const { error, ...cost } = await loadCost(planId, configuredFeatures);
    setState(`${context}.cost`, {
      ...cost,
      hasError: !!error,
      isLoading: false,
    });
  }
};

const fromFeatureMap = (features: FeatureMap = {}) =>
  Object.entries(features).map(([label, value]) => ({
    label,
    value: `${value}`,
  }));

const fetchSubscriptionView = async (state = store.state) => {
  const { preview, connection, subscriptionId, planId = '' } = state;

  if (preview) {
    const res = await connection?.graphqlFetch<SubscriptionViewPreviewQuery>({
      query: planFragment + subscriptionViewPreviewQuery,
      variables: { planId },
    });

    if (res?.data) {
      return {
        data: {
          subscription: {
            ...res.data,
            status: {
              label: 'AVAILABLE',
              percentDone: 100,
              message: '',
            },
            configuredFeatures: configurableFeatureDefaults(res.data.plan as Plan),
          },
        },
      };
    }

    return { errors: res?.errors };
  }

  return connection?.graphqlFetch<SubscriptionViewQuery>({
    query: subscriptionQuery,
    variables: { id: subscriptionId },
  });
};

export const getSelectedPlan = () => {
  const { plans, selectedPlanId } = store.state.edit;
  return plans?.find(plan => plan.node.id === selectedPlanId)?.node;
};

export const loadSubscription = async () => {
  setState('view.isLoading', true);

  const res = await fetchSubscriptionView();

  if (res?.data) {
    const { subscription } = res.data;
    const featureMap = toFeatureMap(subscription.configuredFeatures);
    setState('view.subscription', {
      ...subscription,
      configuredFeatures: featureMap,
    });

    setState('view.isLoading', false);

    updateCost('view', subscription.plan.id, featureMap);
  }

  setState('view.isLoading', false);
};

export const selectPlan = (planId: string) => {
  const { edit } = store.state;
  const configuredFeatures = toFeatureMap(configurableFeatureDefaults(getSelectedPlan() as Plan));

  setState('edit', {
    ...edit,
    selectedPlanId: planId,
    configuredFeatures,
  });

  updateCost('edit', planId, configuredFeatures);
};

const fetchSubscriptionEdit = async (state = store.state) => {
  const { preview, connection, subscriptionId, planId } = state;

  if (preview) {
    const res = await connection?.graphqlFetch<SubscriptionEditPreviewQuery>({
      query: planFragment + subscriptionEditPreviewQuery,
      variables: { planId },
    });

    if (res?.data) {
      const plan = res.data.plan.product.plans.edges[0].node;

      return {
        data: {
          subscription: {
            ...res.data,
            status: {
              label: 'AVAILABLE',
              percentDone: 100,
              message: '',
            },
            configuredFeatures: configurableFeatureDefaults(plan as Plan),
          },
        },
      };
    }

    return { errors: res?.errors };
  }

  const res = await connection?.graphqlFetch<SubscriptionEditQuery>({
    query: subscriptionPlanListQuery,
    variables: { subscriptionId },
  });

  return res;
};

export const editSubscription = async () => {
  setState('isUpdated', false);
  setIsEditing(true);
  setState('edit.isLoading', true);
  const { edit } = store.state;
  const res = await fetchSubscriptionEdit();

  if (res?.data) {
    const { plan, configuredFeatures } = res.data.subscription;

    setState('edit', {
      ...edit,
      selectedPlanId: plan.id,
      plans: plan.product.plans.edges,
      configuredFeatures: toFeatureMap(configuredFeatures),
    });
  }

  setState('edit.isLoading', false);
};

export const cancelEditSubscription = () => {
  setIsEditing(false);
};

const fetchUpdateSubscription = async (variables: SubscriptionUpdateMutationVariables) => {
  const { preview, connection } = store.state;

  if (preview) {
    const res = await connection?.graphqlFetch<SubscriptionViewPreviewQuery>({
      query: planFragment + subscriptionViewPreviewQuery,
      variables,
    });

    if (res?.data) {
      const plan = getSelectedPlan();

      return {
        data: {
          updateSubscription: {
            data: {
              ...res.data,
              status: {
                label: 'AVAILABLE',
                percentDone: 100,
                message: '',
              },
              configuredFeatures: configurableFeatureDefaults(plan as Plan),
            },
          },
        },
      };
    }

    return { errors: res?.errors };
  }

  const res = await connection?.graphqlFetch<SubscriptionUpdateMutation>({
    query: updateSubscriptionMutation,
    variables,
  });

  return res;
};

export const updateSubscription = async () => {
  setState('isUpdating', true);
  setState('edit.errors', []);

  const { subscriptionId, edit } = store.state;

  const planId = getSelectedPlan()?.id || '';

  try {
    const res = await fetchUpdateSubscription({
      id: subscriptionId || '',
      planId,
      configuredFeatures: fromFeatureMap(edit.configuredFeatures),
    });

    const data = res?.data?.updateSubscription?.data;

    if (data) {
      const featureMap = toFeatureMap(data.configuredFeatures);
      setState('view.subscription', {
        ...data,
        configuredFeatures: featureMap,
      });
      setState('isUpdated', true);

      setIsEditing(false);
      updateCost('view', data.plan.id, featureMap);
    } else {
      throw new Error('Error updating subscription.');
    }
  } catch (e) {
    setState('edit.errors', [...edit.errors, { type: 'network', message: e.message }]);
  }
  setState('isUpdating', false);
};

export const setConfiguredFeature = (label: string, value: unknown) => {
  setState(`edit.configuredFeatures.${label}`, value);
  const { selectedPlanId = '', configuredFeatures = {} } = store.state.edit;
  updateCost('edit', selectedPlanId, configuredFeatures);
};
