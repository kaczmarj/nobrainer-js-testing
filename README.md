# nobrainer

This project requires tensorflow.js code that is only available in my forks. These forks add `Conv3dTranspose` and `MaxPool3D` to tensorflow.js. The `tf.js` library must be rebuilt with the code in these forks. Please run the script `./update_tfjs.sh` to get the code and to build the `tfjs` package.

The package `nifti-ts` is also required but is not available via yarn/npm right now.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
