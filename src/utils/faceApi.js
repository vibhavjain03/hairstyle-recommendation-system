import * as faceapi from '@vladmandic/face-api';

export const loadModels = async () => {
  // Initialize the TensorFlow backend before loading models
  await faceapi.tf.setBackend('webgl');
  await faceapi.tf.ready();

  const MODEL_URL = `${window.location.origin}/models`;
  
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
  ]);
};

export const detectFaceAndLandmarks = async (imageElement) => {
  // We use TinyFaceDetector for fast, browser-friendly detection
  const detection = await faceapi
    .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks();
    
  return detection;
};
