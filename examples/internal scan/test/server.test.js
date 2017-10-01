//
//  Copyright (c) 2015 Red Hat, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//            http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

'use strict';

const chai = require('chai');
chai.use(require('chai-http'));
const should = chai.should();

const server = require('../server/app');

describe('App', function () {
    it('should respond to GET / with 200', function (done) {
        chai.request(server)
            .get('/')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('should respond to GET /zippy with 404', function (done) {
        chai.request(server)
            .get('/zippy')
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });
});
