#!/usr/bin/env bash
#
# 1. Update all submodules.
# 2. Publish local tfjs-core.
# 3. Link local tfjs-core to tfjs-layers, and publish local tfjs-layers.
# 4. Link local tfjs-core and tfjs-layers to tfjs-converter, and publish local
#    tfjs-converter.
# 5. Link local tfjs-core, tfjs-layers, and tfjs-converter to tfjs, and publish
#    local tfjs (takes the longest).
# 6. Yalc add nifti-ts.

set -e

git submodule update --init --recursive --remote

echo "++++++++++++++++++++++++++++++++"
echo "++ Publishing local tfjs-core ++"
echo "++++++++++++++++++++++++++++++++"
cd tfjs-core
yarn
yarn publish-local

echo "++++++++++++++++++++++++++++++++++"
echo "++ Publishing local tfjs-layers ++"
echo "++++++++++++++++++++++++++++++++++"
cd ../tfjs-layers
yarn
yarn link-local @tensorflow/tfjs-core
yarn publish-local

echo "+++++++++++++++++++++++++++++++++++++"
echo "++ Publishing local tfjs-converter ++"
echo "+++++++++++++++++++++++++++++++++++++"
cd ../tfjs-converter
yarn
yarn link-local @tensorflow/tfjs-core @tensorflow/tfjs-layers
yarn publish-local

echo "+++++++++++++++++++++++++++"
echo "++ Publishing local tfjs ++"
echo "+++++++++++++++++++++++++++"
cd ../tfjs
yarn
yarn link-local @tensorflow/tfjs-core @tensorflow/tfjs-layers @tensorflow/tfjs-converter
yarn publish-local

echo "+++++++++++++++++++++++++++++++"
echo "++ Publishing local nifti-ts ++"
echo "+++++++++++++++++++++++++++++++"
cd ../nifti-ts
yarn
yalc push

echo "+++++++++++++++++++++++++++++++++++++++++++"
echo "++ Linking local modules to nobrainer-js ++"
echo "+++++++++++++++++++++++++++++++++++++++++++"
cd ..

yalc link \
  @tensorflow/tfjs-core \
  @tensorflow/tfjs-layers \
  @tensorflow/tfjs-converter \
  @tensorflow/tfjs \
  nifti

echo "++ Finished. ++"
