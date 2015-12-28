(function () {
  'use strict';

  angular
    .module('activosFijos')
    .config(config);

  function config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }
}());
