import { createStore } from '@stencil/store';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { SubscriptionQuery, PlanListQuery } from '../../../types/graphql';
import { FeatureMap } from '../../../utils/plan';

export interface Subscription {
  status: SubscriptionQuery['subscription']['status'];
  plan: SubscriptionQuery['subscription']['plan'];
  configuredFeatures: FeatureMap;
}

export interface SubscriptionDetailsStore {
  state: {
    connection?: Connection;
    isEditing?: boolean;
    heading?: string;
    view: {
      isLoading?: boolean;
      subscription?: Subscription;
      cost: {
        isLoading?: boolean;
        amount?: number;
        error?: string;
      };
    };
    edit: {
      isLoading?: boolean;
      plans?: PlanListQuery['product']['plans']['edges'];
      selectedPlanId?: string;
      configuredFeatures?: FeatureMap;
    };
  };
}

const { state } = createStore<SubscriptionDetailsStore>({
  state: {
    view: {
      cost: {},
    },
    edit: {},
  },
});

export default state;
