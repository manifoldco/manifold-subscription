function renderSubscriptionCreate() {
  const element = document.createElement('manifold-subscription-create');
  const init = document.createElement('manifold-init');

  document.body.appendChild(init);
  document.body.appendChild(element);
  return element.componentOnReady();
}

export const planSubscription = () => renderSubscriptionCreate();
