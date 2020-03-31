import { defineCustomElements as defineCore } from '@manifoldco/manifold-init/loader';
import { defineCustomElements } from './loader';

defineCore(window);
defineCustomElements(window);
window.happoRender = () => {};
