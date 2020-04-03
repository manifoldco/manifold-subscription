import { h, FunctionalComponent } from '@stencil/core';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  selectedValue?: string;
  onChange: (name: string, value: string) => void;
  options: Option[];
}

const Select: FunctionalComponent<SelectProps> = props => {
  const { options, selectedValue, onChange, ...rest } = props;

  return (
    <select
      class="ManifoldSubscriptionCreate__Select"
      onChange={e => onChange(rest.name, (e.target as HTMLInputElement).value)}
      {...rest}
    >
      {options.map(({ value, label }) => (
        <option value={value} selected={value === selectedValue}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default Select;
