import { SubscriptionsQuery } from '../../types/graphql';

const MockData: SubscriptionsQuery = {
  subscriptions: {
    edges: [
      {
        node: {
          plan: {
            displayName: 'Free Plan',
            cost: 0,
            configurableFeatures: {
              edges: [],
            },
          },
        },
      },
      {
        node: {
          plan: {
            displayName: 'Test Plan',
            cost: 1000,
            configurableFeatures: {
              edges: [],
            },
          },
        },
      },
      {
        node: {
          plan: {
            displayName: 'Custom Plan',
            cost: 0,
            configurableFeatures: {
              edges: [
                {
                  node: {
                    displayName: 'My Configurable Feature',
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
};

export default MockData;
