import { createStore } from '@stencil/store';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { SubscriptionViewQuery, SubscriptionEditQuery } from '../../../types/graphql';
import { FeatureMap } from '../../../utils/plan';

export interface Subscription {
  id: string;
  status: SubscriptionViewQuery['subscription']['status'];
  plan: SubscriptionViewQuery['subscription']['plan'];
  configuredFeatures: FeatureMap;
}

export interface Cost {
  isLoading?: boolean;
  amount?: number;
  error?: string;
}

export interface SubscriptionDetailsStore {
  state: {
    connection?: Connection;
    isEditing?: boolean;
    heading?: string;
    subscriptionId?: string;
    isUpdated?: boolean;
    isUpdating?: boolean;
    view: {
      isLoading?: boolean;
      subscription?: Subscription;
      cost: Cost;
    };
    edit: {
      isLoading?: boolean;
      plans?: SubscriptionEditQuery['subscription']['plan']['product']['plans']['edges'];
      selectedPlanId?: string;
      configuredFeatures?: FeatureMap;
      cost: Cost;
    };
  };
}

const { state } = createStore<SubscriptionDetailsStore>({
  state: {
    view: {
      cost: {},
    },
    edit: {
      cost: {},
    },
  },
});

export default state;
