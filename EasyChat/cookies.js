module.exports = {

    parse : function(cookieString){

        var cookiesJson = {};
        var socketCookies = cookieString.split('; ');
        socketCookies.map(function (cookie) {
            var values = cookie.split('=');
            cookiesJson[values[0]] = values[1];
        });
        return cookiesJson;

    }

};



