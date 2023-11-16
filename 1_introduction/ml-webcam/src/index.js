import '@marcellejs/core/dist/marcelle.css';
import { dashboard, 
	webcam, 
	textInput, 
	button, 
	dataset, 
	datasetBrowser, 
	mlpClassifier,
	progressBar, 
	confidencePlot, 
	trainingProgress,
	mobileNet, 
	dataStore } from '@marcellejs/core';


// DATA COLLECTION 

const imageSource = webcam();
imageSource.title = "Webcam";

const label = textInput("Label");
label.title = "Label";

const b_collect = button("Hold to collect");
b_collect.title = "Collect images with label";

const featureExtractor = mobileNet();

// DATA STORAGE

const store = dataStore('localStorage');
const trainingSet = dataset('training set', store);
const trainingSetBrowser = datasetBrowser(trainingSet);
trainingSetBrowser.title = "Training set";

   
// TRAINING

const b_train = button("Train");
b_train.title = "Train the model";


const classifier = mlpClassifier({ layers: [64, 32], epochs: 15, batch: 8 }).sync(store, 'mlp-dashboard');
b_train.$click.subscribe(() => classifier.train(trainingSet));

const progBar = trainingProgress(classifier);
progBar.title = "Training progress";

const $predictionStream = imageSource.$images
  .filter(() => classifier.ready)
  .map(async (img) => classifier.predict(await featureExtractor.process(img)))
  .awaitPromises();

const plotResults = confidencePlot($predictionStream);
plotResults.title = "Prediction confidence";

const dash = dashboard({
	title: 'AICA project course',
	author: 'Téo Sanchez'
});

dash.page('Train your first ML model')
	.sidebar(imageSource, label, b_collect)
	.use(trainingSetBrowser, [b_train, progBar], plotResults);

dash.show();
