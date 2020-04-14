import { Component, Element, Prop, h, Watch } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import { SubscriptionsQuery, SubscriptionsQueryVariables } from '../../types/graphql';
import ListCard from './components/ListCard';
import query from './subscriptions.graphql';
import MockData from './subscription-mock-data';

@Component({
  tag: 'manifold-subscription-list',
})
export class ManifoldSubscriptionList {
  @Element() el: HTMLElement;

  cardPlaceholder?: HTMLDivElement;

  @Prop({ mutable: true }) connection?: Connection;
  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) errors?: GraphqlError[];
  @Prop({ mutable: true }) data?: SubscriptionsQuery;

  /**
   * Component heading text
   */
  @Prop() heading?: string;
  /**
   * Owner ID for subscriptions
   */
  @Prop() owner?: string;

  @Watch('owner') async getSubscriptions(owner?: string) {
    if (!owner) {
      throw new Error('Missing property `owner` on `manifold-subscription-list`');
    }

    if (!this.connection) {
      throw new Error('Missing property `connection` on `manifold-subscription-list`.');
    }

    this.loading = true;

    // const variables: SubscriptionsQueryVariables = { owner };
    // const { data, errors } = await this.connection.graphqlFetch<SubscriptionsQuery>({
    //   query,
    //   variables,
    // });

    // if (errors) {
    //   this.errors = errors;
    // }
    if (MockData) {
      this.data = MockData;
    }
    // if (data) {
    //   this.data = data;
    // }

    this.loading = false;
  }

  async componentWillLoad() {
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;
    this.connection = await core.initialize({
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      version: 0,
    });

    this.getSubscriptions(this.owner);
  }

  render() {
    return (
      <div class="ManifoldSubscriptionCreate ManifoldSubscriptionCreate__List">
        {this.heading && <h1 class="ManifoldSubscriptionCreate__List__Heading">{this.heading}</h1>}

        {this.data?.subscriptions.edges.map(sub => {
          return (
            <ListCard
              isLoading={this.loading}
              plan={sub.node.plan || undefined}
              isConfigurable={sub.node.plan.configurableFeatures.edges[0] && true}
            />
          );
        })}
      </div>
    );
  }
}
