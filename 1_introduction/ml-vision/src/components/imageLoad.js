import '@marcellejs/core/dist/marcelle.css';


export async function fetchFromGithub(repoOwner, repoName, path = '') {
    // Use the GitHub API to fetch the file list
    const full_path = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;
    const response = await fetch(full_path);
    const data = await response.json();
    const processed_data = data.filter(item => item.type === 'file' && /\.(jpg|jpeg|png|gif)$/i.test(item.name)).map(file => file.download_url);
    return processed_data;
}

// General function to fetch image URLs using a strategy
export async function fetchImageUrls(strategy, ...strategyArgs) {
    return strategy(...strategyArgs);
}

// Function to stream images and append them to the DOM
export function streamImages(imageUrls) {
    // Stream the image URLs with Most.js
    most.from(imageUrls)
        .map(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => document.body.appendChild(img);
        })
        .drain() // Initiates the stream
        .catch(error => console.error('Error streaming images:', error));
}

export function extractLabelFromUrl(url) {
    // Split the URL by '/' and get the last part to have the filename
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
  
    // Split the filename by '_' and take the first two parts as the label
    const labelParts = filename.split('_');
    // Assuming the label consists of the first two parts before the first underscore
    const label = labelParts.slice(0, 2).join('-');
  
    return label;
  }


// Helper function to load an image and extract ImageData
export function loadImageData(imageUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, image.width, image.height);
        resolve(imageData);
        };
        image.onerror = reject;
        image.src = imageUrl;
    });
    }

    export async function importDataset(
        trainingSet,
        featureExtractor,
        fetchStrategy,
        strategyArgs
      ) {
        const urls = await fetchImageUrls(fetchStrategy, ...strategyArgs);
      
        for (const url of urls) {
          try {
            const blob = await fetch(url).then(response => response.blob());
            const imageUrl = URL.createObjectURL(blob);
            const imageData = await loadImageData(imageUrl);
      
            const label = extractLabelFromUrl(url);
            const trainingData = {
              x: featureExtractor.process(imageData), // Process the image data for features
              thumbnail: imageData,
            //   large_images: imageData, // Use ImageData directly for large image
              y: label, // get the label value
            };
      
            trainingSet.create(trainingData); // Add to the training set
          } catch (error) {
            console.error(error); // Proper error handling
          }
        }
      }