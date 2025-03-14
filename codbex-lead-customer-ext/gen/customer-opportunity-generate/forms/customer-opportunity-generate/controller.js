const formView = angular.module('forms', ['ideUI', 'ideView']);

formView.controller('FormController', ['$scope', '$http', function ($scope, $http) {

    $scope.forms = {
        form: {}
    };

    $scope.model = {};
    $scope.model.amount = 0;
    $scope.model.currency = '';
    $scope.model.type = '';
    $scope.model.Priority = '';
    $scope.model.Probability = '';

    const leadDataUrl = "/services/ts/codbex-lead-customer-ext/api/GenerateCustomerOpportunityService.ts/leadData/";
    const currencyDataUrls = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts/";
    const opportunityUrl = "/services/ts/codbex-lead-customer-ext/api/GenerateCustomerOpportunityService.ts/opportunityFromLead";
    
    $http.get(leadDataUrl)
        .then(response => {
            $scope.leadData = response.data;
        })
        .catch(function (error) {
                    console.error("Error fetching Lead data: ", error);
        });
    
    $http.get(currencyDataUrls)
        .then(response => {
            $scope.currencyData = response.data;
        })
        .catch(function (error) {
                    console.error("Error fetching Currency data: ", error);
        });
    
    // $scope.closeDialog = () => {
    //     console.log("test");
    //     $scope.showDialog = false;
    //     messageHub.closeDialogWindow("opportunity-generate");
    // };

}]);