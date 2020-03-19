/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface ManifoldSubscriptionCreate {
        /**
          * Plan ID for the new subscription
         */
        "planId": string;
    }
}
declare global {
    interface HTMLManifoldSubscriptionCreateElement extends Components.ManifoldSubscriptionCreate, HTMLStencilElement {
    }
    var HTMLManifoldSubscriptionCreateElement: {
        prototype: HTMLManifoldSubscriptionCreateElement;
        new (): HTMLManifoldSubscriptionCreateElement;
    };
    interface HTMLElementTagNameMap {
        "manifold-subscription-create": HTMLManifoldSubscriptionCreateElement;
    }
}
declare namespace LocalJSX {
    interface ManifoldSubscriptionCreate {
        /**
          * Plan ID for the new subscription
         */
        "planId"?: string;
    }
    interface IntrinsicElements {
        "manifold-subscription-create": ManifoldSubscriptionCreate;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "manifold-subscription-create": LocalJSX.ManifoldSubscriptionCreate & JSXBase.HTMLAttributes<HTMLManifoldSubscriptionCreateElement>;
        }
    }
}
