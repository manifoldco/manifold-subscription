import { Component, Element, Prop, h } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';

@Component({
  tag: 'manifold-subscription-create',
  styleUrl: 'manifold-subscription-create.css',
  shadow: true,
})
export class ManifoldSubscriptionCreate {
  @Element() el: HTMLElement;
  /**
   * Plan ID for the new subscription
   */
  @Prop() planId: string;

  connection: Connection;

  async componentWillLoad() {
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;
    this.connection = await core.initialize({
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      version: 0,
    });
  }

  render() {
    return (
      <div>
        <pre>
          <strong>Component:</strong> manifold-subscription-create
          <br />
          <br />
          <strong>Attributes:</strong>
          <dl>
            <dt>plan-id</dt>
            <dd>{this.planId}</dd>
          </dl>
        </pre>
      </div>
    );
  }
}
