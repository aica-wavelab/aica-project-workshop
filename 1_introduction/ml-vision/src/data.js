import '@marcellejs/core/dist/marcelle.css';
import { dataStore, dataset, datasetBrowser, mobileNet, imageDisplay,
		button
		} from '@marcellejs/core';
import { store } from './common';

import { fetchFromGithub, importDataset, base64ToImageData} from '/src/components/imageLoad.js';

// 
const repoOwner = 'teo-sanchez';
const repoName = 'teo-sanchez.github.io';



// DATA COLLECTION AND FEATURES EXTRACTION

export const trainingSet = dataset('trainingSet', store);
export const trainingSetBrowser = datasetBrowser(trainingSet);
trainingSetBrowser.title = "Training set";

export const featureExtractor = mobileNet();

export const testSet = dataset('testSet', store);
export const testSetBrowser = datasetBrowser(testSet);
testSetBrowser.title = "Test set";



// Surgical mask

const b_miniMask = button("miniMASK");
b_miniMask.title = "Mask classification";

b_miniMask.$click.subscribe(() => {
	const labelMapping = {
		"masque-bien-mis": "good",
		"masque-mal-mis": "bad",
		"pas-de-masque": "none"
	  };
	trainingSet.clear();
	let pathToImages = '/assets/demos_data/miniMASK/train';
	importDataset(
		trainingSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)

	testSet.clear();
	pathToImages = '/assets/demos_data/miniMASK/test';
	importDataset(
		testSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)
  });

// Fruits

// const b_miniFruit = button("miniFRUIT");
// b_miniFruit.title = "Fruit classification";

// b_miniFruit.$click.subscribe(() => {
// 	trainingSet.clear();
// 	let pathToImages = '/assets/demos_data/miniFRUIT/train';
// 	importDataset(
// 		trainingSet,
// 		featureExtractor,
// 		fetchFromGithub,
// 		[repoOwner, repoName, pathToImages]
// 	  )
// 	  .catch(console.error)

// 	testSet.clear();
// 	pathToImages = '/assets/demos_data/miniFRUIT/test';
// 	importDataset(
// 		testSet,
// 		featureExtractor,
// 		fetchFromGithub,
// 		[repoOwner, repoName, pathToImages]
// 	  )
// 	  .catch(console.error)
//   });

// Traffic lights

const b_miniRoad = button("miniROAD");
b_miniRoad.title = "Traffic light classification";

b_miniRoad.$click.subscribe(() => {
	const labelMapping = {
		"feu-orange": "orange",
		"feu-rouge": "red",
		"feu-vert": "green"
	  };
	trainingSet.clear();
	let pathToImages = '/assets/demos_data/miniROAD/train';
	importDataset(
		trainingSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)

	testSet.clear();
	pathToImages = '/assets/demos_data/miniROAD/test';
	importDataset(
		testSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)
  });

// Trash

const b_miniTrash = button("miniTRASH");
b_miniTrash.title = "Trash classification";

b_miniTrash.$click.subscribe(() => {
	const labelMapping = {
		"emballage": "packaging",
		"verre-blanc": "transparent glass",
		"verre-colore": "colored glass"
	  };
	trainingSet.clear();
	let pathToImages = '/assets/demos_data/miniTRASH/train';
	importDataset(
		trainingSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)

	testSet.clear();
	pathToImages = '/assets/demos_data/miniTRASH/test';
	importDataset(
		testSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)
  });

// Retina
  
const b_miniRetina = button("miniRETINA");
b_miniRetina.title = "Retina disease classification";

b_miniRetina.$click.subscribe(() => {
	const labelMapping = {
		"dmla": "macular degeneration",
		"rd": "diabetic retinopathy",
		"sain": "healthy"
	  };
	trainingSet.clear();
	let pathToImages = '/assets/demos_data/miniRETINA/train';
	importDataset(
		trainingSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)

	testSet.clear();
	pathToImages = '/assets/demos_data/miniRETINA/test';
	importDataset(
		testSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
		labelMapping
	  )
	  .catch(console.error)
  });

// Skin
  
const b_miniSkin = button("miniSKIN");
b_miniSkin.title = "Skin cancer classification";

b_miniSkin.$click.subscribe(() => {

	trainingSet.clear();
	let pathToImages = '/assets/demos_data/miniSKIN/train';
	importDataset(
		trainingSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
	  )
	  .catch(console.error)

	testSet.clear();
	pathToImages = '/assets/demos_data/miniSKIN/test';
	importDataset(
		testSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages],
	  )
	  .catch(console.error)
  });

export const $selectionStream = 
    trainingSetBrowser.$selected
        .map(array => ({ source: 'training', id: array.length > 0 ? array[array.length - 1] : undefined }))
        .map(({ _, id }) => id)
        .filter(id => id !== undefined)
        .map(id => trainingSet.get(id)).awaitPromises()
        .map((e) => e.thumbnail)
    .merge(testSetBrowser.$selected
        .map(array => ({ source: 'test', id: array.length > 0 ? array[array.length - 1] : undefined }))
        .map(({ _, id }) => id)
        .filter(id => id !== undefined)
        .map(id => testSet.get(id)).awaitPromises()
        .map((e) => e.thumbnail))
    .map((e) => base64ToImageData(e))
    .awaitPromises();

export const imageViewer = imageDisplay($selectionStream);
imageViewer.title = "Image selected";

export function setup(dash){
    dash.page("Data collection")
        .sidebar(imageViewer)
        .use([b_miniMask, b_miniRoad, b_miniTrash, b_miniRetina, b_miniSkin], [trainingSetBrowser, testSetBrowser]);
}
