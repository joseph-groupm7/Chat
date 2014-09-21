angular.module('admin').controller('LoginController', function($scope, LoginService){

    $scope.login = function(email, password){
        LoginService.login(email, password, function(result){
            console.log(result);
        });
    }

});