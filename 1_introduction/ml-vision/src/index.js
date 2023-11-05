import '@marcellejs/core/dist/marcelle.css';
import {setup as setupData} from './data.js';
import {setup as setupTraining} from './training.js';
import {setup as setupTesting} from './testing.js';
import {setup as setupDeploy} from './deploy.js';
import { dash , store } from './common';
import { trainingSet } from './data';
import { classifierMLP } from './training';

setupData(dash);
setupTraining(dash);
setupTesting(dash);
setupDeploy(dash);

dash.settings.dataStores(store).datasets(trainingSet).models(classifierMLP);

dash.show();
