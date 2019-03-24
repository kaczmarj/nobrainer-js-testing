// Predict using pre-trained TensorFlow JS models.

export function predict(
    model: string, features: Float32Array,
    shape: [number, number, number]): Uint8Array {
  // TODO: write prediction code here.
  const labels = features.map((x) => x / 2);
  return new Uint8Array(new Uint8ClampedArray(labels));
}
