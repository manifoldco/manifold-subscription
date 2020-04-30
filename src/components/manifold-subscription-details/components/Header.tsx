import { h } from '@stencil/core';
import x from '@manifoldco/mercury/icons/x.svg';

import store from '../data/store';
import { setIsEditing } from '../data/actions';

export const Header = () => {
  const { heading, isEditing } = store.state;

  return (
    <header class="ManifoldSubscription__Header">
      {heading && <h1 class="ManifoldSubscription__Heading">{heading}</h1>}
      {isEditing && (
        <button
          class="ManifoldSubscription__Button ManifoldSubscription__Button--Small"
          type="button"
          onClick={() => setIsEditing(false)}
        >
          <i innerHTML={x} />
          Cancel Modify
        </button>
      )}
    </header>
  );
};
