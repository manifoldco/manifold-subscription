import { Component, h, Prop, Element } from '@stencil/core';
import { setConnection, setIsEditing, loadSubscription, setState } from './data/actions';
import getManifoldConnection from '../../utils/getManifoldConnection';
import { SubscriptionDetails } from './components/SubscriptionDetails';
import store from './data/store';

@Component({
  tag: 'manifold-subscription-details-2',
})
export class ManifoldSubscriptionDetails2 {
  @Element() el: HTMLElement;
  @Prop() subscriptionId: string;
  @Prop() heading?: string;
  @Prop() isEditing?: boolean = false;

  async componentWillLoad() {
    setConnection(await getManifoldConnection(this.el));
    setState('heading', this.heading);
    setState('subscriptionId', this.subscriptionId);
    setIsEditing(this.isEditing || false);
    loadSubscription(this.subscriptionId);
  }

  render() {
    return [<SubscriptionDetails />, <pre>{JSON.stringify(store.state, null, 2)}</pre>];
  }
}
