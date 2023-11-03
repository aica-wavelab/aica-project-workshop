import '@marcellejs/core/dist/marcelle.css';
import { batchPrediction, confusionMatrix, throwError } from '@marcellejs/core';
import { store } from './common';
import { trainingSet, testSet} from './data';
import { classifierMLP } from './training';

const batchMLP = batchPrediction('mlp', store);
const confMat = confusionMatrix(batchMLP, testSet);



classifierMLP.$training.subscribe(async () => {
        if (!classifierMLP.ready) {
            throwError(new Error('No classifier has been trained'));
          }
        await batchMLP.clear();
        await batchMLP.predict(classifierMLP, testSet);
    });

export function setup(dash){
    dash.page("Testing")
        .use(confMat);
}