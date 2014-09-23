module.exports = [
    //static file serving
    {path: "/public/{path*}", method: "GET", handler: {directory: {path: "./public", listing: false, index: false}}},
    {path: "/bower_components/{path*}", method: "GET", handler: {directory: {path: "./bower_components", listing: false, index: false}}}

];