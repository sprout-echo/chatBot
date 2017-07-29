'use strict';
var ExtractTextPlugin = require("extract-text-webpack-plugin");  //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var webpack = require('webpack');

const path = require('path');

module.exports = {
    devtool: 'eval',
    entry: {
        app: [
             './src/entry.js' //唯一入口文件
        ]
    },
    output: {
        path: __dirname + '/build', //打包后的文件存放的地方
        filename: '[name].bundle.js', //打包后输出文件的文件名
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: /src/
            },
            {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192&name=src/images/[name].[ext]'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            }
        ]
    },
    devServer: {
        contentBase: './',  //本地服务器所加载的页面所在的目录
        host: 'localhost',
        port: 8888,
        historyApiFallback: true,  //不跳转
        inline: true,  //实时刷新
        proxy: {
            '/api': {
                target: 'https://cnodejs.org/api/v1',
                secure: false,
                changeOrigin: true,
                host: 'cnodejs.org'
            }
        }
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [
                        require('postcss-pxtorem')({
                            rootValue: 100,
                            propWhiteList: []
                        }),
                        require('autoprefixer')
                    ];
                }
            }
        })
        // ,
        // new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
        //     filename: './index.html', //生成的html存放路径，相对于 path
        //     template: './src/templates/index.html', //html模板路径
        //     hash: true,    //为静态资源生成hash值
        // })
    ],
    resolve: {
        modules: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: [ '.web.js', '.js', '.json'],
    },
};
