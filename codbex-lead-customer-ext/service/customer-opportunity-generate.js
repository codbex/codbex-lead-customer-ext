const viewData = {
    id: 'opportunity-generate',
    label: 'Generate Opportunity',
    link: '/services/web/codbex-lead-customer-ext/gen/customer-opportunity-generate/forms/customer-opportunity-generate/index.html',
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