const getManifoldConnection = async (element: HTMLElement) => {
  await customElements.whenDefined('manifold-init');
  const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;

  const connection = await core.initialize({
    element,
    componentVersion: '<@NPM_PACKAGE_VERSION@>',
    version: 0,
  });

  return connection;
};

export default getManifoldConnection;
