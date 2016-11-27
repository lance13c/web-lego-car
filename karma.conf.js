module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],

        files: [
            './node_modules/unirest/index.js',
            'specs/**/*.js'
        ]
    })
}