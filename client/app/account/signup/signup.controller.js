'use strict';

import angular from 'angular';

export default class SignupController {
  user = {
    name: '',
    email: '',
    password: '',
    position: 'true',
    organisation: '',
    city: '',
    state: '',
    phoneNumber: '',
  };
  errors = {};
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state, $http) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
  }

  register(form) {
    this.submitted = true;

    if(form.$valid) {
      this.$http.post('/api/users', {
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        position: this.user.position,
        organisation: this.user.organisation,
        city: this.user.city,
        state: this.user.state,
        phoneNumber: this.user.phoneNumber
      })
        .then(() => {
          // Account created, redirect to home
          this.$state.go('main');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }
}
