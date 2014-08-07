module.exports = [
    //static file serving
    {path: "/public/{path*}", method: "GET", handler: {directory: {path: "./public", listing: false, index: false}}},
    {path: "/bower_components/{path*}", method: "GET", handler: {directory: {path: "./bower_components", listing: false, index: false}}},

    //application routing
    {method: 'GET', path: '/test', handler: function(request, reply){reply.file('./templates/test.html');}},
    {method: 'GET', path: '/client', handler: function(request, reply){reply.file('./templates/client.html');}},
    {method: 'GET', path: '/admin', handler: function(request, reply){reply.file('./templates/admin.html');}}
];