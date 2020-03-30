import { Component, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'manifold-configured-feature',
})
export class ManifoldConfiguredFeature {
  @Prop() label?: string;
  @Watch('label') validateLabel(value?: string) {
    this.isRequired('label', value);
  }
  @Prop() value?: string;

  isRequired(name: string, value?: any) {
    if (value === undefined) {
      throw new Error(`Prop ${name} on manifold-configured-feature is required`);
    }
  }
}
