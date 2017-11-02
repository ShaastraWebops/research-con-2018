import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http) {
    this.advisors = 'Prof. M S Sivakumar, Applied Mechanics, IIT Madras\
                      Prof. A K Mishra, Chemistry, IIT Madras\
                      Prof. R. Velmurugan, Aerospace, IIT Madras\
                      Prof. Sayan Gupta, Applied Mechanics, IIT Madras\
                      Prof. Shaikh Faruque Ali, Applied Mechanics, IIT Madras\
                      Prof. Indumathi M. Nambi, Civil Engineering, IIT Madras\
                      Prof. Lelitha Devi Vanajakshi, Civil Engineering, IIT Madras\
                      Prof. K. P. Sudheer, Civil Engineering, IIT Madras\
                      Prof. Palani Ramu, Engineering Design, IIT Madras\
                      Prof. Saravana Kumar G, Engineering Design, IIT Madras\
                      Prof. Ganapathy Krishnamurthi, Engineering Design, IIT Madras\
                      Prof Harishankar Ramachandran, Electrical Engineering, IIT Madras\
                      Prof. Boby George, Electrical Engineering, IIT Madras\
                      Prof. Mohanasankar Sivaprakasam, Electrical Engineering, IIT Madras\
                      Prof. S. Sundar, Mathematics, IIT Madras\
                      Prof. C. Balaji, Mechanical Engineering, IIT Madras\
                      Prof. K. Srinivasa Reddy, Mechanical Engineering, IIT Madras';
    this.advisors = this.advisors.split('\t');

  }

  $onInit() {
  }

}

export default angular.module('researchConApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    controllerAs: 'mainCtrl'
  })
  .name;
