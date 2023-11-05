# Import necessary libraries
import pandas as pd
import requests
from io import BytesIO
from PIL import Image
from typing import Tuple, List

# Constants for GitHub repository details and image size
GITHUB_USR = 'teo-sanchez'
GITHUB_REPO = 'teo-sanchez.github.io'
DATASET_NAME = 'assets/demos_data/miniSKIN'
IMG_SIZE = (224, 224)

# Function to fetch a list of image URLs from a specific GitHub repository and directory
def fetch_from_github(dataset_type : str, repo_owner: str = GITHUB_USR, repo_name: str = GITHUB_REPO, path: str = DATASET_NAME) -> List[str]:
    # Construct the full path to the dataset on GitHub
    full_path = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{path}/{dataset_type}"
    # Send a GET request to the GitHub API
    response = requests.get(full_path)
    # Raise an HTTPError if the request was unsuccessful
    response.raise_for_status()
    # Parse the response JSON data
    data = response.json()
    # Filter and compile a list of image URLs
    image_urls = [
        item['download_url'] for item in data
        if item['type'] == 'file' and item['name'].lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))
    ]
    return image_urls

# Function to download an image from a URL and resize it to a specified size
def download_image(img_url : str , img_size : Tuple[int, int] = IMG_SIZE) -> Image:
    # Send a GET request to download the image
    response = requests.get(img_url)
    # Raise an exception if the image cannot be retrieved successfully
    if response.status_code != 200:
        raise Exception(f"Error downloading image {img_url}. Error {response.status_code}")
    else:
        # Open the image using BytesIO and convert the response content into an image
        img = Image.open(BytesIO(response.content))
        # Resize the image to the specified size
        img = img.resize(img_size)
        return img

# Function to load images and their labels into a pandas DataFrame
def load_images_and_labels(dataset_type: str, repo_owner: str = GITHUB_USR, repo_name: str = GITHUB_REPO, path: str = DATASET_NAME) -> pd.DataFrame:
    image_data = []  # Initialize an empty list to hold image data
    
    # Fetch image URLs from GitHub for the specified dataset type (e.g., 'train' or 'test')
    image_urls = fetch_from_github(dataset_type, repo_owner, repo_name, path)

    # Iterate over each image URL to download and process the image
    for img_url in image_urls:
        try:
            # Download the image and keep it as a PIL image object
            img = download_image(img_url)

            # Extract the label from the filename, assuming a specific naming convention
            filename = img_url.split('/')[-1]  # Extract the filename from the URL
            label = filename.split('_')[0]  # Assume the label is the first part of the filename

            # Append the image data to the list as a dictionary, with filename first
            image_data.append({'filename': filename, 'image': img, 'label': label})
        except Exception as e:
            # Print any errors encountered during the image downloading process
            print(f"An error occurred while downloading {img_url}: {e}")

    # Convert the list of dictionaries to a pandas DataFrame, specifying the column order
    df = pd.DataFrame(image_data, columns=['filename', 'image', 'label'])
    return df
