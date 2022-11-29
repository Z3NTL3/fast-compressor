const zlib = require('node:zlib')

module.exports = function(data){
    return new Promise((resolve) => {
        data = Buffer.from(data)
        zlib.gzip(data,(err,res) => {
            if(err) return resolve(err)
            resolve(res)
        })
    })
}