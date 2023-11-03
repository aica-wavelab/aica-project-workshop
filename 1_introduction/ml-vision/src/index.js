import '@marcellejs/core/dist/marcelle.css';
import { dashboard } from '@marcellejs/core';
import {setup as setupData} from './data.js';

const dash = dashboard({
	title: 'Train your image classifier',
	author: 'Téo Sanchez',
});

setupData(dash);


dash.show();