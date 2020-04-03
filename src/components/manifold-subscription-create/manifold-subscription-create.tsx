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
import { FeatureMap } from '../../utils/plan';

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
  @Prop({ mutable: true }) configuredFeatures: FeatureMap = {};
  @Prop({ mutable: true }) calculatedCost?: number;

  /**
   * Component heading text
   */
  @Prop() heading?: string;
  /**
   * Plan ID for the new subscription
   */
  @Prop({ mutable: true }) planId: string;

  resetConfiguredFeatures = (defaultFeatures: FeatureMap = {}) => {
    this.configuredFeatures = defaultFeatures;
  };

  @Prop({ mutable: true }) isEditing: boolean = false;
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
  updateConfiguredFeature(event: CustomEvent<{ label: string; value: string | number | boolean }>) {
    const { label, value } = event.detail;
    this.setConfiguredFeature(label, value);
  }

  @Watch('data')
  async initializeStripeElements(data: PlanQuery) {
    // Only initialize once
    if (this.stripe) {
      return;
    }
    // TODO replace token with a Manifold Stripe token.
    // Initialize Stripe
    this.stripe = await loadStripe(
      data.profile.stripeAccountID || 'pk_test_TYooMQauvdEDq54NiTphI7jx'
    );
    if (!this.stripe) {
      // TODO handle stripe error
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
    this.configuredFeatures = { ...this.configuredFeatures, [label]: value };
  };

  toggleIsEditing = () => {
    this.isEditing = !this.isEditing;
  };

  controller?: AbortController;

  @Watch('configuredFeatures')
  async fetchCustomCost(configuredFeatures: FeatureMap) {
    if (!this.connection) {
      return undefined;
    }

    // if not configurable, return plan cost
    if (this.configuredFeatures.length === 0) {
      this.calculatedCost = 0;
      return undefined;
    }

    // Hide display while calculating
    this.calculatedCost = undefined;
    this.errors = undefined;
    if (this.controller) {
      this.controller.abort();
    }

    // If a request is in flight, cancel it
    this.controller = new AbortController();

    // TODO pass controller to the request (might need to do this in manifold-init)
    try {
      const { cost } = await this.connection.gateway.post<
        { cost: number },
        { features: FeatureMap }
      >(`/id/plan/${this.planId}/cost`, {
        features: configuredFeatures,
      });

      this.calculatedCost = cost;
    } catch (e) {
      if (e.name !== 'AbortError') {
        // TODO store error in a better way so it can be displayed in place of cost in UI
        this.errors = [{ message: 'Error getting plan cost.' }];
      }
    }
    return undefined;
  }

  render() {
    return (
      <div class="ManifoldSubscriptionCreate">
        {this.heading && <h1 class="ManifoldSubscriptionCreate__Heading">{this.heading}</h1>}
        {this.isEditing ? (
          <PlanSelector
            planId={this.planId}
            setPlanId={this.setPlanId}
            setConfiguredFeature={this.setConfiguredFeature}
            resetConfiguredFeatures={this.resetConfiguredFeatures}
            configuredFeatures={this.configuredFeatures}
            calculatedCost={this.calculatedCost}
            data={this.planListData}
          />
        ) : (
          <PlanCard isLoading={this.loading} plan={this.data?.plan || undefined}>
            <button
              class="ManifoldSubscriptionCreate__ModifyPlanButton"
              onClick={this.toggleIsEditing}
            >
              Change Plan
            </button>
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
