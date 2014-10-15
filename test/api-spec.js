var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

var request = require('request');
var _ = require('lodash-node');

lab.experiment('api', function () {

    describe("/chat/user/auth", function () {
        it("should accept name, email and return token with name, email, type, and iat", function (done) {
            var options = {
                method: 'POST',
                url: 'http://localhost:3000/chat/user/auth',
                json: {
                    name: "logan",
                    email: "logan@loganhenson.com"
                }
            };
            request(options, function(error, response){
                var jwt = require('jsonwebtoken');
                var token = jwt.decode(response.body, process.env.secret);
                expect(token.hasOwnProperty('name')).to.equal(true);
                expect(token.hasOwnProperty('email')).to.equal(true);
                expect(token.hasOwnProperty('type')).to.equal(true);
                expect(token.hasOwnProperty('iat')).to.equal(true);
                done();
            });
        });
    });

    describe("/chat/admin/auth", function () {
        it("should accept name, email, password, and return token with name, email, type and iat, if valid", function (done) {
            var options = {
                method: 'POST',
                url: 'http://localhost:3000/chat/admin/auth',
                json: {
                    name: "logan",
                    email: "logan@loganhenson.com",
                    password: 'password'
                }
            };
            request(options, function(error, response){
                var jwt = require('jsonwebtoken');
                var token = jwt.decode(response.body, process.env.secret);
                expect(token.hasOwnProperty('name')).to.equal(true);
                expect(token.hasOwnProperty('email')).to.equal(true);
                expect(token.hasOwnProperty('type')).to.equal(true);
                expect(token.hasOwnProperty('iat')).to.equal(true);
                done();
            });
        });

        it("should return failure message if invalid password", function (done) {
            var options = {
                method: 'POST',
                url: 'http://localhost:3000/chat/admin/auth',
                json: {
                    name: "logan",
                    email: "logan@loganhenson.com",
                    password: 'invalid'
                }
            };
            request(options, function(error, response){
                expect(response.body.error).to.equal(true);
                expect(response.body.name).to.equal('InvalidCredentialsError');

                done();
            });
        });
    });

});