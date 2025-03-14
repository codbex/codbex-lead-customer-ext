angular.module('customModule', [])
    .run(['ViewParameters', 'messageHub' function (ViewParameters, messageHub) {
        window.CustomModule = {
            getParams: function () {
                return ViewParameters.get();
            },
        };
    }]);
