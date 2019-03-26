// Predict using pre-trained TensorFlow JS models.

import * as tf from '@tensorflow/tfjs';

function standardScore<T extends tf.Tensor>(x: T): T {
  return tf.tidy(() => {
    const mean = tf.mean(x);
    const std = tf.sqrt(tf.mean(tf.square(tf.add(x, tf.neg(mean)))));
    return tf.div(tf.add(x, tf.neg(mean)), std);
  });
}

function toBlocks(
    x: tf.Tensor3D, blockShape: [number, number, number]): tf.Tensor4D {
  return tf.tidy(() => {
    if (x.rank !== 3) {
      throw Error(`Expected rank-3 tensor`);
    }
    const blocks = tf.floorDiv(x.shape, blockShape) as tf.Tensor3D;
    // for example, [2, 128, 2, 128, 2, 128] for 128**3 blocks in 256**3 volume.
    const interShape =
        tf.concat(
              [tf.expandDims(blocks, -1), tf.expandDims(blockShape, -1)], -1)
            .reshape([-1]) as tf.Tensor1D;
    // const interShape = [2, 128, 2, 128, 2, 128];

    const newShape: [number, number, number, number] =
        [-1, blockShape[0], blockShape[1], blockShape[2]];
    const perm = [0, 2, 4, 1, 3, 5];

    const interShapeArray = Array.from(interShape.dataSync());

    return x.reshape(interShapeArray).transpose(perm).reshape(newShape);
  });
}

function fromBlocks(
    x: tf.Tensor4D, outputShape: [number, number, number]): tf.Tensor3D {
  return tf.tidy(() => {
    if (x.rank !== 3) {
      throw Error(`Expected rank-4 tensor`);
    }
    const nBlocks = x.shape[0];
    const ncbrt = nBlocks ** (1 / 3);
    const interShape =
        [ncbrt, ncbrt, ncbrt, x.shape[1], x.shape[2], x.shape[3]];
    const perm = [0, 3, 1, 4, 2, 5];
    return x.reshape(interShape).transpose(perm).reshape(outputShape);
  });
}

function getHardClasses<T extends tf.Tensor>(x: T): T {
  return tf.tidy(() => {
    if (x.shape[-1] === 1) {  // binary
      const threshold = 0.3;
      return x.squeeze([-1]).greater(threshold).cast('int32');
    } else {  // multiclass
      return x.argMax(-1).cast('int32');
    }
  });
}

export async function predict(
    modelPath: string, features: Float32Array,
    shape: [number, number, number]): Promise<Uint8Array> {
  const featuresT = tf.tensor3d(features, shape);
  const blockShape: [number, number, number] = [128, 128, 128];
  // Take non-overlapping blocks and add grayscale channel.

  console.log(`have features of shape ${featuresT.shape}`);
  let featuresBlocks = toBlocks(featuresT, blockShape).expandDims(-1);
  console.log(`have features blocks of shape ${featuresBlocks.shape}`);
  console.log(`standard scoring features blocks`);
  featuresBlocks = standardScore(featuresBlocks);

  const originalBackend = tf.getBackend();
  console.log(`using backend ${originalBackend}`);

  console.log(`loading model async`);
  const model = await tf.loadGraphModel(modelPath);

  const now = Date();
  console.log(`prediction started at ${now}`);
  const predictions =
      model.predict(featuresBlocks, {batchSize: 1, verbose: true}) as tf.Tensor;

  const nownow = Date();
  console.log(`finished predicting at ${nownow}`);

  const labels4d = getHardClasses(predictions) as tf.Tensor4D;
  console.log(`got hard classes`);
  const labels = fromBlocks(labels4d, shape);
  console.log(`got full volume of shape ${labels.shape}`);

  console.log(`loaded data from labels`);
  const data = await labels.data();

  console.log(`returning data`);
  return new Uint8Array(data);
}
