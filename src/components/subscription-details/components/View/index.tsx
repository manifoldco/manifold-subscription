import { h, FunctionalComponent } from '@stencil/core';
import store, { Subscription } from '../../data/store';
import { setIsEditing } from '../../data/actions';
import FixedFeature from '../../../shared/FixedFeature';
import {
  PlanFixedFeatureEdge,
  PlanMeteredFeatureEdge,
  PlanConfigurableFeatureEdge,
} from '../../../../types/graphql';
import MeteredFeature from '../../../shared/MeteredFeature';
import ConfigurableFeature from '../../../shared/ConfigurableFeature';
import CostDisplay from '../../../shared/CostDisplay';

const SubscriptionStatus: FunctionalComponent = (_, status) => (
  <h3 class="ManifoldSubscriptionCreate__SubscriptionStatus" data-status={status}>
    <div class="ManifoldSubscriptionCreate__SubscriptionStatusIndicator" />
    {status}
  </h3>
);

interface SubscriptionFeaturesProps {
  plan: Subscription['plan'];
  configuredFeatures: Subscription['configuredFeatures'];
}

const SubscriptionFeatures: FunctionalComponent<SubscriptionFeaturesProps> = props => {
  const { plan, configuredFeatures } = props;
  return (
    <dl class="ManifoldSubscriptionCreate__Details__FeatureList">
      {plan.fixedFeatures.edges.map(fixedFeature => (
        <FixedFeature fixedFeature={fixedFeature as PlanFixedFeatureEdge} />
      ))}
      {plan.meteredFeatures.edges.map(meteredFeature => (
        <MeteredFeature meteredFeature={meteredFeature as PlanMeteredFeatureEdge} />
      ))}
      {plan.configurableFeatures.edges.map(configurableFeature => (
        <ConfigurableFeature
          readOnly
          setConfiguredFeature={() => null}
          configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
          value={configuredFeatures[configurableFeature.node.label]}
        />
      ))}
    </dl>
  );
};

export const View = () => {
  const { view } = store.state;

  if (view.isLoading) {
    return <div>Loading...</div>;
  }

  if (!view.subscription) {
    throw new Error('Uhoh!');
  }

  const { plan, status, configuredFeatures } = view.subscription;

  return (
    <section class="ManifoldSubscriptionCreate__Card">
      <header class="ManifoldSubscriptionCreate__Details__Header">
        <h2 class="ManifoldSubscriptionCreate__PlanName">{plan.displayName}</h2>
        <SubscriptionStatus>{status.label}</SubscriptionStatus>
      </header>
      <SubscriptionFeatures plan={plan} configuredFeatures={configuredFeatures} />
      <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
        <div>
          <CostDisplay
            isCalculating={view.cost.isLoading}
            baseCost={view.cost.amount || plan.cost}
            meteredFeatures={plan.meteredFeatures.edges as PlanMeteredFeatureEdge[]}
          />
          <p class="ManifoldSubscriptionCreate__HelpText">Usage billed at the end of month</p>
        </div>
        <button
          type="button"
          class="ManifoldSubscription__Button"
          data-kind="black"
          onClick={() => setIsEditing(true)}
        >
          Modify Subsciption
        </button>
      </footer>
    </section>
  );
};
