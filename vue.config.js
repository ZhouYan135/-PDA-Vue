/**
 * Copyright (c) 2013-Now http://jeesite.com All rights reserved.
 */
// module.exports = {
// 	dev:{
// 		assetsSubDirectory:'static',
// 		assetsPublicPath:'/',
// 		proxyTable:{
// 			'/api':{
// 				target:'http://101.42.141.13:8026'，,//后期可以changeOrigin:true,
// 				changeOrigin:true,
// 				pathRewrite:{
// 					'/PTL':'LoginAccount'
// 				}
// 			}
// 		}
// 	}
// }

// module.exports = {
// 	configureWebpack: {
// 		devServer: {
// 			port : 8080,
// 			disableHostCheck : true,
// 			proxy : {
// 				"/js" : {
// 					// target : "http://127.0.0.1:8980",
// 					target : "http://101.42.141.13:8026",
// 					changeOrigin : true,
// 					secure : false
// 				}
// 			}
// 		}
// 	},
// 	productionSourceMap: false,
// }

// module.exports = {
//   devServer: {
//     proxy: {
//       '/ptl': {
//         target: 'http://101.42.141.13',
//         changeOrigin: true,
//         pathRewrite: {
//           '^/ptl': ''
//         }
//       }
//     },
//   }
// }


// module.exports = {
//     transpileDependencies: ['uview-ui'],
//     devServer: {
// 		    proxy: {
// 		      '/api': {
// 		        target: 'https://rivtrust.jz-xxx.xyz/',
// 				changeOrigin: true,
// 		        pathRewrite: {
// 		          '^/apih5': ''
// 		        }
// 		      }
// 		    },
// 	}
// }