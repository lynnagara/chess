require.config({
  baseUrl: '/chess/vanillajs/',
  paths: {
    'mocha'         : 'node_modules/mocha/mocha',
    'chai'          : 'node_modules/chai/chai'
  },
  urlArgs: 'bust=' + (new Date()).getTime()
});
 
define(function(require) {
  var chai = require('chai');
  var mocha = require('mocha');
 
  mocha.setup('bdd');
 
  require([
    'specs/model-tests.js',
  ], function(require) {
    mocha.run();
  });
 
});