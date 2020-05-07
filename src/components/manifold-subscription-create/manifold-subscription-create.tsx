import {
  Component,
  Element,
  Prop,
  h,
  Watch,
  State,
  Listen,
  Event,
  EventEmitter,
} from '@stencil/core';
import { loadStripe, Stripe, StripeCardElement, SetupIntent } from '@stripe/stripe-js';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import {
  PlanQuery,
  PlanQueryVariables,
  ProfileQuery,
  PlanListQuery,
  CreateSubscriptionMutationVariables,
  CreateSubscriptionMutation,
} from '../../types/graphql';
import PlanSelector from '../shared/PlanSelector';
import PlanCard from '../shared/PlanCard';
import Message from '../shared/Message';
import planQuery from './plan.graphql';
import planListQuery from './plan-list.graphql';
import profileQuery from './profile.graphql';
import createSubscrptionMutation from './create-subscription.graphql';
import { FeatureMap } from '../../utils/plan';
import {
  UIError,
  filterErrors,
  interfaceError,
  dataError,
  subscriptionError,
  validationError,
} from '../../utils/error';

@Component({
  tag: 'manifold-subscription-create',
})
export class ManifoldSubscriptionCreate {
  @Element() el: HTMLElement;

  connection?: Connection;

  stripe: Stripe | null;
  cardPlaceholder?: HTMLDivElement;
  @State() card: StripeCardElement;
  @State() cardStatus: 'empty' | 'partial' | 'complete' = 'empty';
  @State() profile: ProfileQuery['profile'];

  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) isLoadingPlanSelector?: boolean = false;
  @Prop({ mutable: true }) errors: UIError[] = [];
  @Prop({ mutable: true }) data?: PlanQuery;
  @Prop({ mutable: true }) planListData?: PlanListQuery;
  @Prop({ mutable: true }) setupIntentStatus?: SetupIntent.Status;
  @Prop({ mutable: true }) setupIntentError?: string;
  @Prop({ mutable: true }) subscribing?: boolean = false;
  @Prop({ mutable: true }) configuredFeatures: FeatureMap = {};
  @Prop({ mutable: true }) calculatedCost?: number | null;
  @Prop({ mutable: true }) isEditing: boolean = false;

  /**
   * Puts the component in preview mode
   */
  @Prop() preview?: boolean;
  /**
   * Component heading text
   */
  @Prop() heading?: string;
  /**
   * Plan ID for the new subscription
   */
  @Prop({ mutable: true }) planId: string;
  /**
   * Plan ID for the new subscription
   */
  @Prop() ownerId: string;

  /**
   * Plan ID for the new subscription
   */
  @Prop() stripePublishableKey: string;

  /**
   * (Optional) Name given to the new subscription
   */
  @Prop() displayName?: string;
  /**
   * (Optional) Label given to the new subscription
   */
  @Prop() label?: string;

  async componentWillLoad() {
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;
    this.connection = await core.initialize({
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      version: 0,
    });
  }

  componentDidLoad() {
    this.updatePlan(this.planId);
    this.initializeStripeElements();
  }

  addErrors = (...errors: UIError[]) => {
    this.errors = [...this.errors, ...errors];
  };

  removeErrors = (...labels: string[]) => {
    this.errors = filterErrors(this.errors, 'label', labels, false);
  };

  async initializeStripeElements() {
    // Only initialize once
    if (this.stripe) {
      return;
    }

    this.removeErrors('stripe-init');

    if (!this.connection) {
      this.addErrors(interfaceError('stripe-init'));
      throw new Error('Missing property `connection` on `manifold-subscription-create`.');
    }

    let res;

    if (this.preview) {
      res = {
        data: {
          profile: {
            stripeAccount: {
              id: '',
            },
          },
        } as ProfileQuery,
      };
    } else {
      res = await this.connection
        .graphqlFetch<ProfileQuery>({
          query: profileQuery,
        })
        .catch(e => {
          this.addErrors(dataError('stripe-init', 'profile'));
          throw new Error(e);
        });
    }

    if (res.errors || !res.data) {
      this.addErrors(dataError('stripe-init', 'profile'));
      return;
    }

    this.profile = res.data.profile;

    // Initialize Stripe
    this.stripe = await loadStripe(
      this.stripePublishableKey,
      this.preview
        ? {}
        : {
            stripeAccount: res.data.profile.stripeAccount.id,
          }
    );

    if (!this.stripe) {
      this.addErrors(interfaceError('stripe-init'));

      throw new Error(
        'Could not load Stripe with the following credentials:' +
          `\n\tStripePublishable Key: ${this.stripePublishableKey}` +
          `\n\tStripe Account ID: ${res.data.profile.stripeAccount.id}`
      );
    }

    // Create and mount Stripe card element
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    if (this.card && this.cardPlaceholder) {
      this.card.mount(this.cardPlaceholder);
      this.cardPlaceholder.removeAttribute('data-is-loading');

      this.card.on('change', e => {
        if (e.empty) {
          this.cardStatus = 'empty';
        } else if (e.complete) {
          this.cardStatus = 'complete';
        } else {
          this.cardStatus = 'partial';
        }

        this.removeErrors('card', 'validation_error');

        if (e.error) {
          this.addErrors(validationError(e.error.type, e.error.message));
        }
      });
    } else {
      this.addErrors(interfaceError('stripe-init'));
      throw new Error('Could not mount Stripe element.');
    }
  }

  @Watch('planId') async updatePlan(planId?: string) {
    this.removeErrors('plan-query');

    if (!planId) {
      this.addErrors(interfaceError('plan-query'));
      throw new Error('Missing property `planId` on `manifold-subscription-create`');
    }

    if (!this.connection) {
      this.addErrors(interfaceError('plan-query'));
      throw new Error('Missing property `connection` on `manifold-subscription-create`.');
    }

    this.data = undefined;

    this.loading = true;

    const variables: PlanQueryVariables = { planId };
    const { data, errors } = await this.connection
      .graphqlFetch<PlanQuery>({
        query: planQuery,
        variables,
      })
      .catch(e => {
        this.addErrors(dataError('plan-query', 'selected plan'));
        throw new Error(e);
      });

    if (errors) {
      this.addErrors(dataError('plan-query', 'selected plan'));
    }

    if (data) {
      this.data = data;
    }

    this.loading = false;
  }

  @Listen('manifold-configured-feature-change')
  updateConfiguredFeature(event: CustomEvent<{ label: string; value: string | number | boolean }>) {
    const { label, value } = event.detail;
    this.setConfiguredFeature(label, value);
  }

  setConfiguredFeature = (label: string, value: string | number | boolean) => {
    this.configuredFeatures = { ...this.configuredFeatures, [label]: value };
  };

  setAllConfiguredFeatures = (features: FeatureMap = {}) => {
    this.configuredFeatures = features;
  };

  controller?: AbortController;

  @Watch('configuredFeatures')
  async fetchCustomCost(configuredFeatures: FeatureMap) {
    this.removeErrors('cost');

    // if not configurable, return plan cost
    if (Object.keys(this.configuredFeatures).length === 0) {
      this.calculatedCost = undefined;
      return undefined;
    }

    if (!this.connection) {
      this.addErrors(dataError('cost', 'cost of selected plan'));
      throw new Error('Missing property `connection` on `manifold-subscription-create`.');
    }

    // Hide display while calculating
    this.calculatedCost = null;

    // If a request is in flight, cancel it
    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();

    try {
      interface CostResponse {
        cost: number;
      }
      interface CostRequest {
        features: FeatureMap;
      }

      const { cost } = await this.connection.gateway.post<CostResponse, CostRequest>(
        `/id/plan/${this.planId}/cost`,
        {
          features: configuredFeatures,
        },
        { signal: this.controller.signal }
      );

      this.calculatedCost = cost;
    } catch (e) {
      if (e.name !== 'AbortError') {
        this.addErrors(dataError('cost', 'cost of selected plan'));
      }
    }
    return undefined;
  }

  subscribe = async (e: UIEvent) => {
    e.preventDefault();

    if (this.preview) {
      return;
    }

    await this.removeErrors('subscription', 'card');

    if (this.cardStatus === 'empty') {
      this.addErrors(validationError('card', 'Card is empty.'));
      return;
    }

    if (this.cardStatus !== 'complete' || this.cardStatus !== 'complete') {
      this.addErrors(validationError('card', 'Card is invalid.'));
      return;
    }

    if (!this.connection) {
      this.addErrors(subscriptionError());
      throw new Error('Missing property `connection` on `manifold-subscription-create`.');
    }

    if (this.data && this.stripe && !this.subscribing) {
      this.subscribing = true;
      const { stripeSetupIntentSecret } = this.profile;

      const { setupIntent, error } = await this.stripe.confirmCardSetup(stripeSetupIntentSecret, {
        payment_method: {
          card: this.card,
        },
      });

      if (error) {
        this.subscribing = false;
        this.addErrors(subscriptionError());

        throw new Error(
          'Stripe could not confirm card setup with the following credentials:' +
            `\n\tStripe Setup Intent Secret: ${stripeSetupIntentSecret}`
        );
      }

      if (setupIntent?.status === 'succeeded') {
        const configuredFeatures = Object.keys(this.configuredFeatures).map(key => ({
          label: key,
          value: `${this.configuredFeatures[key]}`,
        }));

        const variables: CreateSubscriptionMutationVariables = {
          ownerId: this.ownerId,
          planId: this.planId,
          configuredFeatures,
        };

        const { data, errors } = await this.connection
          .graphqlFetch<CreateSubscriptionMutation>({
            query: createSubscrptionMutation,
            variables,
          })
          .catch(err => {
            this.addErrors(subscriptionError());
            throw new Error(err);
          });

        if (errors) {
          this.addErrors(subscriptionError());
        }

        if (data) {
          this.createSuccess.emit({ id: data.createSubscription.data.id });
        }
      } else {
        this.addErrors(subscriptionError());
      }

      this.subscribing = false;
    }
  };

  @Event({ eventName: 'success' }) createSuccess: EventEmitter<{ id: string }>;

  setPlanId = (planId: string) => {
    this.planId = planId;
  };

  toggleIsEditing = async () => {
    this.isEditing = !this.isEditing;
    this.removeErrors('plan-list-query');

    if (!this.connection) {
      this.addErrors(interfaceError('plan-list-query'));
      throw new Error('Missing property `connection` on `manifold-subscription-create`.');
    }

    if (!this.data) {
      this.addErrors(dataError('plan-list-query', 'selected plan'));
      throw new Error('Missing property `data` on `manifold-subscription-create`.');
    }

    this.isLoadingPlanSelector = true;

    const { data, errors } = await this.connection
      .graphqlFetch<PlanListQuery>({
        query: planListQuery,
        variables: { productLabel: this.data?.plan.product.label },
      })
      .catch(e => {
        this.addErrors(dataError('plan-list-query', 'all plans for this product'));
        throw new Error(e);
      });

    if (errors) {
      this.addErrors(dataError('plan-list-query', 'all plans for this product'));
    }

    if (data) {
      this.planListData = data;
    }

    this.isLoadingPlanSelector = false;
    return null;
  };

  render() {
    const interfaceErrors = filterErrors(this.errors, 'type', ['interface']);
    const dataErrors = filterErrors(this.errors, 'type', ['data']);
    const interfaceDataErrors = [...interfaceErrors, ...dataErrors];
    const subscriptionErrors = filterErrors(this.errors, 'type', ['subscription']);
    const validationErrors = filterErrors(this.errors, 'type', ['validation']);

    return (
      <div class="ManifoldSubscriptionCreate">
        {this.heading && <h1 class="ManifoldSubscription__Heading">{this.heading}</h1>}
        {interfaceDataErrors.length > 0 && (
          <div class="ManifoldSubscriptionCreate__MessageContainer">
            {interfaceDataErrors.map(error => (
              <Message type="error">{error.message}</Message>
            ))}
          </div>
        )}
        <form
          class="ManifoldSubscriptionCreate__Form"
          method="post"
          onSubmit={this.subscribe}
          data-interface-error={interfaceErrors.length > 0}
          data-data-error={dataErrors.length > 0}
        >
          {this.isEditing ? (
            <PlanSelector
              planId={{
                value: this.planId,
                set: this.setPlanId,
              }}
              configuredFeatures={{
                value: this.configuredFeatures,
                set: this.setConfiguredFeature,
                setAll: this.setAllConfiguredFeatures,
              }}
              calculatedCost={this.calculatedCost}
              errors={filterErrors(this.errors, 'label', ['cost', 'plan-list-query'])}
              data={this.planListData}
              isLoading={this.isLoadingPlanSelector}
            />
          ) : (
            <PlanCard
              isLoading={this.loading}
              plan={this.data?.plan || undefined}
              calculatedCost={this.calculatedCost}
              errors={filterErrors(this.errors, 'label', ['plan-query'])}
            >
              <button
                type="button"
                class="ManifoldSubscriptionCreate__ModifyPlanButton"
                onClick={this.toggleIsEditing}
              >
                Change Plan
              </button>
            </PlanCard>
          )}

          <div class="ManifoldSubscription__Field ManifoldSubscription__Field--Card">
            <label class="ManifoldSubscription__Field__Label">Credit Card</label>
            <div
              class="StripeElement"
              ref={el => {
                this.cardPlaceholder = el;
              }}
              data-is-loading
            >
              Credit Card Field
            </div>
            {validationErrors.map(error => (
              <p class="ManifoldSubscription__Field__InlineError">{error.message}</p>
            ))}
          </div>
          <button
            class="ManifoldSubscription__Button"
            type="submit"
            data-kind="primary"
            disabled={
              this.subscribing ||
              filterErrors(this.errors, 'type', ['data', 'interface']).length > 0
            }
          >
            {this.subscribing ? 'Subscribing...' : 'Subscribe with Card'}
          </button>
          {subscriptionErrors.length > 0 && (
            <div class="ManifoldSubscriptionCreate__MessageContainer">
              {subscriptionErrors.map(error => (
                <Message type="error">{error.message}</Message>
              ))}
            </div>
          )}
          <p class="ManifoldSubscription__HelpText" data-centered>
            We charge for plan cost + usage at end of month
          </p>
        </form>
      </div>
    );
  }
}
