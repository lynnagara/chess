require.config({
  baseUrl: '/chessjs/',
  paths: {
    // 'jquery'        : '/app/libs/jquery',
    'mocha'         : 'node_modules/mocha/mocha',
    'chai'          : 'node_modules/chai/chai'
    // 'chai-jquery'   : 'libs/chai-jquery',
    // 'models'        : '/app/models'
  },
  // shim: {
  //   'chai-jquery': ['jquery', 'chai']
  // },
  urlArgs: 'bust=' + (new Date()).getTime()
});
 
define(function(require) {
  var chai = require('chai');
  var mocha = require('mocha');
  console.log(chai)
  console.log(mocha)
  // require('jquery');
  // require('chai-jquery');
 
  // Chai
  var should = chai.should();
  // chai.use(chaiJquery);
 
  mocha.setup('bdd');
 
  require([
    'specs/model-tests.js',
  ], function(require) {
    mocha.run();
  });
 
});