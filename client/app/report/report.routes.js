'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('report', {
      url: '/report',
      template: '<report></report>'
    });
}
