/**
 * Test case
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

const Vue = require('vue')
const jsdom = require('mocha-jsdom')
const assert = require('assert')
let methods = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
let weexHttp

describe('weex-http Test', () => {
    jsdom()

    before(() => {
        global.weex = require('weex-vue-render/dist')
        weexHttp = require('../dist').default
    })

    describe('Static methods', () => {

        it('Set config', () => {
            weexHttp.config = { baseURL: 'http://httpbin.org' }
        })
        
        methods.forEach((method) => {
            let httpMethod = String(method).toLocaleLowerCase()

            it(method, (done) => {
                let args = { test: 'weex-http' }
                weexHttp[httpMethod]('/' + httpMethod, args).then((res) => {
                    let data = JSON.parse(res.data)

                    let resData = data.args

                    if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                        resData = data.form
                    }

                    assert.equal(args.test, resData.test)
                    done()
                }).catch(done)
            })


            it(method + ' Array', (done) => {
                let args = { test: ['weex-http', 'weex', 'vue'] }
                weexHttp[httpMethod]('/' + httpMethod, args).then((res) => {
                    let data = JSON.parse(res.data)

                    let resData = data.args

                    if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                        resData = data.form
                    }

                    assert.equal(args.test[2], resData['test[]'][2])
                    done()
                }).catch(done)
            })

            it(method + ' Object',  (done) => {
                let args = { 
                    test: {
                        obj: ['weex-http', 'weex', 'vue'] 
                    }
                }
                weexHttp[httpMethod]('/' + httpMethod, args).then((res) => {
                    let data = JSON.parse(res.data)

                    let resData = data.args

                    if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                        resData = data.form
                    }
                    assert.equal(args.test.obj[2], resData['test[obj][]'][2])
                    done()
                }).catch(done)
            })
        })

    })

    describe('Create instance', () => {
        let http

        before(() => {
            http = weexHttp.create({
                baseURL: 'https://httpbin.org/',
                timeout: 2000
            })
        })

        methods.forEach((method) => {
            let httpMethod = String(method).toLocaleLowerCase()

            it(method, (done) => {
                let args = { test: 'weex-http' }
                http[httpMethod](httpMethod, args).then((res) => {
                    
                    let data = JSON.parse(res.data)

                    let resData = data.args

                    if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                        resData = data.form
                    }

                    assert.equal(args.test, resData.test)
                    done()
                }).catch(done)
            })


            it(method + ' Array', (done) => {
                let args = { test: ['weex-http', 'weex', 'vue'] }
                http[httpMethod](httpMethod, args).then((res) => {
                    let data = JSON.parse(res.data)

                    let resData = data.args

                    if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                        resData = data.form
                    }

                    assert.equal(args.test[2], resData['test[]'][2])
                    done()
                }).catch(done)
            })

            it(method + ' Object', (done) => {
                let args = { 
                    test: {
                        obj: ['weex-http', 'weex', 'vue'] 
                    }
                }
                http[httpMethod](httpMethod, args).then((res) => {
                    let data = JSON.parse(res.data)

                    let resData = data.args

                    if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                        resData = data.form
                    }
                    assert.equal(args.test.obj[2], resData['test[obj][]'][2])
                    done()
                }).catch(done)
            })
        })
    })
})