/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { UIError, } from "./utils/error";
import { PlanListQuery, PlanQuery, SubscriptionsQuery, } from "./types/graphql";
import { SetupIntent, } from "@stripe/stripe-js";
import { FeatureMap, } from "./utils/plan";
import { Connection, } from "@manifoldco/manifold-init-types/types/v0";
import { GraphqlError, } from "@manifoldco/manifold-init-types/types/v0/graphqlFetch";
export namespace Components {
    interface ManifoldConfiguredFeature {
        "label"?: string;
        "value"?: string | number | boolean;
    }
    interface ManifoldSubscriptionCreate {
        "calculatedCost"?: number;
        "configuredFeatures": FeatureMap;
        "data"?: PlanQuery;
        /**
          * (Optional) Name given to the new subscription
         */
        "displayName"?: string;
        "errors": UIError[];
        /**
          * Component heading text
         */
        "heading"?: string;
        "isEditing": boolean;
        "isLoadingPlanSelector"?: boolean;
        /**
          * (Optional) Label given to the new subscription
         */
        "label"?: string;
        "loading"?: boolean;
        /**
          * Plan ID for the new subscription
         */
        "ownerId": string;
        /**
          * Plan ID for the new subscription
         */
        "planId": string;
        "planListData"?: PlanListQuery;
        "setupIntentError"?: string;
        "setupIntentStatus"?: SetupIntent.Status;
        /**
          * Plan ID for the new subscription
         */
        "stripePublishableKey": string;
        "subscribing"?: boolean;
    }
    interface ManifoldSubscriptionDetails {
        "subscriptionId": string;
    }
    interface ManifoldSubscriptionList {
        "connection"?: Connection;
        "data"?: SubscriptionsQuery;
        "errors"?: GraphqlError[];
        /**
          * Component heading text
         */
        "heading"?: string;
        "loading"?: boolean;
        /**
          * Owner ID for subscriptions
         */
        "owner"?: string;
    }
}
declare global {
    interface HTMLManifoldConfiguredFeatureElement extends Components.ManifoldConfiguredFeature, HTMLStencilElement {
    }
    var HTMLManifoldConfiguredFeatureElement: {
        prototype: HTMLManifoldConfiguredFeatureElement;
        new (): HTMLManifoldConfiguredFeatureElement;
    };
    interface HTMLManifoldSubscriptionCreateElement extends Components.ManifoldSubscriptionCreate, HTMLStencilElement {
    }
    var HTMLManifoldSubscriptionCreateElement: {
        prototype: HTMLManifoldSubscriptionCreateElement;
        new (): HTMLManifoldSubscriptionCreateElement;
    };
    interface HTMLManifoldSubscriptionDetailsElement extends Components.ManifoldSubscriptionDetails, HTMLStencilElement {
    }
    var HTMLManifoldSubscriptionDetailsElement: {
        prototype: HTMLManifoldSubscriptionDetailsElement;
        new (): HTMLManifoldSubscriptionDetailsElement;
    };
    interface HTMLManifoldSubscriptionListElement extends Components.ManifoldSubscriptionList, HTMLStencilElement {
    }
    var HTMLManifoldSubscriptionListElement: {
        prototype: HTMLManifoldSubscriptionListElement;
        new (): HTMLManifoldSubscriptionListElement;
    };
    interface HTMLElementTagNameMap {
        "manifold-configured-feature": HTMLManifoldConfiguredFeatureElement;
        "manifold-subscription-create": HTMLManifoldSubscriptionCreateElement;
        "manifold-subscription-details": HTMLManifoldSubscriptionDetailsElement;
        "manifold-subscription-list": HTMLManifoldSubscriptionListElement;
    }
}
declare namespace LocalJSX {
    interface ManifoldConfiguredFeature {
        "label"?: string;
        "onManifold-configured-feature-change"?: (event: CustomEvent<any>) => void;
        "value"?: string | number | boolean;
    }
    interface ManifoldSubscriptionCreate {
        "calculatedCost"?: number;
        "configuredFeatures"?: FeatureMap;
        "data"?: PlanQuery;
        /**
          * (Optional) Name given to the new subscription
         */
        "displayName"?: string;
        "errors"?: UIError[];
        /**
          * Component heading text
         */
        "heading"?: string;
        "isEditing"?: boolean;
        "isLoadingPlanSelector"?: boolean;
        /**
          * (Optional) Label given to the new subscription
         */
        "label"?: string;
        "loading"?: boolean;
        "onSuccess"?: (event: CustomEvent<{
            id: string;
        }>) => void;
        /**
          * Plan ID for the new subscription
         */
        "ownerId"?: string;
        /**
          * Plan ID for the new subscription
         */
        "planId"?: string;
        "planListData"?: PlanListQuery;
        "setupIntentError"?: string;
        "setupIntentStatus"?: SetupIntent.Status;
        /**
          * Plan ID for the new subscription
         */
        "stripePublishableKey"?: string;
        "subscribing"?: boolean;
    }
    interface ManifoldSubscriptionDetails {
        "subscriptionId"?: string;
    }
    interface ManifoldSubscriptionList {
        "connection"?: Connection;
        "data"?: SubscriptionsQuery;
        "errors"?: GraphqlError[];
        /**
          * Component heading text
         */
        "heading"?: string;
        "loading"?: boolean;
        /**
          * Owner ID for subscriptions
         */
        "owner"?: string;
    }
    interface IntrinsicElements {
        "manifold-configured-feature": ManifoldConfiguredFeature;
        "manifold-subscription-create": ManifoldSubscriptionCreate;
        "manifold-subscription-details": ManifoldSubscriptionDetails;
        "manifold-subscription-list": ManifoldSubscriptionList;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "manifold-configured-feature": LocalJSX.ManifoldConfiguredFeature & JSXBase.HTMLAttributes<HTMLManifoldConfiguredFeatureElement>;
            "manifold-subscription-create": LocalJSX.ManifoldSubscriptionCreate & JSXBase.HTMLAttributes<HTMLManifoldSubscriptionCreateElement>;
            "manifold-subscription-details": LocalJSX.ManifoldSubscriptionDetails & JSXBase.HTMLAttributes<HTMLManifoldSubscriptionDetailsElement>;
            "manifold-subscription-list": LocalJSX.ManifoldSubscriptionList & JSXBase.HTMLAttributes<HTMLManifoldSubscriptionListElement>;
        }
    }
}
