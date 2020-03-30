import { Component, Element, Prop, h, Watch, State } from '@stencil/core';
import { loadStripe, Stripe, StripeCardElement, SetupIntent } from '@stripe/stripe-js';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import query from './Plan.graphql';
import { PlanQuery, PlanQueryVariables } from '../../types/graphql';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import PlanCard from './components/PlanCard';
import Message from './components/Message';

// TODO add all these to the component API
//   $productId: ID!
//   $planId: ID! (done)
//   $regionId: ID!
//   $label: String
//   $displayName: String
//   $configuredFeatures: [ConfiguredFeatureInput!] (in progress)
//   $ownerId: ID!

@Component({
  tag: 'manifold-subscription-create',
})
export class ManifoldSubscriptionCreate {
  @Element() el: HTMLElement;

  stripe: Stripe | null;
  cardPlaceholder?: HTMLDivElement;
  @State() card: StripeCardElement;

  @Prop({ mutable: true }) connection: Connection;
  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) errors?: GraphqlError[];
  @Prop({ mutable: true }) data?: PlanQuery;
  @Prop({ mutable: true }) setupIntentStatus?: SetupIntent.Status;
  @Prop({ mutable: true }) setupIntentError?: string;
  @Prop({ mutable: true }) subscribing?: boolean = false;
  // TODO watch configuredFeatures and get cost
  @Prop({ mutable: true }) configuredFeatures?: { label: string; value: string }[];

  /**
   * Component heading text
   */
  @Prop() heading?: string;
  /**
   * Plan ID for the new subscription
   */
  @Prop() planId?: string;
  /**
   * (Optional) Name given to the new subscription
   */
  @Prop() displayName?: string;
  /**
   * (Optional) Label given to the new subscription
   */
  @Prop() label?: string;

  @Watch('planId') async updatePlan(planId?: string) {
    if (!planId) {
      throw new Error('Missing property `planId` on `manifold-subscription-create`');
    }

    this.loading = true;

    const variables: PlanQueryVariables = { planId };
    const { data, errors } = await this.connection.graphqlFetch<PlanQuery>({
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

    this.updatePlan(this.planId);
    this.updateFeaturesFromChildren();
  }

  // TODO create helper web component for configurable features
  updateFeaturesFromChildren() {
    const featureElements = Array.from(this.el.getElementsByTagName('manifold-configured-feature'));
    const featureData = featureElements.map(element => ({
      label: element.getAttribute('label') || '',
      value: element.getAttribute('value') || '',
    }));

    this.configuredFeatures = featureData;
  }

  async initializeStripeElements() {
    // TODO replace token with a Manifold Stripe token.
    // Initialize Stripe
    this.stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    if (!this.stripe) {
      return;
    }

    // Create and mount Stripe card element
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    if (this.card && this.cardPlaceholder) {
      this.card.mount(this.cardPlaceholder);
      this.cardPlaceholder.removeAttribute('data-is-loading');
    }
  }

  componentDidLoad() {
    this.initializeStripeElements();
  }

  subscribe = async (e: UIEvent) => {
    e.preventDefault();
    if (this.data && this.stripe && !this.subscribing) {
      this.subscribing = true;
      const { stripeSetupIntentSecret } = this.data.profile;

      const { setupIntent, error } = await this.stripe.confirmCardSetup(stripeSetupIntentSecret, {
        payment_method: {
          card: this.card,
        },
      });

      this.subscribing = false;

      if (error) {
        this.setupIntentError = error.message;
      } else {
        this.setupIntentStatus = setupIntent?.status;
        if (setupIntent?.status === 'succeeded') {
          // TODO Send setupIntent.payment_method to your server to save the card to a Customer
          console.log(this.configuredFeatures);
        }
      }
    }
  };

  render() {
    return (
      <div class="ManifoldSubscriptionCreate">
        {this.heading && <h1 class="ManifoldSubscriptionCreate__Heading">{this.heading}</h1>}
        <PlanCard isLoading={this.loading} plan={this.data?.plan || undefined} />
        <form class="ManifoldSubscriptionCreate__Form" method="post" onSubmit={this.subscribe}>
          <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__CardField">
            <span class="ManifoldSubscriptionCreate__Field__Label">Credit Card</span>
            <div class="StripeElement" ref={el => (this.cardPlaceholder = el)} data-is-loading>
              Credit Card Field
            </div>
          </label>
          <button
            class="ManifoldSubscriptionCreate__Button"
            type="submit"
            disabled={this.subscribing}
          >
            {this.subscribing ? 'Subscribing...' : 'Subscribe with Card'}
          </button>
          <p class="ManifoldSubscriptionCreate__HelpText">
            We charge for plan cost + usage at end of month
          </p>
          {/* TODO restyle success state when designs are available */}
          {this.setupIntentStatus === 'succeeded' && (
            <Message type="success">You've been subscribed!</Message>
          )}
          {/* TODO restyle error states when designs become available */}
          {this.setupIntentError && <Message type="error">{this.setupIntentError}</Message>}
        </form>
      </div>
    );
  }
}
