import { h, FunctionalComponent } from '@stencil/core';

interface MessageProps {
  type?: 'success' | 'error';
}

const resolveClass = (type: MessageProps['type']) =>
  `ManifoldSubscription__Message ${type ? `ManifoldSubscription__Message--${type}` : ''}`;

const Message: FunctionalComponent<MessageProps> = ({ type }, children) => (
  <p class={resolveClass(type)}>{children}</p>
);

export default Message;
