# manifold-subscription-create



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute             | Description                                    | Type                                                                                                                                                                                                                                         | Default     |
| -------------------- | --------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `configuredFeatures` | --                    |                                                | `undefined \| { label: string; value: string; }[]`                                                                                                                                                                                           | `undefined` |
| `connection`         | --                    |                                                | `Connection \| undefined`                                                                                                                                                                                                                    | `undefined` |
| `data`               | --                    |                                                | `undefined \| { __typename?: "Query" \| undefined; } & { plan: { __typename?: "Plan" \| undefined; } & Pick<Plan, "displayName" \| "cost">; profile: { __typename?: "Profile" \| undefined; } & Pick<Profile, "stripeSetupIntentSecret">; }` | `undefined` |
| `displayName`        | `display-name`        | (Optional) Name given to the new subscription  | `string \| undefined`                                                                                                                                                                                                                        | `undefined` |
| `errors`             | --                    |                                                | `GraphqlError[] \| undefined`                                                                                                                                                                                                                | `undefined` |
| `heading`            | `heading`             | Component heading text                         | `string \| undefined`                                                                                                                                                                                                                        | `undefined` |
| `label`              | `label`               | (Optional) Label given to the new subscription | `string \| undefined`                                                                                                                                                                                                                        | `undefined` |
| `loading`            | `loading`             |                                                | `boolean \| undefined`                                                                                                                                                                                                                       | `false`     |
| `planId`             | `plan-id`             | Plan ID for the new subscription               | `string \| undefined`                                                                                                                                                                                                                        | `undefined` |
| `setupIntentError`   | `setup-intent-error`  |                                                | `string \| undefined`                                                                                                                                                                                                                        | `undefined` |
| `setupIntentStatus`  | `setup-intent-status` |                                                | `"canceled" \| "processing" \| "requires_action" \| "requires_confirmation" \| "requires_payment_method" \| "succeeded" \| undefined`                                                                                                        | `undefined` |
| `subscribing`        | `subscribing`         |                                                | `boolean \| undefined`                                                                                                                                                                                                                       | `false`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
