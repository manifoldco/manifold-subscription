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
  @Prop() preview?: boolean = false;

  // Can this be abstracted/optimized further?
  async componentWillLoad() {
    if (!this.preview) {
      setConnection(await getManifoldConnection(this.el));
    }
    setState('heading', this.heading);
    setState('subscriptionId', this.subscriptionId);
    setState('preview', this.preview);

    if (this.isEditing) {
      editSubscription();
    } else {
      setIsEditing(false);
    }
    loadSubscription();
  }

  render() {
    return <SubscriptionDetails />;
  }
}
