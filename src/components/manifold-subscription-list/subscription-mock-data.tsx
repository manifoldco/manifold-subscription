import { SubscriptionsQuery } from '../../types/graphql';

const MockData: SubscriptionsQuery = {
  subscriptions: {
    edges: [
      {
        node: {
          plan: {
            displayName: 'Free Plan',
            cost: 0,
          },
        },
      },
      {
        node: {
          plan: {
            displayName: 'Test Plan',
            cost: 1000,
          },
        },
      },
    ],
  },
};

export default MockData;
