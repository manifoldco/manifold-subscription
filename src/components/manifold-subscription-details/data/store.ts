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

export interface ErrorMessage {
  type: 'interface' | 'unknown';
  message: string;
}

export interface Cost {
  isLoading?: boolean;
  amount?: number;
  hasError?: boolean;
}

export interface SubscriptionDetailsStore {
  state: {
    connection?: Connection;
    isEditing?: boolean;
    heading?: string;
    subscriptionId?: string;
    preview?: boolean;
    isUpdated?: boolean;
    isUpdating?: boolean;
    errors: ErrorMessage[];

    view: {
      isLoading?: boolean;
      subscription?: Subscription;
      cost: Cost;
      errors: ErrorMessage[];
    };

    edit: {
      isLoading?: boolean;
      plans?: SubscriptionEditQuery['subscription']['plan']['product']['plans']['edges'];
      selectedPlanId?: string;
      configuredFeatures?: FeatureMap;
      cost: Cost;
      errors: ErrorMessage[];
    };
  };
}

const { state } = createStore<SubscriptionDetailsStore>({
  state: {
    errors: [],
    view: {
      cost: {},
      errors: [],
    },
    edit: {
      cost: {},
      errors: [],
    },
  },
});

export default state;
