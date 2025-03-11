const app = angular.module('generateOpportunity', ['ideUI', 'ideView']);
app.controller('generateOpportunityController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    const leadDataUrl = "/services/ts//codbex-lead-customer-ext/generate/CustomerAndOpportunity/api/GenerateCustomerOpportunityService.ts/leadData/" + params.id;
    const opportunityUrl = "/services/ts//codbex-lead-customer-ext/generate/CustomerAndOpportunity/api/GenerateCustomerOpportunityService.ts/opportunityFromLead";

    $http.get(leadDataUrl)
        .then(response => {
            $scope.LeadData = response.data;

            console.log("Response Data: ", response.data);
        })
        .catch(function (error) {
            console.error("Error retrieving lead data:", error);
        });

    $scope.generateOpportunity = () => {
        $http.post(opportunityUrl, $scope.LeadData)
            .then(response => {
                $scope.Opportunity = response.data;

                console.log("Opportunity created successfully:", $scope.Opportunity);
            })
            .catch(error => {
                console.error("Error creating Opportunity:", error);
                $scope.closeDialog();
            });

        $scope.closeDialog();
    };

    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("opportunity-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);