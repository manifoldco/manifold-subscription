import { h, FunctionalComponent } from '@stencil/core';
import state from '../store';

interface PlanSelectorProps {
  productId: string;
}

const PlanSelector: FunctionalComponent<PlanSelectorProps> = ({ productId }) => {
  state.productId = productId;

  if (state.isLoading) {
    return 'Loading...';
  }

  return (
    <div class="ManifoldSubscriptionCreate__List__Card">
      <pre>{JSON.stringify(state.plans, null, 2)}</pre>
    </div>
  );
};

export default PlanSelector;
