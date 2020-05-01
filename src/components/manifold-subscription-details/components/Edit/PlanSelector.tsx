import { h, FunctionalComponent } from '@stencil/core';
import FixedFeature from 'components/shared/FixedFeature';
import MeteredFeature from 'components/shared/MeteredFeature';
import ConfigurableFeature from 'components/shared/ConfigurableFeature';
import PlanCard from 'components/shared/PlanCard';
import CostDisplay from 'components/shared/CostDisplay';
import SkeletonPlanSelector from 'components/shared/SkeletonPlanSelector';
import { FeatureMap } from 'utils/plan';
import Message from 'components/shared/Message';
import {
  PlanFixedFeatureEdge,
  PlanMeteredFeatureEdge,
  PlanConfigurableFeatureEdge,
  PlanFragment,
} from '../../../../types/graphql';
import store, { Cost } from '../../data/store';
import {
  selectPlan,
  getSelectedPlan,
  updateSubscription,
  setConfiguredFeature,
} from '../../data/actions';

interface PlanMenuProps {
  plans: { node: PlanFragment }[];
  selectedPlanId?: string;
}

const PlanMenu: FunctionalComponent<PlanMenuProps> = props => {
  const { plans, selectedPlanId } = props;

  return (
    <ul class="ManifoldSubscriptionCreate__PlanSelector__Menu">
      {plans.map(({ node: plan }) => (
        <li>
          <label>
            <input
              type="radio"
              value={plan.id}
              checked={plan.id === selectedPlanId}
              onClick={() => {
                selectPlan(plan.id);
              }}
            />
            <PlanCard plan={plan} isChecked={plan.id === selectedPlanId} />
          </label>
        </li>
      ))}
    </ul>
  );
};

interface PlanDetailsProps {
  plan: PlanFragment;
  configuredFeatures: FeatureMap;
  isUpdating?: boolean;
  cost: Cost;
}

const PlanDetails: FunctionalComponent<PlanDetailsProps> = props => {
  const { plan, configuredFeatures, isUpdating, cost } = props;
  return (
    <div
      class="ManifoldSubscriptionCreate__PlanSelector__Details"
      itemscope
      itemtype="https://schema.org/IndividualProduct"
    >
      <h2 class="ManifoldSubscriptionCreate__PlanSelector__Heading" itemprop="name">
        {plan?.displayName}
      </h2>
      <dl class="ManifoldSubscriptionCreate__PlanSelector__FeatureList">
        {plan?.fixedFeatures.edges.map(fixedFeature => (
          <FixedFeature fixedFeature={fixedFeature as PlanFixedFeatureEdge} />
        ))}
        {plan?.meteredFeatures.edges.map(meteredFeature => (
          <MeteredFeature meteredFeature={meteredFeature as PlanMeteredFeatureEdge} />
        ))}
        {plan?.configurableFeatures.edges.map(configurableFeature => (
          <ConfigurableFeature
            setConfiguredFeature={setConfiguredFeature}
            configurableFeature={configurableFeature as PlanConfigurableFeatureEdge}
            value={configuredFeatures?.[configurableFeature.node.label]}
          />
        ))}
      </dl>
      <footer class="ManifoldSubscriptionCreate__PlanSelector__Footer">
        <div>
          <CostDisplay
            isCalculating={cost.isLoading}
            baseCost={cost.amount || plan.cost}
            meteredFeatures={plan.meteredFeatures.edges as PlanMeteredFeatureEdge[]}
            hasError={!!cost.hasError}
          />
          <p class="ManifoldSubscription__HelpText">Usage billed at the end of month</p>
        </div>
        <button
          class="ManifoldSubscription__Button"
          type="button"
          onClick={updateSubscription}
          disabled={isUpdating}
        >
          Update Subscription
        </button>
      </footer>
    </div>
  );
};

const PlanSelector: FunctionalComponent = () => {
  const { isUpdating, edit } = store.state;
  const { isLoading, plans, configuredFeatures, cost, selectedPlanId } = edit;
  const plan = getSelectedPlan();

  if (isLoading) {
    return <SkeletonPlanSelector />;
  }

  if (!plans || !plan || !configuredFeatures) {
    return [
      <Message type="error">Could not load plan selector.</Message>,
      <SkeletonPlanSelector />,
    ];
  }

  return (
    <div class="ManifoldSubscriptionCreate__PlanSelector">
      <PlanMenu plans={plans} selectedPlanId={selectedPlanId} />
      <PlanDetails
        plan={plan}
        configuredFeatures={configuredFeatures}
        cost={cost}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default PlanSelector;
