// @flow
import createCounter from './createCounter';


const rootElem: ?HTMLElement = document.querySelector('.counter');
createCounter(rootElem);
