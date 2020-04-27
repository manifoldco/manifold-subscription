import { Component, Element, Prop, State, Watch, h } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import FixedFeature from 'components/shared/FixedFeature';
import MeteredFeature from 'components/shared/MeteredFeature';
import ConfigurableFeature from 'components/shared/ConfigurableFeature';
import CostDisplay from 'components/shared/CostDisplay';
import query from './subscription.graphql';
import {
  SubscriptionQuery,
  PlanFixedFeatureEdge,
  PlanMeteredFeatureEdge,
  PlanConfigurableFeatureEdge,
} from '../../types/graphql';
import state from './store';
import PlanSelector from './components/PlanSelector';
import { toFeatureMap } from '../../utils/plan';

@Component({
  tag: 'manifold-subscription-details',
})
export class ManifoldSubscriptionCreate {
  @Prop() subscriptionId: string;
  @Watch('subscriptionId') updateSubscriptionId(subscriptionId: string) {
    state.subscriptionId = subscriptionId;
  }
  @Prop() heading?: string;
  @Prop() isEditing?: boolean = false;
  @Watch('isEditing') updateisEditing(value?: boolean) {
    state.isEditing = value;
  }
  @State() data?: SubscriptionQuery;
  @Element() el: HTMLElement;

  connection: Connection;

  @Watch('subscriptionId')
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
        state.currentPlan = response.data.subscription.plan;
        state.configuredFeatures = toFeatureMap(response.data.subscription.configuredFeatures);
      }
    }
  }

  async componentWillLoad() {
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;

    const connection = await core.initialize({
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      version: 0,
    });

    state.connection = connection;
    this.connection = connection;

    this.updateisEditing(this.isEditing);
    this.updateSubscriptionId(this.subscriptionId);

    this.getSubscription(this.subscriptionId, '');
  }

  render() {
    if (!this.data || !this.data.subscription) {
      return null;
    }

    if (state.isEditing) {
      return (
        <PlanSelector
          productId={this.data.subscription.plan.product.id}
          planId={this.data.subscription.plan.id}
        />
      );
    }

    const { status } = this.data.subscription;
    const plan = state.currentPlan;

    if (!plan) {
      return null;
    }

    return (
      <div class="ManifoldSubscriptionCreate__Details">
        {this.heading && <h1 class="ManifoldSubscription__Heading">{this.heading}</h1>}
        <section class="ManifoldSubscriptionCreate__Card">
          <header class="ManifoldSubscriptionCreate__Details__Header">
            <h2 class="ManifoldSubscriptionCreate__PlanName">{plan.displayName}</h2>
            <h3 class="ManifoldSubscriptionCreate__SubscriptionStatus" data-status={status.label}>
              <div class="ManifoldSubscriptionCreate__SubscriptionStatusIndicator" />
              {status.label}
            </h3>
          </header>
          <dl class="ManifoldSubscriptionCreate__Details__FeatureList">
            {plan.fixedFeatures.edges.map(fixedFeature => (
              <FixedFeature fixedFeature={fixedFeature as PlanFixedFeatureEdge} />
            ))}
            {plan.meteredFeatures.edges.map(meteredFeature => (
              <MeteredFeature meteredFeature={meteredFeature as PlanMeteredFeatureEdge} />
            ))}
            {plan.configurableFeatures.edges.map(configurableFeature => (
              // TODO format configured feature so it displays as fixed
              <ConfigurableFeature
                readOnly
                setConfiguredFeature={() => null}
                configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
                value={state.configuredFeatures[configurableFeature.node.label]}
              />
            ))}
          </dl>
          <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
            <div>
              <CostDisplay baseCost={plan.cost} />
              <p class="ManifoldSubscriptionCreate__HelpText">Usage billed at the end of month</p>
            </div>
            <button
              type="button"
              class="ManifoldSubscription__Button"
              data-kind="black"
              onClick={() => {
                state.isEditing = true;
              }}
            >
              Modify Subsciption
            </button>
          </footer>
        </section>
      </div>
    );
  }
}
