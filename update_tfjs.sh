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

git submodule update --init --recursive

echo "+++"
echo "+++ setting up links"
echo "+++"
cd tfjs-core
yalc publish
cd ../tfjs-layers
yalc link @tensorflow/tfjs-core
cd ../tfjs-converter
yalc link @tensorflow/tfjs-core @tensorflow/tfjs-layers
cd ../tfjs
yalc link @tensorflow/tfjs-core @tensorflow/tfjs-layers @tensorflow/tfjs-converter
cd ..

echo "++++++++++++++++++++++++++++++++"
echo "++ Publishing local tfjs-core ++"
echo "++++++++++++++++++++++++++++++++"
cd tfjs-core
yarn
yarn publish-local
yalc push

echo "++++++++++++++++++++++++++++++++++"
echo "++ Publishing local tfjs-layers ++"
echo "++++++++++++++++++++++++++++++++++"
cd ../tfjs-layers
yarn
yarn publish-local
yalc push

echo "+++++++++++++++++++++++++++++++++++++"
echo "++ Publishing local tfjs-converter ++"
echo "+++++++++++++++++++++++++++++++++++++"
cd ../tfjs-converter
yarn
yarn publish-local
yalc push

echo "+++++++++++++++++++++++++++"
echo "++ Publishing local tfjs ++"
echo "+++++++++++++++++++++++++++"
cd ../tfjs
yarn
yarn publish-local
yalc push

echo "+++++++++++++++++++++++++++++++"
echo "++ Publishing local nifti-ts ++"
echo "+++++++++++++++++++++++++++++++"
cd ../nifti-ts
yarn
yalc push

echo "++++++++++++++++++++++++++++++++"
echo "++ Updating all local modules ++"
echo "++++++++++++++++++++++++++++++++"
cd ..
yalc update

echo "++ Finished. ++"
