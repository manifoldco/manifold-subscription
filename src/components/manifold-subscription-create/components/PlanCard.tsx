import { h, FunctionalComponent } from '@stencil/core';
import { PlanQuery } from '../../../types/graphql';
import { $ } from '../../../utils/currency';

type PlanCardProps = PlanQuery['plan'];

const PlanCard: FunctionalComponent<PlanCardProps> = ({ displayName, cost }) => (
  <div class="ManifoldSubscriptionCreate__PlanCard">
    <div class="ManifoldSubscriptionCreate__PlanCard__Name">{displayName}</div>
    <span class="ManifoldSubscriptionCreate__PlanCard__Cost">
      {$(cost)}
      <span class="ManifoldSubscriptionCreate__PlanCard__Cost__Suffix">/mo</span>
    </span>
  </div>
);

export default PlanCard;
