import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';

export interface UIError extends GraphqlError {
  label: string; // helps to filter errors to display in different places.
  type: 'interface' | 'data' | 'subscription' | 'validation';
}

export const filterErrors = (
  errors: UIError[] = [],
  field: 'label' | 'type',
  values: string[],
  includes: boolean = true
): UIError[] =>
  errors.filter(error => {
    const includesValue = values.includes(error[field]);
    return includes === true ? includesValue : !includesValue;
  });

/**
 *  Predefined UI errors
 */

export const interfaceError = (label: string = 'ui'): UIError => ({
  label,
  type: 'interface',
  message: `Terminal Interface Error: Cannot load UI. Try your action again later or contact support.`,
});

export const dataError = (label: string = 'data', data: string): UIError => ({
  label,
  type: 'data',
  message: `Data Error: Cannot find ${data}. Try your action again later or contact support.`,
});

export const subscriptionError = (label: string = 'subscription'): UIError => ({
  label,
  type: 'subscription',
  message: `Subscription Error: Subscription cannot be completed. Try your action again later or contact support.`,
});

export const validationError = (label: string, message: string): UIError => ({
  label,
  type: 'validation',
  message,
});
