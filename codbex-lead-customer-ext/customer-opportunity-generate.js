const viewData = {
    id: 'opportunity-generate',
    label: 'Generate Opportunity',
    link: '/services/web/codbex-lead-customer-ext/generate/CustomerAndOpportunity/customer-opportunity-generate.html',
    perspective: 'Lead',
    view: 'Lead',
    type: 'entity',
    order: 20
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}