import { h } from '@stencil/core';

import store from '../data/store';

import { Header } from './Header';
import { Edit } from './Edit/index';
import { View } from './View/index';

export const SubscriptionDetails = () => {
  const { isEditing } = store.state;
  return (
    <div class="ManifoldSubscriptionCreate__Details">
      <Header />
      {isEditing ? <Edit /> : <View />}
    </div>
  );
};
