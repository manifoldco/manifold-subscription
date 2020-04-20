(async () => {
  await customElements.whenDefined('manifold-init');

  const manifoldInitElement: HTMLManifoldInitElement = document.getElementsByTagName(
    'manifold-init'
  )[0];

  manifoldInitElement.authToken = '<@MANIFOLD_API_TOKEN@>';

  const updateTokenButton = document.getElementById('update-auth-token') as HTMLButtonElement;
  const tokenInput = document.getElementById('auth-token') as HTMLInputElement;

  if (updateTokenButton && tokenInput) {
    const token = localStorage.getItem('manifold_api_token') || '';
    tokenInput.value = token;
    manifoldInitElement.authToken = token;

    updateTokenButton.addEventListener('click', () => {
      const { value } = tokenInput;
      localStorage.setItem('manifold_api_token', value);
      manifoldInitElement.authToken = value;
    });
  }
})();
