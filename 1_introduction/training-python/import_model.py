from tensorflow import keras

# Make sure to replace './path/to/output/keras_model' with the actual path where the converted model is stored
def load_model(model_path):
    # This loads both the model architecture and the weights
    model = keras.models.load_model(model_path)
    return model

# Load the converted model (including weights)
model = load_model('./keras_model')

# Display the model architecture
print(model.summary())

# Now you can use the model for predictions, further training, evaluation, etc.
