import '@marcellejs/core/dist/marcelle.css';
import {button, mlpClassifier, modelParameters, trainingPlot, trainingProgress} from '@marcellejs/core';
import { store } from './common';
import { trainingSet } from './data';

const b_train = button("Train");``
b_train.title = "Train the neural network";

export const classifierMLP = mlpClassifier({ layers: [64, 64], epochs: 30 }).sync(
    store,
    'mlp',
);

classifierMLP.$training.subscribe(e => console.log(e));

const paramsMLP = modelParameters(classifierMLP);
paramsMLP.title = 'Neural network parameters';

b_train.$click.subscribe(() => {
classifierMLP.train(trainingSet);
});
  
const progBar = trainingProgress(classifierMLP);
progBar.title = "Training progress";
const learningCurve = trainingPlot(classifierMLP);
learningCurve.title = "Learning curve";


export function setup(dash){
    dash.page("Training")
        .sidebar(b_train, progBar)
        .use(paramsMLP, learningCurve);
}