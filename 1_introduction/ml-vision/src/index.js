import '@marcellejs/core/dist/marcelle.css';
import {setup, setup as setupData} from './data.js';
import {setup as setupTraining} from './training.js';
import {setup as setupTesting} from './testing.js';
import {setup as setupDeploy} from './deploy.js';
import { dash } from './common';


setupData(dash);
setupTraining(dash);
setupTesting(dash);
setupDeploy(dash);



dash.show();