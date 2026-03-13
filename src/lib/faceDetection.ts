import * as faceapi from "face-api.js";

let modelsLoaded = false;

export async function loadModels(): Promise<void> {
  if (modelsLoaded) return;
  const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model";
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

export async function detectFace(
  imageElement: HTMLImageElement
): Promise<Float32Array | null> {
  const detection = await faceapi
    .detectSingleFace(imageElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor ?? null;
}

export function compareFaces(
  descriptor1: number[] | Float32Array,
  descriptor2: number[] | Float32Array
): number {
  const a = Array.from(descriptor1);
  const b = Array.from(descriptor2);
  const distance = faceapi.euclideanDistance(a, b);
  return distance;
}

export function distanceToSimilarity(distance: number): number {
  // Typically distance < 0.6 is same person
  return Math.max(0, Math.min(100, (1 - distance) * 100));
}
