module.exports = {
    devServer: {
        https: true,
        productionSourceMap: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'https://dt.waibaoke.cn/api/', // 请求本地 需要freight后端项目
                ws: true,
                changeOrigin: true
            },
        }
    },
}