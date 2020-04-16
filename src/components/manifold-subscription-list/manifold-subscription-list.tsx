import { Component, Event, EventEmitter, Element, Prop, h, Watch } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import { SubscriptionsQuery, SubscriptionsQueryVariables } from '../../types/graphql';
import ListCard from './components/ListCard';
import query from './subscriptions.graphql';

@Component({
  tag: 'manifold-subscription-list',
})
export class ManifoldSubscriptionList {
  @Element() el: HTMLElement;

  @Event() ctaClick: EventEmitter;

  @Prop({ mutable: true }) connection?: Connection;
  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) errors?: GraphqlError[];
  @Prop({ mutable: true }) data?: SubscriptionsQuery;
  @Prop() baseUrl?: string = '/subscriptions';

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

    const variables: SubscriptionsQueryVariables = { owner };
    const { data, errors } = await this.connection.graphqlFetch<SubscriptionsQuery>({
      query,
      variables,
    });

    if (errors) {
      this.errors = errors;
    }
    if (data) {
      this.data = data;
    }

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

  ctaHref(planID: string) {
    if (!this.baseUrl || this.baseUrl === '#') {
      return this.baseUrl;
    }

    // const search = new URLSearchParams();
    // set plan ID
    // search.set('planId', planID);

    // // set configurable feature selection (or skip, if no configurable features);
    // Object.entries(this.userSelection[planID] || {}).forEach(([key, val]) => {
    //   search.set(key, `${val}`);
    // });

    return `${this.baseUrl}/${planID.toString()}`;
  }

  handleCtaClick = (planId: string) => (e: MouseEvent) => {
    e.preventDefault();
    this.ctaClick.emit({ id: `manifold-cta-plan-${planId}` });

    // this.connection;
    // .analytics
    // .track({
    //   description: 'Track pricing matrix cta clicks',
    //   name: 'click',
    //   type: 'component-analytics',
    //   properties: {
    //     planId,
    //   },
    // })
    // .finally(() => {
    const anchor = e.srcElement as HTMLAnchorElement; // ?
    window.location.href = anchor.href; // ?
    // });
  };

  render() {
    return (
      <div class="ManifoldSubscriptionCreate ManifoldSubscriptionCreate__List">
        {this.heading && <h1 class="ManifoldSubscription__Heading">{this.heading}</h1>}

        {this.data?.subscriptions &&
          this.data?.subscriptions.edges.map(sub => {
            return (
              <ListCard
                isLoading={this.loading}
                plan={sub.node.plan || undefined}
                isConfigurable={
                  sub.node.plan.configurableFeatures &&
                  sub.node.plan.configurableFeatures.edges.length > 0
                }
                ctaHref={this.ctaHref(sub.node.plan.id)}
                onCtaClick={this.handleCtaClick(sub.node.plan.id)}
              />
            );
          })}
      </div>
    );
  }
}
