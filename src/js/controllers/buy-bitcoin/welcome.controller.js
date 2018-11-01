'use strict';

(function () {

angular
  .module('bitcoincom.controllers')
  .controller('buyBitcoinWelcomeController', buyBitcoinWelcomeController);

  function buyBitcoinWelcomeController(
    gettextCatalog, 
    $ionicHistory,
    $log, 
    moonPayService,
    ongoingProcess, 
    popupService, 
    $scope
    ) {
    var vm = this;

    // Functions
    vm.getStarted = getStarted;

    function initVariables() {
      vm.email = '';
    }

    $scope.$on("$ionicView.beforeEnter", onBeforeEnter);


    function getStarted() {
      $log.debug('getStarted() with email: ' + vm.email);

      if (!vm.email) {
        var title = gettextCatalog.getString('Unable to Create Customer');
        var message = gettextCatalog.getString('Enter a valid email address.');
        popupService.showAlert(title, message);
        return;
      }

      ongoingProcess.set('creatingCustomerId', true);

      moonPayService.createCustomer(vm.email).then(
        function onCustomerCreated(customer) {
          console.log('Created customer.', customer);
          ongoingProcess.set('creatingCustomerId', false);
          $ionicHistory.goBack();
        },
        function onCustomerCreationFailed(err) {
          console.error('Error creating customer.', err);
          ongoingProcess.set('creatingCustomerId', false);
       
          var title = gettextCatalog.getString('Error Creating Customer');
          var message = err.message || '';
          popupService.showAlert(title, message);
        }
      );

    }
    

    function onBeforeEnter(event, data) {
      initVariables();
    }
  }


})();