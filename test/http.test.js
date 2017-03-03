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

            it(method, async () => {
                let args = { test: 'weex-http' }
                let res = await weexHttp[httpMethod]('/' + httpMethod, args)
                let data = JSON.parse(res.data)

                let resData = data.args

                if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                    resData = data.form
                }

                assert.equal(args.test, resData.test)
            })


            it(method + ' Array', async () => {
                let args = { test: ['weex-http', 'weex', 'vue'] }
                let res = await weexHttp[httpMethod]('/' + httpMethod, args)
                let data = JSON.parse(res.data)

                let resData = data.args

                if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                    resData = data.form
                }

                assert.equal(args.test[2], resData['test[]'][2])
            })

            it(method + ' Object', async () => {
                let args = { 
                    test: {
                        obj: ['weex-http', 'weex', 'vue'] 
                    }
                }
                let res = await weexHttp[httpMethod]('/' + httpMethod, args)
                let data = JSON.parse(res.data)

                let resData = data.args

                if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                    resData = data.form
                }
                assert.equal(args.test.obj[2], resData['test[obj][]'][2])
                
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

            it(method, async () => {
                let args = { test: 'weex-http' }
                let res = await http[httpMethod](httpMethod, args)
                let data = JSON.parse(res.data)

                let resData = data.args

                if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                    resData = data.form
                }

                assert.equal(args.test, resData.test)
            })


            it(method + ' Array', async () => {
                let args = { test: ['weex-http', 'weex', 'vue'] }
                let res = await http[httpMethod](httpMethod, args)
                let data = JSON.parse(res.data)

                let resData = data.args

                if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                    resData = data.form
                }

                assert.equal(args.test[2], resData['test[]'][2])
            })

            it(method + ' Object', async () => {
                let args = { 
                    test: {
                        obj: ['weex-http', 'weex', 'vue'] 
                    }
                }
                let res = await http[httpMethod](httpMethod, args)
                let data = JSON.parse(res.data)

                let resData = data.args

                if(['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                    resData = data.form
                }
                assert.equal(args.test.obj[2], resData['test[obj][]'][2])
                
            })
        })
    })
})