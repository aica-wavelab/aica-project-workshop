import '@marcellejs/core/dist/marcelle.css';
import { dashboard,
		dataStore, dataset, datasetBrowser, mobileNet,
		button
		} from '@marcellejs/core';

import { fetchFromGithub,  fetchImageUrls, extractLabelFromUrl, loadImageData, importDataset} from '/src/components/imageLoad.js';

// 
const repoOwner = 'teo-sanchez';
const repoName = 'teo-sanchez.github.io';



// DATA COLLECTION AND FEATURES EXTRACTION


const store = dataStore('localStorage');
const trainingSet = dataset('trainingSet', store);
const trainingSetBrowser = datasetBrowser(trainingSet);

const featureExtractor = mobileNet();


const b_miniMask = button("miniMask");
b_miniMask.title = "Surgical mask wear data";



const testSet = dataset('testSet', store);
const testSetBrowser = datasetBrowser(testSet);

b_miniMask.$click.subscribe(() => {
	trainingSet.clear();
	let pathToImages = '/assets/demos_data/miniMASK/train';
	importDataset(
		trainingSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages]
	  )
	  .catch(console.error)

	testSet.clear();
	pathToImages = '/assets/demos_data/miniMASK/test';
	importDataset(
		testSet,
		featureExtractor,
		fetchFromGithub,
		[repoOwner, repoName, pathToImages]
	  )
	  .catch(console.error)
  });
  

  



// TRAINING

// EVALUATION

// DEPLOYMENT

// ALL IN ONE


const dash = dashboard({
	title: 'Train your image classifier',
	author: 'Téo Sanchez',
});


dash.page("Data collection")
	.sidebar(b_miniMask)
	.use([trainingSetBrowser, testSetBrowser]);


dash.show();