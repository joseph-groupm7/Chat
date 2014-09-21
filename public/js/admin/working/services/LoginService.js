angular.module('admin').service('LoginService', function($http){

    this.login = function(email, password, callback){
        $http.post('/chat/admin/login', {email: email, password: password})
            .success(function(response){
                callback(response);
            });
    }

});