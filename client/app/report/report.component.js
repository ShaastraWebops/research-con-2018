'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './report.routes';

export class ReportComponent {
  /*@ngInject*/
  constructor($http,$scope) {
    this.$http = $http;
    this.$scope = $scope;
    this.$scope.fileshow = false;
    this.myID = '';
    this.getfile();
  }

  getfile() {
    this.$http.get('/api/users/me').then(res => {
      this.myID = res.data.srcID;
      if(res.data.file != null){
      this.$scope.url = '/api/users/showfile/' + res.data.file;
      this.$scope.fileshow = true;
    }
    });
  }

  upload() {
       var formData = new FormData;
       var file = $('#file')[0].files[0];
       if(file.name.split('.').pop() !== "pdf")
        {
          this.error = "Only pdf files allowed";
          return;
        }
       formData.append('uploadedFile', file);
       this.$http.post('/api/users/uploadfile', formData, {

         transformRequest: angular.identity,
         headers: {
           'Content-Type': undefined
         }
       }).then(response => {
         if(response.data.success === false)
         {
           this.error = response.data.msg;
           this.success = false;
         }
         else {
           this.success = response.data.msg;
           this.error = false;
           this.getfile();
         }
         angular.element("input[name='file']").val(null);
         angular.element("input[name='file_name']").val(null);
       });
 }

  $onInit(){

  }
}

export default angular.module('researchCon2018App.report', [uiRouter])
  .config(routes)
  .component('report', {
    template: require('./report.html'),
    controller: ReportComponent,
    controllerAs: 'report'
  })
  .name;
