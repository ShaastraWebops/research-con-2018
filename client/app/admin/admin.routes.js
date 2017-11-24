'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/admin',
    template: '<admin></admin>',
    authenticate: 'admin'
  });

  $stateProvider.state('file', {
  	url: '/admin/:id',
  	template: '<file></file>',
  	authenticate: 'admin'
  });
}
