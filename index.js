'use strict';

const path = require('path');

const Rollup = require('broccoli-rollup');
const mergeTrees = require('broccoli-merge-trees');
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  included() {
    this._super.included.apply(this, arguments);
    this._findHost().import('vendor/mock-socket.js');
  },

  name: require('./package').name,

  treeForVendor(tree) {
    const mockSocketPath = path.dirname(require.resolve('mock-socket/src/index.js'));
    const mockSocketTree = new Rollup(this.treeGenerator(mockSocketPath), {
      rollup: {
        input: 'index.js',
        // https://github.com/rollup/rollup/issues/2271#issuecomment-455129819
        onwarn(warning) {
          const ignoredCircular = ['websocket.js'];
          if (
            warning.code === 'CIRCULAR_DEPENDENCY' &&
            ignoredCircular.some(d => warning.importer.includes(d))
          ) {
            return;
          }
          throw Error(warning.message);
        },
        output: {
          amd: {
            id: 'mock-socket'
          },
          file: 'mock-socket.js',
          format: 'amd'
        },
        plugins: [buble(), resolve({ mainFields: ['jsnext', 'main'] }), commonjs()]
      }
    });

    if (!tree) {
      return this._super.treeForVendor.call(this, mockSocketTree);
    }

    const trees = mergeTrees([mockSocketTree, tree], {
      overwrite: true
    });

    return this._super.treeForVendor.call(this, trees);
  },

  _findHost() {
    let current = this;
    let app;

    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));

    return app;
  }
};
