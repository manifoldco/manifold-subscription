import { Component, Event, EventEmitter, Element, Prop, h, Watch } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import {
  SubscriptionListQuery,
  SubscriptionListQueryVariables,
  SubscriptionListPreviewQueryVariables,
  SubscriptionListPreviewQuery,
} from '../../types/graphql';
import ListCard from './components/ListCard';
import fragment from './list-plan-fragment.graphql';
import query from './subscription-list.graphql';
import previewQuery from './subscription-list-preview.graphql';

interface FetchSubscriptionList {
  owner?: string;
  connection: Connection;
  preview?: boolean;
  productId?: string;
}

const fetchSubscriptionList = async (args: FetchSubscriptionList) => {
  const { owner, connection, preview, productId } = args;

  if (preview && productId) {
    const variables: SubscriptionListPreviewQueryVariables = { productId };
    const res = await connection.graphqlFetch<SubscriptionListPreviewQuery>({
      query: fragment + previewQuery,
      variables,
    });

    if (res.data) {
      const edges = res.data.product.plans.edges.map(({ node }) => ({
        node: {
          id: node.id,
          plan: node,
        },
      }));

      return {
        data: {
          subscriptions: {
            edges,
          },
        } as SubscriptionListQuery,
        errors: null,
      };
    }
    return { errors: res.errors };
  }

  const variables: SubscriptionListQueryVariables = { owner };
  const res = await connection.graphqlFetch<SubscriptionListQuery>({
    query: fragment + query,
    variables,
  });
  return res;
};

@Component({
  tag: 'manifold-subscription-list',
})
export class ManifoldSubscriptionList {
  @Element() el: HTMLElement;

  @Event() ctaClick: EventEmitter;

  @Prop({ mutable: true }) connection?: Connection;
  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) errors?: GraphqlError[];
  @Prop({ mutable: true }) data?: SubscriptionListQuery;

  @Prop() productId?: string;

  /**
   * Puts the component in preview mode
   */
  @Prop() preview?: boolean = false;

  /**
   * Component subscription link format
   */
  @Prop({ mutable: true }) subLinkFormat?: string;
  /**
   * Component heading text
   */
  @Prop() heading?: string;
  /**
   * Owner for subscriptions
   */
  @Prop() owner?: string;

  @Watch('owner') async getSubscriptions(owner?: string) {
    if (!owner && !this.preview) {
      throw new Error('Missing property `owner` on `manifold-subscription-list`');
    }

    if (!this.connection) {
      throw new Error('Missing property `connection` on `manifold-subscription-list`.');
    }

    this.loading = true;

    const { data, errors } = await fetchSubscriptionList({
      owner,
      connection: this.connection,
      preview: this.preview,
      productId: this.productId,
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

  handleCtaClick = (subId: string, href: string) => (e: MouseEvent) => {
    e.preventDefault();
    this.ctaClick.emit({ subscriptionId: subId });

    if (this.connection) {
      this.connection.analytics
        .track({
          description: 'Track modify subscription button cta clicks',
          name: 'click',
          type: 'component-analytics',
          properties: {
            subId,
          },
        })
        .finally(() => {
          if (href) {
            const anchor = e.srcElement as HTMLAnchorElement;
            window.location.href = anchor.href;
          }
        });
    }
  };

  render() {
    return (
      <div class="ManifoldSubscriptionCreate ManifoldSubscriptionCreate__List">
        {this.heading && <h1 class="ManifoldSubscription__Heading">{this.heading}</h1>}

        {this.data?.subscriptions &&
          this.data?.subscriptions.edges.map(sub => {
            const href =
              sub.node.id && this.subLinkFormat
                ? this.subLinkFormat.replace(/:subscription/gi, sub.node.id)
                : '';
            return (
              <ListCard
                isLoading={this.loading}
                plan={sub.node.plan || undefined}
                isConfigurable={
                  sub.node.plan.configurableFeatures &&
                  sub.node.plan.configurableFeatures.edges.length > 0
                }
                ctaHref={href}
                onCtaClick={this.handleCtaClick(sub.node.id, href)}
              />
            );
          })}
      </div>
    );
  }
}
