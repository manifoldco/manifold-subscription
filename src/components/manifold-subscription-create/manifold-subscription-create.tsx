import { Component, Element, Prop, h, Watch, State, Listen } from '@stencil/core';
import { loadStripe, Stripe, StripeCardElement, SetupIntent } from '@stripe/stripe-js';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import { PlanQuery, PlanQueryVariables, PlanListQuery } from '../../types/graphql';
import PlanSelector from './components/PlanSelector';
import PlanCard from './components/PlanCard';
import Message from './components/Message';
import planQuery from './plan.graphql';
import planListQuery from './plan-list.graphql';

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

  @Prop({ mutable: true }) connection?: Connection;
  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) errors?: GraphqlError[];
  @Prop({ mutable: true }) data?: PlanQuery;
  @Prop({ mutable: true }) planListData?: PlanListQuery;
  @Prop({ mutable: true }) setupIntentStatus?: SetupIntent.Status;
  @Prop({ mutable: true }) setupIntentError?: string;
  @Prop({ mutable: true }) subscribing?: boolean = false;
  // TODO watch configuredFeatures and get cost
  @Prop({ mutable: true }) configuredFeatures: {
    label: string;
    value: string | number | boolean;
  }[] = [];

  /**
   * Component heading text
   */
  @Prop() heading?: string;
  /**
   * Plan ID for the new subscription
   */
  @Prop({ mutable: true }) planId: string;
  // TODO watch planId change and get default configured features

  @Prop({ mutable: true }) isEditing: boolean = true;
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

    if (!this.connection) {
      throw new Error('Missing property `connection` on `manifold-subscription-create`.');
    }

    this.loading = true;

    const variables: PlanQueryVariables = { planId };
    const { data, errors } = await this.connection.graphqlFetch<PlanQuery>({
      query: planQuery,
      variables,
    });

    const { data: planListData, errors: planListErrors } = await this.connection.graphqlFetch<
      PlanListQuery
    >({
      query: planListQuery,
      variables: { productLabel: data?.plan.product.label },
    });

    if (errors || planListErrors) {
      this.errors = errors;
    }
    if (data && planListData) {
      this.data = data;
      this.planListData = planListData;
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
  }

  @Listen('manifold-configured-feature-change')
  updateConfiguredFeature(event: CustomEvent) {
    const currentFeatureIndex = this.configuredFeatures.findIndex(
      cf => cf.label === event.detail.label
    );

    if (currentFeatureIndex === -1) {
      this.configuredFeatures = [...this.configuredFeatures, event.detail];
    } else {
      this.configuredFeatures[currentFeatureIndex] = event.detail;
    }
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
          // eslint-disable-next-line no-console
          console.log(this.configuredFeatures);
        }
      }
    }
  };

  setPlanId = (planId: string) => {
    this.planId = planId;
  };

  setConfiguredFeature = (label: string, value: string | number | boolean) => {
    // Insert new value (this might not be needed if set to default values)
    const currentFeatureIndex = this.configuredFeatures.findIndex(cf => cf.label === label);
    if (currentFeatureIndex === -1) {
      this.configuredFeatures = [...this.configuredFeatures, { label, value }];
      return;
    }

    // Update existing value
    this.configuredFeatures = this.configuredFeatures.reduce(
      (acc, curr) => (curr.label === label ? [...acc, { label, value }] : [...acc, curr]),
      []
    );
  };

  render() {
    console.log(this.configuredFeatures);
    return (
      <div class="ManifoldSubscriptionCreate">
        {this.heading && <h1 class="ManifoldSubscriptionCreate__Heading">{this.heading}</h1>}
        {this.isEditing ? (
          <PlanSelector
            planId={this.planId}
            setPlanId={this.setPlanId}
            setConfiguredFeature={this.setConfiguredFeature}
            configuredFeatures={this.configuredFeatures}
            data={this.planListData}
          />
        ) : (
          <PlanCard isLoading={this.loading} plan={this.data?.plan || undefined}>
            <button class="ManifoldSubscriptionCreate__ModifyPlanButton">Change Plan</button>
          </PlanCard>
        )}
        <form class="ManifoldSubscriptionCreate__Form" method="post" onSubmit={this.subscribe}>
          <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__CardField">
            <span class="ManifoldSubscriptionCreate__Field__Label">Credit Card</span>
            <div
              class="StripeElement"
              ref={el => {
                this.cardPlaceholder = el;
              }}
              data-is-loading
            >
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
