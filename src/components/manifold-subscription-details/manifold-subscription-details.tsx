import { Component, Element, Prop, State, Watch, h } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { SubscriptionQuery } from '../../types/graphql';
import query from './subscription.graphql';

@Component({
  tag: 'manifold-subscription-details',
})
export class ManifoldSubscriptionCreate {
  @Prop() id: string;
  @State() data?: SubscriptionQuery;
  @Element() el: HTMLElement;

  connection: Connection;

  @Watch('id')
  async getSubscription(newValue: string, oldValue: string) {
    if (!newValue) {
      throw new Error(`Missing proprty \`id\` on ${this.el.tagName.toLocaleLowerCase()}`);
    }

    if (newValue !== oldValue) {
      const response = await this.connection.graphqlFetch<SubscriptionQuery>({
        query,
        variables: { id: newValue },
      });

      if (response.data) {
        this.data = response.data;
      }
    }
  }

  async componentWillLoad() {
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;
    this.connection = await core.initialize({
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      version: 0,
    });

    this.getSubscription(this.id, '');
  }

  render() {
    if (this.data?.subscription) {
      return <h3>{this.data.subscription.plan.displayName}</h3>;
    }

    return null;
  }
}
