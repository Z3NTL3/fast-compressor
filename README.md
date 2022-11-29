# Fast Compressor
### Plugin for [Fastify.js](https://fastify.io)
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/Z3NTL3/fast-compressor)

A quick and easy solution for REST APIs that serve primarily JSON type. Call the plugin easy simplicity and have compression within your API. 

Implemented compression algorithms at the moment: Brotli and Gzip. With preference being Brotli and then Gzip.

### API
``fastify.fastRESTcomp(clientEncoding_Header: req.headers['accept-encoding'] , JSON_Stringified_OBJ: String)``
###### Example:
``fastify.fastRESTcomp(req.headers['accept-encoding'], JSON.stringify({hello: "world"}, null, 4))``

### Installation
``npm i fast-compressor``
```js
// Example
...asuming you have Fastify.js server ready and some basic knowledge

// To register the plugin
// Keep in mind to register this plugin on your main (root) Fastify Instance (main Fastify app).
// For more info see https://www.fastify.io/docs/latest/Reference/Encapsulation/
app.register(require('fast-compressor'))

// A example usage on a structured route
module.exports = async function (app,opts,done){
    app.get('/graphql*',{
        schema: { querystring: app.getSchema('/query-validator') },
        attachValidation: true,
    } ,async (req,res) => {
        if (req.validationError) {
            res.code(403).compress({err:"Missing querystring 'query'", info: "Querystring 'query' should be a GraphQl query."})
        }

        const query = req.query.query
        let performTask = await app.graphql(query)

        res.header('Content-Type','application/json')
  
        let { data, encoding, success} = await app.fastRESTcomp( 
            req.headers['accept-encoding'], 
            JSON.stringify(performTask, null, 4)
        )
   
        if(encoding !== null){
            res.header('Content-Encoding', encoding)
        }

        if(success !== null){
            return res.send(
                data
            )
        }
        return res.send(
            {hey: "nothing is compressed..."} 
        )
        

    })
    done()
}
```
##### As soon as the client does not have Accept-Encoding present header with 'br' or 'gzip' then nothing is compressed.

## Features
- Brotli Compression
- Gzip Compression
- Ideal plugin for JSON REST APIs
- Backbone compability with clients  that doesn't support Brotli or Gzip

> This plugin is meant for REST APIs.
>   Me (Z3NTL3), had issues with the '@fastify/compress' plugin even tho it was registered very above and as first on the root fastify context instance on my route it didn't compress my JSON responds to the client. Even when the treshold for compression was the same. Maybe some kind of bug but I got it fixed by writing this Plugin. So I use '@fastify/compress' module for SSR compresssion together with my own module for RAW data compression.

### License
- GNU ([READ](https://www.gnu.org/licenses/gpl-3.0.md))