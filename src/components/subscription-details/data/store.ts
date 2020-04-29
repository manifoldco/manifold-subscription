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

export interface SubscriptionDetailsStore {
  state: {
    connection?: Connection;
    isEditing?: boolean;
    heading?: string;
    subscriptionId?: string;
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
      plans?: SubscriptionEditQuery['subscription']['plan']['product']['plans']['edges'];
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
