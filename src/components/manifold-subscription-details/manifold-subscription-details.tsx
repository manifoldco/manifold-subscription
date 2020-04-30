import { Component, h, Prop, Element } from '@stencil/core';
import {
  setConnection,
  setIsEditing,
  loadSubscription,
  setState,
  editSubscription,
} from './data/actions';
import getManifoldConnection from '../../utils/getManifoldConnection';
import { SubscriptionDetails } from './components/SubscriptionDetails';

@Component({
  tag: 'manifold-subscription-details',
})
export class ManifoldSubscriptionDetails {
  @Element() el: HTMLElement;
  @Prop() subscriptionId: string;
  @Prop() heading?: string;
  @Prop() isEditing?: boolean = false;

  // Can this be abstracted/optimized further?
  async componentWillLoad() {
    setConnection(await getManifoldConnection(this.el));
    setState('heading', this.heading);
    setState('subscriptionId', this.subscriptionId);
    if (this.isEditing) {
      editSubscription();
    } else {
      setIsEditing(false);
    }
    loadSubscription(this.subscriptionId);
  }

  render() {
    return <SubscriptionDetails />;
  }
}
