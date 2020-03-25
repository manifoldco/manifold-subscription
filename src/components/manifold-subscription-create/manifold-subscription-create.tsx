import { Component, Element, Prop, h, Watch, State } from '@stencil/core';
import {
  loadStripe,
  Stripe,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
  StripePaymentRequestButtonElement,
} from '@stripe/stripe-js';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import query from './Plan.graphql';
import { PlanQuery, PlanQueryVariables } from '../../types/graphql';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import PlanCard from './components/PlanCard';

@Component({
  tag: 'manifold-subscription-create',
  styleUrl: 'manifold-subscription-create.scss',
})
export class ManifoldSubscriptionCreate {
  @Element() el: HTMLElement;

  cardPlaceholder?: HTMLDivElement;
  expiryPlaceholder?: HTMLDivElement;
  cvcPlaceholder?: HTMLDivElement;
  paymentRequestButtonPlaceholder?: HTMLDivElement;

  stripe: Stripe | null;
  @State() card: StripeCardNumberElement;
  @State() expiry: StripeCardExpiryElement;
  @State() cvc: StripeCardCvcElement;
  @State() paymentRequestButton: StripePaymentRequestButtonElement;

  @Prop({ mutable: true }) connection: Connection;
  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) errors?: GraphqlError[];
  @Prop({ mutable: true }) data?: PlanQuery;

  /**
   * Plan ID for the new subscription
   */
  @Prop() heading?: string = 'Purchase Subscription';
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

  @Watch('data')
  async initializeStripeElements(data?: PlanQuery) {
    this.stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    if (!this.stripe || !data) {
      return;
    }

    const elements = this.stripe.elements();

    this.card = elements.create('cardNumber');
    this.expiry = elements.create('cardExpiry');
    this.cvc = elements.create('cardCvc');

    // Payments API
    const paymentRequest = this.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: data.plan.displayName,
        amount: data.plan.cost,
      },
    });
    const canMakePayment = await paymentRequest.canMakePayment();
    if (canMakePayment) {
      this.paymentRequestButton = elements.create('paymentRequestButton', {
        paymentRequest,
      });
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

  componentDidRender() {
    if (this.card && this.cardPlaceholder) {
      this.card.mount(this.cardPlaceholder);
    }

    if (this.expiry && this.expiryPlaceholder) {
      this.expiry.mount(this.expiryPlaceholder);
    }

    if (this.cvc && this.cvcPlaceholder) {
      this.cvc.mount(this.cvcPlaceholder);
    }

    if (this.paymentRequestButton && this.paymentRequestButtonPlaceholder) {
      this.paymentRequestButton.mount(this.paymentRequestButtonPlaceholder);
    }
  }

  render() {
    if (this.loading) {
      return <div>Loading</div>;
    }

    if (!this.data) {
      return 'Error';
    }

    return [
      <h1 class="ManifoldSubscriptionCreate__Heading">{this.heading}</h1>,
      <PlanCard {...this.data.plan} />,
      <form class="ManifoldSubscriptionCreate__Form">
        <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__CardField">
          <span class="ManifoldSubscriptionCreate__Field__Label">Card</span>
          <div ref={el => (this.cardPlaceholder = el)} />
        </label>
        <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__ExpiryField">
          <span class="ManifoldSubscriptionCreate__Field__Label">Expiry</span>
          <div ref={el => (this.expiryPlaceholder = el)} />
        </label>
        <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__CvcField">
          <span class="ManifoldSubscriptionCreate__Field__Label">CVC</span>
          <div ref={el => (this.cvcPlaceholder = el)} />
        </label>
        <button class="Manifold__Button" type="submit">
          Subscribe with Card
        </button>
        <div ref={el => (this.paymentRequestButtonPlaceholder = el)} />
      </form>,
    ];
  }
}
