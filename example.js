'use static';

var proxyCacheMultiFile = require('./')
var urls = [
	'https://cdnjs.cloudflare.com/ajax/libs/1140/2.0/1140.min.css',
	'https://cdnjs.cloudflare.com/ajax/libs/16pixels/0.1.5/16pixels.min.css'
]

process.on('uncaughtException', function (err) {
	console.log('uncaughtExemption:', err)
	console.log('stack:', err.stack)
})

proxyCacheMultiFile(urls, function(err, data) {
	if (err) throw err
	console.log('headers:', data.headers)
	var parts = data.body.split("\n")
	for (var i = 0; i < parts.length; i++) {
		console.log('i:', i, parts[i])
	}
})
