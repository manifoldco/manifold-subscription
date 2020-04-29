import { createStore } from '@stencil/store';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import { ProductPlansQuery, ProductPlansQueryVariables, PlanEdge } from '../../types/graphql';
import productPlansQuery from './product-plans.graphql';
import { FeatureMap, configurableFeatureDefaults } from '../../utils/plan';

export interface Store {
  connection?: Connection;
  isLoading: boolean;
  errors?: GraphqlError[];

  subscriptionId: string;

  // Plan selector
  productId?: string;
  planId?: string;
  subscribedPlan?: ProductPlansQuery['product']['plans']['edges'][0]['node'];
  currentPlan?: ProductPlansQuery['product']['plans']['edges'][0]['node'];
  plans?: ProductPlansQuery['product']['plans']['edges'];
  configuredFeatures: FeatureMap;

  // Cost
  cost?: number;
  isCalculating?: boolean;

  // Modify
  isUpdating?: boolean;
  isEditing?: boolean;
}

const { state, onChange } = createStore<Store>({
  isLoading: false,
  configuredFeatures: {},
  subscriptionId: '',
});

onChange('productId', async (productId: string) => {
  if (!state.connection?.graphqlFetch) {
    return;
  }

  state.isLoading = true;

  const variables: ProductPlansQueryVariables = { productId };
  const { data, errors } = await state.connection.graphqlFetch<ProductPlansQuery>({
    query: productPlansQuery,
    variables,
  });

  state.errors = errors;

  if (data) {
    state.plans = data.product.plans.edges;
  }

  state.isLoading = false;
});

let controller: AbortController;

onChange('planId', async (planId: string) => {
  state.configuredFeatures = configurableFeatureDefaults(state.plans as PlanEdge[], planId);

  const currentPlan = state.plans?.find(plan => plan.node.id === planId)?.node;
  state.currentPlan = currentPlan;

  // if not configurable, return plan cost
  if (Object.keys(state.configuredFeatures).length === 0) {
    state.cost = currentPlan?.cost;
    return undefined;
  }

  if (!state.connection) {
    // this.addErrors(dataError('cost', 'cost of selected plan'));
    throw new Error('Missing property `connection` on `manifold-subscription-create`.');
  }

  state.isCalculating = true;

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

    const { cost } = await state.connection.gateway.post<CostResponse, CostRequest>(
      `/id/plan/${planId}/cost`,
      {
        features: state.configuredFeatures,
      },
      { signal: controller.signal }
    );

    state.cost = cost;
  } catch (e) {
    if (e.name !== 'AbortError') {
      // this.addErrors(dataError('cost', 'cost of selected plan'));
    }
  }
  return undefined;
});

export default state;
