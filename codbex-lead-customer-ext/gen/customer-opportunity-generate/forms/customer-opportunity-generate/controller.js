const formView = angular.module('forms', ['ideUI', 'ideView']);

formView.controller('FormController', ($scope, $http, messageHub, ViewParameters) => {

    $scope.forms = {
        form: {}
    };

    $scope.model = {};
    $scope.model.amount = 0;
    $scope.model.currency = '';
    $scope.model.type = '';
    $scope.model.priority = '';
    $scope.model.probability = '';

    const params = ViewParameters.get();
    
    const leadDataUrl = "/services/ts/codbex-lead-customer-ext/api/GenerateCustomerOpportunityService.ts/leadData/" + params.id;
    const dropdownDataUrl = "/services/ts/codbex-lead-customer-ext/api/GenerateCustomerOpportunityService.ts/dropdownData";
    const opportunityUrl = "/services/ts/codbex-lead-customer-ext/api/GenerateCustomerOpportunityService.ts/opportunityFromLead";
    
    $http.get(leadDataUrl)
        .then(response => {
            $scope.leadData = response.data;
        })
        .catch(function (error) {
            console.error("Error fetching Lead data: ", error.data);
        });
    
    $http.get(dropdownDataUrl)
        .then(response => {
            $scope.dropdownData = response.data;
        })
        .catch(function (error) {
            console.error("Error fetching Dropdown data: ", error.data);
        });
    
    $scope.convertOpportunity = () => {
        const customerBody = {
            Name: $scope.leadData.Company,
            Email: $scope.leadData.Email,
            Phone: $scope.leadData.Phone,
            Country: $scope.leadData.Country,
            City: $scope.leadData.City,
            Address: ""
        }
    
        const customerContactBody = {
            Name: $scope.leadData.Name,
            Designation: $scope.leadData.Designation,
            Email: $scope.leadData.Email,
            Phone: $scope.leadData.Phone
        }
    
        let opportunityBody = {
            Amount: $scope.model.amount,
            Lead: $scope.leadData.Id,
            Owner: $scope.leadData.Owner,
            Currency: $scope.model.currency
        }
    
        if($scope.model.type && $scope.model.type != ''){
            opportunityBody["Type"] = $scope.model.type;
        }
    
        if($scope.model.priority && $scope.model.priority != ''){
            opportunityBody["Priority"] = $scope.model.priority;
        }
    
        if($scope.model.probability && $scope.model.probability != ''){
            opportunityBody["Probability"] = $scope.model.probability;
        }
    
        const requestBody = {
            CustomerBody: customerBody,
            CustomerContactBody: customerContactBody,
            OpportunityBody: opportunityBody
        }
    
        $http.post(opportunityUrl, requestBody)
            .then(response => {
                if(response.status == 201){
                    messageHub.showAlertSuccess("Lead", "Lead converted to Opportunity successfuly!");
                    $scope.closeDialog();
                }
                else{
                    console.error("Error creating opportunity: ", response.data);
                }
            })
            .catch(function (error) {
                console.error("Error creating Opportunity: ", error.data);
                $scope.closeDialog();
            });
    }
    
    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("opportunity-generate");
    };

});