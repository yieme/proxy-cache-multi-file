'use static';

var proxyCacheMultiFile = require('./')
var urls = [
	'https://cdnjs.cloudflare.com/ajax/libs/1140/2.0/1140.min.css',
	'https://cdnjs.cloudflare.com/ajax/libs/16pixels/0.1.5/16pixelsx.min.css'
]

process.on('uncaughtException', function (err) {
	console.log('uncaughtExemption:', err)
	console.log('stack:', err.stack)
})

proxyCacheMultiFile(urls, function(err, data) {
	if (err) throw err
	console.log('headers:', data.headers)
	console.log('body:',    data.body)
})
