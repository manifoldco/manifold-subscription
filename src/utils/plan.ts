import { $ } from './currency';
import { pluralize } from './string';
import {
  PlanMeteredFeatureNumericDetails,
  PlanFeatureType,
  PlanEdge,
  BooleanConfiguredFeature,
  NumberConfiguredFeature,
  StringConfiguredFeature,
} from '../types/graphql';

export interface PricingTier {
  cost: number;
  from: number;
  to: number;
  per: number;
  unit: string;
}

// numeric details constants
export const NUMBER_FEATURE_COIN = 10000000; // Numeric features are a ten-millionth of a cent, because floats stink

/**
 * Convert number feature costs to float cents (NOT DOLLARS)
 */
export function featureCost(number: number) {
  return number / NUMBER_FEATURE_COIN;
}

/**
 * For really, really, really cheap features that would normally display something awful like
 * “$0.000002345 / unit”, this figures out a sane number to display something like “$0.02 per 4,000 units”.
 */
export function oneCent(number: number) {
  const min = Math.ceil(NUMBER_FEATURE_COIN / number);
  // If sorta tiny round to nearest thousand
  if (min < 1000) {
    return Math.ceil(min / 1000) * 1000;
  }
  // Otherwise, round to nearest hundred
  return Math.ceil(min / 100) * 100;
}

/**
 * Calculate pricing tiers for metered features
 */
export function pricingTiers(numericDetails: PlanMeteredFeatureNumericDetails): PricingTier[] {
  // Features can be really, really (really) cheap. Let’s make things easier.
  let per = 1;
  const unit = numericDetails.unit || '';

  // if no cost tiers, return free tier
  if (!numericDetails.costTiers || !numericDetails.costTiers.length) {
    return [{ from: 0, to: Infinity, cost: 0, unit, per }];
  }

  const cheapestNonZeroCost = numericDetails.costTiers.reduce((total, tier) => {
    if (!tier.cost || tier.cost === 0) {
      return total;
    }
    return tier.cost < total ? tier.cost : total;
  }, Infinity);

  if (cheapestNonZeroCost < NUMBER_FEATURE_COIN) {
    per = oneCent(cheapestNonZeroCost);
  }

  return numericDetails.costTiers.map(({ cost, limit }, i) => {
    // Each tier starts at previous + 1 (not other way around)
    let from = 0;
    const lastTier = numericDetails.costTiers && numericDetails.costTiers[i - 1];
    if (lastTier && typeof lastTier.limit === 'number') {
      from = lastTier.limit + 1;
    }

    // Use Infinity rather than -1
    let to = typeof limit === 'number' ? limit : Infinity;
    if (to === -1) {
      to = Infinity;
    }

    // Special case: convert seconds for users
    if (unit.toLowerCase() === 'seconds') {
      const hours = 60 * 60;
      return {
        cost: (cost || 0) * hours,
        from: Math.round(from / hours),
        to: to === Infinity ? Infinity : Math.round(to / hours),
        unit: 'hour',
        per: 1,
      };
    }

    return {
      cost,
      from,
      to,
      unit,
      per,
    };
  });
}

interface MeteredDisplayCost {
  cost: string;
  per?: string;
}

/**
 * User-friendly display for a measurable number feature value
 */
export function meteredFeatureDisplayValue(
  numericDetails: PlanMeteredFeatureNumericDetails
): MeteredDisplayCost {
  const withCommas = new Intl.NumberFormat().format;
  const tiers = pricingTiers(numericDetails);

  // Flat cost
  const [{ cost, unit, per }] = tiers;

  if (cost === 0) {
    return { cost: 'Free' };
  }

  // If features are really really cheap, let’s make it more readable
  if (per > 1) {
    return { cost: $(featureCost(cost * per)), per: `per ${withCommas(per)} ${pluralize(unit)}` };
  }

  return { cost: $(featureCost(cost)), per: `/ ${unit}` };
}

export interface FeatureMap {
  [label: string]: string | number | boolean | undefined;
}

type ToFeatureMapConfiguredFeatures = {
  edges: Array<{
    node:
      | (Pick<BooleanConfiguredFeature, 'label'> & {
          booleanValue: BooleanConfiguredFeature['value'];
        })
      | (Pick<NumberConfiguredFeature, 'label'> & {
          numberValue: NumberConfiguredFeature['value'];
        })
      | (Pick<StringConfiguredFeature, 'label'> & {
          stringValue: StringConfiguredFeature['value'];
        });
  }>;
};

export const toFeatureMap = (configuredFeatures: ToFeatureMapConfiguredFeatures) => {
  const featureMap: FeatureMap = configuredFeatures.edges.reduce((result, { node }) => {
    // The only field left will be the value field. We don't care what it's called.
    const { label, ...rest } = node;
    const value = Object.values(rest)[0];

    return { ...result, [label]: value };
  }, {});

  return featureMap;
};

/**
 * Get default feature map for configurableFeatures
 */
export function configurableFeatureDefaults(plans: PlanEdge[], selectedPlanId: string) {
  const defaultFeatures: FeatureMap = {};

  const configurableFeatures = plans.find(plan => plan.node.id === selectedPlanId)?.node
    ?.configurableFeatures.edges;
  if (configurableFeatures) {
    configurableFeatures.forEach(({ node: { label, numericDetails, featureOptions, type } }) => {
      switch (type) {
        case PlanFeatureType.Boolean: {
          defaultFeatures[label] = false;
          break;
        }
        case PlanFeatureType.Number:
          defaultFeatures[label] = numericDetails?.min;
          break;
        case PlanFeatureType.String:
          defaultFeatures[label] = featureOptions?.[0].value;
          break;
        default:
          defaultFeatures[label] = undefined;
          break;
      }
    });
  }

  return defaultFeatures;
}
