module.exports = {
    webpack: (config, options, webpack) => {
        //indica el archivo que contiene las configuraciones
        config.entry.main = './server/index.js';
        //Configuracion para la compilacion del proyecto
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                uglifyOptions: {
                    ecma: 8
                },
                mangle: false,
                output: {
                    comments: false
                },
                compress: {
                    warnings: true
                }
            })
        );

        return config
    }
}