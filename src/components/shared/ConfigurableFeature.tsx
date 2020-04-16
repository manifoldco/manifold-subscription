import { h, FunctionalComponent } from '@stencil/core';
import lock from '@manifoldco/mercury/icons/lock.svg';
import { $ } from '../../utils/currency';
import {
  PlanConfigurableFeatureEdge,
  PlanFeatureType,
  PlanConfigurableFeature,
} from '../../types/graphql';
import { fixedDisplayValue } from './FixedFeature';
import NumberInput from './NumberInput';
import Select, { Option } from './Select';

interface ConfigurableFeatureProps {
  configurableFeature: PlanConfigurableFeatureEdge;
  setConfiguredFeature: (label: string, value?: string | number | boolean) => void;
  value?: string | number | boolean;
  readOnly?: boolean;
  isExistingResource?: boolean;
}

const getDisplayValue = (
  value: unknown,
  { featureOptions, numericDetails }: PlanConfigurableFeature
) => {
  switch (typeof value) {
    case 'boolean':
      return fixedDisplayValue(
        featureOptions?.find(o => o.value === `${value ? 'true' : 'false'}`)?.displayName
      );
    case 'string':
      return fixedDisplayValue(featureOptions?.find(o => o.value === value)?.displayName);

    case 'number':
      return `${value} ${numericDetails?.unit || ''}`;

    default:
      return <em>No value selected.</em>;
  }
};

const ConfigurableFeature: FunctionalComponent<ConfigurableFeatureProps> = ({
  configurableFeature,
  setConfiguredFeature,
  value,
  readOnly,
  isExistingResource,
}) => {
  if (!configurableFeature) {
    return [];
  }

  const {
    node: { type, displayName, label, featureOptions, numericDetails, upgradable, downgradable },
  } = configurableFeature;

  if (readOnly) {
    return [
      <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">{displayName}</dt>,
      <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
        {getDisplayValue(value, configurableFeature.node)}
      </dd>,
    ];
  }

  if (isExistingResource && !upgradable && !downgradable) {
    return [
      <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">{displayName}</dt>,
      <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
        <span class="value" data-value={value} data-locked>
          <i innerHTML={lock} />
          {getDisplayValue(value, configurableFeature.node)}
        </span>
      </dd>,
    ];
  }

  switch (type) {
    // string
    case PlanFeatureType.String: {
      const selectOptions: Option[] = featureOptions
        ? featureOptions.map(o => ({
            label: `${o.displayName} (${$(o.cost)})`,
            value: o.value,
          }))
        : [];
      const defaultOption = value
        ? selectOptions.find(option => option.value === value)
        : undefined;

      return [
        <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">{displayName}</dt>,
        <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
          <Select
            aria-label={displayName}
            name={label}
            options={selectOptions}
            onChange={setConfiguredFeature}
            selectedValue={(defaultOption && `${defaultOption.value}`) || undefined}
          />
        </dd>,
      ];
    }

    // number
    case PlanFeatureType.Number: {
      if (!numericDetails) {
        return [];
      }

      return [
        <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">
          {displayName}
          <div class="ManifoldSubscriptionCreate__HelpText">
            {numericDetails.min.toLocaleString()} - {numericDetails.max.toLocaleString()}{' '}
            {numericDetails.unit}
          </div>
        </dt>,
        <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
          <NumberInput
            aria-label={displayName}
            increment={numericDetails.increment}
            max={isExistingResource && upgradable ? (value as number) : numericDetails.max}
            min={isExistingResource && downgradable ? (value as number) : numericDetails.min}
            name={label}
            onChange={setConfiguredFeature}
            value={typeof value === 'number' ? value : parseInt(value as string, 10)}
            disabled={readOnly}
            placeholder={numericDetails.unit}
          />
        </dd>,
      ];
    }

    // boolean
    case PlanFeatureType.Boolean:
      return [
        <dt class="ManifoldSubscriptionCreate__PlanSelector__FeatureName">{displayName}</dt>,
        <dd class="ManifoldSubscriptionCreate__PlanSelector__FeatureValue">
          <input
            class="ManifoldSubscriptionCreate__BooleanInput"
            type="checkbox"
            name={label}
            checked={typeof value === 'boolean' ? value : value === 'true'}
            onChange={e => setConfiguredFeature(label, (e.target as HTMLInputElement).checked)}
          />
        </dd>,
      ];

    default:
      return [];
  }
};

export default ConfigurableFeature;
