import { configure } from '@storybook/html';
import { defineCustomElements as defineInit } from '@manifoldco/manifold-init/loader/index.mjs';
import '../dist/manifold-subscription/manifold-subscription.css';
import './styles.css';
import { defineCustomElements as defineSubscription } from '../dist/esm-es5/loader.mjs';

// Init web components
defineInit();
defineSubscription();

// Load stories (import all files ending in *.stories.js)
const req = require.context('../stories', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
