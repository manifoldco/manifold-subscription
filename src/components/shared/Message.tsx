import { h, FunctionalComponent } from '@stencil/core';
import errorIcon from '@manifoldco/mercury/icons/alert-circle.svg';
import successIcon from '@manifoldco/mercury/icons/check.svg';

interface MessageProps {
  type?: 'success' | 'error';
}

const icons = {
  error: errorIcon,
  success: successIcon,
};

const resolveClass = (type: MessageProps['type']) =>
  `ManifoldSubscriptionCreate__Message ${
    type ? `ManifoldSubscriptionCreate__Message--${type}` : ''
  }`;

const Message: FunctionalComponent<MessageProps> = ({ type }, children) => (
  <p class={resolveClass(type)}>
    {type && <i innerHTML={icons[type]} />}
    {children}
  </p>
);

export default Message;
