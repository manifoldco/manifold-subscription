import { h } from '@stencil/core';
import Message from 'components/shared/Message';
import PlanSelector from './PlanSelector';

import store, { ErrorMessage } from '../../data/store';

const filterErrors = (errors: ErrorMessage[], type: 'interface' | 'network' | 'unknown') =>
  errors.filter(error => error.type === type);

export const Edit = () => {
  const { errors } = store.state.edit;

  const interfaceErrors = filterErrors(errors, 'interface').map(error => (
    <Message type="error">{error.message}</Message>
  ));
  const networkErrors = filterErrors(errors, 'network').map(error => (
    <Message type="error">{error.message}</Message>
  ));

  return [...interfaceErrors, <PlanSelector />, networkErrors];
};
