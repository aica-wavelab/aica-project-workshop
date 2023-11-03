import '@marcellejs/core/dist/marcelle.css';
import { dashboard, dataStore } from '@marcellejs/core';

export const store = dataStore('localStorage');

export const dash = dashboard({
  title: 'Train your vision model',
  author: 'Téo Sanchez',
});

dash.settings.dataStores(store);