# @manifoldco/manifold-subscription

![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

**Components**

- `manifold-subscription-create`
  - `manifold-configured-feature`

<!-- List new components here -->

## Getting Started

Place the following HTML where you’d like the component to appear (this works in any JS framework,
or even no framework!):

```html
<manifold-init client-id="[my client ID]"></manifold-init>
<manifold-subscription-create
  heading="Purchase Subscription"
  plan-id="[my plan ID]"
></manifold-subscription-create>
```

Note that the [`<manifold-init>`][manifold-init] component is required **once per page** for any
other Manifold Web Components you embed.

### Option 1: Manifold CDN

Place the following at the very beginning of the `<body>` tag:

```html
<!-- modern browsers -->
<script
  async
  type="module"
  src="https://js.cdn.manifold.co/@manifoldco/manifold-init/dist/manifold-init/manifold-init.esm.js"
></script>
<script
  async
  type="module"
  src="https://js.cdn.manifold.co/@manifoldco/manifold-subscription/dist/manifold-subscription/manifold-subscription.esm.js"
></script>

<!-- legacy browsers -->
<script
  nomodule
  src="https://js.cdn.manifold.co/@manifoldco/manifold-init/dist/manifold-init/manifold-init.js"
></script>
<script
  nomodule
  src="https://js.cdn.manifold.co/@manifoldco/manifold-subscription/dist/manifold-subscription.js"
></script>
```

Place this component’s CSS in your `<head>` tag (optional if you want to write your own styles):

```html
<link
  rel="stylesheet"
  href="https://js.cdn.manifold.co/@manifoldco/manifold-subscription/dist/manifold-subscription/manifold-subscription.css"
/>
```

### Option 2: npm

Alternately, if you build your site with npm using webpack, create-react-app, etc., run:

```bash
npm install @manifoldco/manifold-init @manifoldco/manifold-plan-table
```

And add the following code to your application, ideally to your entry file so it’s loaded as early
as possible:

```js
import('@manifoldco/manifold-init/loader').then(({ defineCustomElements }) =>
  defineCustomElements(window)
);
import('@manifoldco/manifold-subscription/loader').then(({ defineCustomElements }) =>
  defineCustomElements(window)
);
```

Also import the CSS file in a way that works for your setup (for example, webpack):

```js
import '@manifoldco/manifold-subscription/dist/manifold-subscription/manifold-subscription.css';
```

This libary is built using [Stencil][stencil]. For more information about integrating with your
site, please refer to the latest [framework docs][stencil-framework].

## `manifold-subscription-create`

### Options

Options are passed to the component in the form of HTML Attributes or children:

#### Attributes

| Name        | Required | Description                                                                    | Example                                                                     |
| :---------- | :------: | :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `plan-id`   |    Y     | Your Plan’s identifier                                                         | `<manifold-subscription-create product-id="234qkjvrptpy3thna4qttwt7m2nf6">` |
| `owner-id`  |    Y     | The owner of the subscription                                                  | `<manifold-subscription-create owner-id="[id]">`                            |
| `region-id` |          | The desired region identifier of the selected plan (defaults to global region) | `<manifold-subscription-create region-id="[region-id]">`                    |
| `heading`   |          | Heading at the top of the component                                            | `<manifold-subscription-create heading="Purchase Subscription">`            |

#### Children

##### `<manifold-configured-feature>` (Optional)

Feature selections for a confugurable plan.

```html
<manifold-subscription-create plan-id="[configurable-plan-id]">
  <manifold-configured-feature label="feature" value="feature-value">     <!-- string feature -->
  <manifold-configured-feature label="another-feature" value="10">        <!-- number feature -->
  <manifold-configured-feature label="yet-another-feature" value="true">  <!-- boolean feature -->
</manifold-subscription-create>
```

Configured Features can also be set as a property using JavaScript:

```js
const element = document.getElementByTagName('manifold-subscription-create');

element.configuredFeatures = {
  { feature: 'feature-value' },
  { 'another-feature': 10 },
  { 'yet-another-feature': true },
};
```

<!-- Add docs for new components here -->

## Using in TypeScript + JSX

This Web Component works in all frameworks & environments, but if you’re using within a React &
TypeScript setup, you’ll also need the following config.

Create a `custom-elements.d.ts` file anywhere in your project that’s within `tsconfig.json`’s
[includes][tsconfig-includes] property:

```ts
import { Components, JSX as LocalJSX } from '@manifoldco/manifold-subscription/loader';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

type StencilProps<T> = {
  [P in keyof T]?: Omit<T[P], 'ref'>;
};

type ReactProps<T> = {
  [P in keyof T]?: DetailedHTMLProps<HTMLAttributes<T[P]>, T[P]>;
};

type StencilToReact<T = LocalJSX.IntrinsicElements, U = HTMLElementTagNameMap> = StencilProps<T> &
  ReactProps<U>;

declare global {
  export namespace JSX {
    interface IntrinsicElements extends StencilToReact {}
  }
}
```

[manifold-init]: https://github.com/manifoldco/manifold-init
[stencil-framework]: https://stenciljs.com/docs/overview
[stencil]: https://stenciljs.com/docs/introduction
[tsconfig-includes]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#examples
