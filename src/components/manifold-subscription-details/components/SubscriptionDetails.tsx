import { h } from '@stencil/core';

import store from '../data/store';

import Message from '../../shared/Message';
import { Header } from './Header';
import { Edit } from './Edit/index';
import { View } from './View/index';

export const SubscriptionDetails = () => {
  const { isEditing } = store.state;

  return (
    <div class="ManifoldSubscriptionCreate__Details">
      <Header />
      {store.state.isUpdated && <Message type="success">{'Subscription updated!'}</Message>}
      {isEditing ? <Edit /> : <View />}
    </div>
  );
};
