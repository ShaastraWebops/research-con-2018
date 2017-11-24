
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './admin.routes';

export class AdminController {
  /*@ngInject*/
  constructor($http, $stateParams, FileSaver) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.fileName = "";
    this.FileSaver = FileSaver;

    this.pos = function(b)
    {
      return b?'Academia':'Industry';
    }

    this.download = function(name) {
      this.$http.get('/api/users/showfile/'+ name,{ responseType: "arraybuffer"  }).then(response => {
        var blob = new Blob([response.data], { type: "application/pdf"});
        this.FileSaver.saveAs(blob, name);
      });
    }
  }

  $onInit()
  {
  	this.$http.get('/api/users').then(res => {
  		this.users = res.data;
  		console.log(res.data);
  		this.users.sort(function(a, b){return a.srcID > b.srcID;});
  	});
  }


}

export class FileController{
	/*@ngInject*/
	constructor($http){
		this.$http = $http;
		console.log('comes here');
	}
}


export default angular.module('researchConApp.admin', [uiRouter])
  .config(routing)
  .component('admin', {
    template: require('./admin.html'),
    controller: AdminController,
    controllerAs: 'admin'
  })

  .component('file', {
  	template: require('./file.html'),
  	controller: AdminController,
  	controllerAs: 'FileCtrl'
  })
  .name;