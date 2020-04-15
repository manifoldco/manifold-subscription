export * from './components';

const createElement = document.querySelector('manifold-subscription-create');

// eslint-disable-next-line no-unused-expressions
createElement?.addEventListener<any>('onSuccess', (e: any) => {
  console.log(e);
  alert(e.detail.id);
});
