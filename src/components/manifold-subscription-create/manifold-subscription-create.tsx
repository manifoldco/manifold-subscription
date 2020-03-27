import { Component, Element, Prop, h, Watch, State } from '@stencil/core';
import { loadStripe, Stripe, StripeCardElement, SetupIntent } from '@stripe/stripe-js';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import query from './Plan.graphql';
import { PlanQuery, PlanQueryVariables } from '../../types/graphql';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import PlanCard from './components/PlanCard';
import Message from './components/Message';
// import SubsciptionCreate from './components/SubsciptionCreate';

@Component({
  tag: 'manifold-subscription-create',
  styleUrl: 'manifold-subscription-create.scss',
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

  /**
   * Component heading text
   */
  @Prop() heading?: string;
  /**
   * Plan ID for the new subscription
   */
  @Prop() planId: string;
  @Watch('planId') async updatePlan(planId: string) {
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

  async initializeStripeElements() {
    this.stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    if (!this.stripe) {
      return;
    }

    const elements = this.stripe.elements();

    this.card = elements.create('card');
    if (this.card && this.cardPlaceholder) {
      this.card.mount(this.cardPlaceholder);
      this.cardPlaceholder.removeAttribute('data-is-loading');
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

    this.updatePlan(this.planId);
  }

  componentDidLoad() {
    this.initializeStripeElements();
  }

  subscribe = async (e: UIEvent) => {
    e.preventDefault();
    if (this.stripe && !this.subscribing) {
      this.subscribing = true;

      const { setupIntent, error } = await this.stripe.confirmCardSetup('', {
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
          // The setup has succeeded. Display a success message. Send
          // setupIntent.payment_method to your server to save the card to a Customer
        }
      }
    }
  };

  render() {
    return [
      this.heading && <h1 class="ManifoldSubscriptionCreate__Heading">{this.heading}</h1>,
      <PlanCard isLoading={this.loading} plan={this.data?.plan || undefined} />,
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
          Subscribe with Card
        </button>
        <p class="ManifoldSubscriptionCreate__HelpText">
          We charge for plan cost + usage at end of month
        </p>
        {this.setupIntentStatus === 'succeeded' && (
          <Message type="success">You've been subscribed!</Message>
        )}
        {this.setupIntentError && <Message type="error">{this.setupIntentError}</Message>}
      </form>,
    ];
  }
}
