/*
*                                                       Fast Easy Compressing Plugin
* 
*  I had myself issues with '@fastify/compress' at my API endpoint route. Even tho my treshold matched it didn't compress the data.
*  So thats why I have made this easy but powerful solution. It could be usefull for others to. Thats why I shared it.
*  
*  Not intended for streams or server-side rendering with a view engine, just RAW sh!t...
*
*   Author: Z3NTL3
*   License: GNU
*
*/

const path = require('node:path')
const brotli = require(
    path.join(__dirname,'algos','brotli.js')
)
const gzip = require(
    path.join(__dirname,'algos','gzip.js')
)
const fp = require('fastify-plugin')

function compresser(fastify,_options,done){
    fastify.decorate('fastRESTcomp',  async (header,data) => {
        const brEncoding = new RegExp('br')
        const gzipEncoding = new RegExp('gzip')

        if(brEncoding.test(header)){
            data = await brotli(data)   
        } else if(gzipEncoding.test(header)){
           data = await gzip(data)
        } else {
            return { encoding: null, data: data}
        }

        let success = true
        if(data instanceof Error){
            success = false
        }
        return { encoding: brEncoding.test(header) ? 'br' : 'gzip', data: data, success: success}

    })
    done()
}

module.exports = fp(compresser, {
  fastify: '^4.x',
  name: 'fast-easy-compressor',
  decorators: {
    fastify: ['fastRESTcomp'],
  }
})