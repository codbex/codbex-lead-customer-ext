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
            CompanyName: $scope.leadData.Company,
            Email: $scope.leadData.Email,
            Phone: $scope.leadData.Phone,
            Country: $scope.leadData.Country,
            Citry: $scope.leadData.City
        }
    
        console.log("Customer body: ", customerBody);
    
        const customerContactBody = {
            Name: $scope.leadData.Name,
            Designation: $scope.leadData.Designation,
            Email: $scope.leadData.Email,
            Phone: $scope.leadData.Phone
        }
    
        console.log("Customer COntact Bodu: ", customerContactBody);
    
        let opportunityBody = {
            Amount: $scope.model.amount,
            Lead: $scope.leadData.Id,
            Owner: $scope.leadData.Owner,
            Currency: $scope.model.amount
        }
    
        console.log("Opportunity Body: ", opportunityBody);
    
        if($scope.model.type && $scope.model.type != ''){
            opportunityBody["Type"] = $scope.model.type;
        }
    
        console.log("Opportunity Body after type: ", opportunityBody);
    
        if($scope.model.priority && $scope.model.priority != ''){
            opportunityBody["Priority"] = $scope.model.priority;
        }
    
        console.log("Opportunity Body after priority: ", opportunityBody);
    
        if($scope.model.probability && $scope.model.probability != ''){
            opportunityBody["Probability"] = $scope.model.probability;
        }
    
        console.log("Opportunity Body after probability: ", opportunityBody);
    
        const requestBody = {
            CustomerBody: customerBody,
            CustomerContactBody: customerContactBody,
            OpportunityBody: opportunityBody
        }
    
        console.log("Request Body: ", requestBody);
    
        $http.post(opportunityUrl, requestBody)
            .catch(function (error) {
                console.error("Error fetching Lead data: ", error.data);
            });
    
        $scope.closeDialog();
    }
    
    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("opportunity-generate");
    };

});