import { h, FunctionalComponent } from '@stencil/core';
import plus from '@manifoldco/mercury/icons/plus.svg';
import minus from '@manifoldco/mercury/icons/minus.svg';

interface NumberInputProps {
  name: string;
  min: number;
  max: number;
  increment: number;
  value?: number;
  disabled?: boolean;
  onChange: (name: string, value: number) => void;
  placeholder?: string;
}

const NumberInput: FunctionalComponent<NumberInputProps> = props => {
  const { name, min, max, increment, value = min, disabled, onChange, ...rest } = props;

  const lowerBoundReached = value <= min;
  const upperBoundReached = value >= max;

  return (
    <div class="ManifoldSubscriptionCreate__NumberInput">
      <button
        type="button"
        tabindex="-1"
        onClick={() => onChange(name, value - increment)}
        disabled={lowerBoundReached || disabled}
      >
        <i innerHTML={minus} title="increment" />
      </button>
      <input
        name={name}
        type="number"
        max={max}
        min={min}
        pattern="[0-9]*"
        onInput={e => {
          const input = e.target as HTMLInputElement;
          onChange(name, parseInt(input.value as string, 10));
        }}
        required
        step={increment}
        value={value}
        disabled={disabled}
        {...rest}
      />
      <button
        type="button"
        tabindex="-1"
        onClick={() => onChange(name, value + increment)}
        disabled={upperBoundReached || disabled}
      >
        <i innerHTML={plus} title="increment" />
      </button>
    </div>
  );
};

export default NumberInput;
