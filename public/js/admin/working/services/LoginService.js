angular.module('admin').service('LoginService', function($http, $cookies){

    this.login = function(email, password){
        $http.post('/chat/admin/auth', {email: email, password: password})
            .success(function(response){
                if(!response.error){
                    $cookies.token = response;
                }else{
                    if(window.location.pathname == '/chat/admin/login')
                        alert(response.message);
                    else
                        window.location = '/chat/admin/login';
                }
            });
    }

});