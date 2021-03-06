import { Component, Event, Prop, Watch, EventEmitter } from '@stencil/core';

@Component({
  tag: 'manifold-configured-feature',
})
export class ManifoldConfiguredFeature {
  @Event({ eventName: 'manifold-configured-feature-change' })
  propChange: EventEmitter;

  @Prop() label?: string;
  @Watch('label') labelChange(value?: string) {
    this.isRequired('label', value);
  }
  @Prop() value?: string | number | boolean;

  componentDidLoad() {
    this.handlePropChange();
  }
  componentWillUpdate() {
    this.handlePropChange();
  }

  handlePropChange() {
    this.propChange.emit({
      label: this.label,
      value: this.value,
    });
  }

  isRequired(name: string, value?: string | number | boolean) {
    if (!value) {
      throw new Error(`Prop ${name} on manifold-configured-feature is required`);
    }
  }
}
