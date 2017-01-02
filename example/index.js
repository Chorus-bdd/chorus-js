// @flow

import createCounter from './createCounter';


const rootElem: HTMLElement | null = document.querySelector('.counter');
createCounter(rootElem || document.body);
