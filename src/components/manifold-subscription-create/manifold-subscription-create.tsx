import { Component, Element, Prop, h, Watch } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import query from './Plan.graphql';
import { PlanQuery, PlanQueryVariables } from '../../types/graphql';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';

@Component({
  tag: 'manifold-subscription-create',
  styleUrl: 'manifold-subscription-create.css',
  shadow: true,
})
export class ManifoldSubscriptionCreate {
  @Element() el: HTMLElement;
  @Prop({ mutable: true }) connection: Connection;
  /**
   * Plan ID for the new subscription
   */
  @Prop() planId: string;

  @Prop({ mutable: true }) loading?: boolean = false;
  @Prop({ mutable: true }) errors?: GraphqlError[];

  @Prop({ mutable: true }) data?: PlanQuery;
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

  render() {
    if (this.loading) {
      return <div>Loading</div>;
    }

    return (
      <div>
        <pre>
          <strong>Component:</strong> manifold-subscription-create
          <br />
          <hr />
          <strong>Attributes:</strong>
          <dl>
            <dt>plan-id</dt>
            <dd>{this.planId}</dd>
          </dl>
          <br />
          <hr />
          <strong>Query Data:</strong>
          <br />
          {JSON.stringify(this.data?.plan, null, 2)}
          {this.errors && (
            <div>
              <hr />
              <strong>Errors:</strong>
              <br />
              <pre>{JSON.stringify(this.errors, null, 2)}</pre>
            </div>
          )}
        </pre>
      </div>
    );
  }
}
