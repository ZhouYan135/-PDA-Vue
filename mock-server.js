/**
 * 本地假接口，给 PDA 前端调试用。
 * 回答 /api/PTL/LogIn、/api/PTL/GetRegionNO、/api/PTL/PDASkuBarcode、/api/PTL/GetLocatorDrugs、/api/PTL/GetDrugStock、/api/PTL/CorrectStock。
 * 启动：node mock-server.js
 */
const http = require('http');

const PORT = 8007;

const routes = {
	'/api/ptl/login': {
		code: 1,
		message: '登录成功'
	},
	'/api/ptl/getregionno': {
		region_no: [
			{ name: 'A区' },
			{ name: 'B区' }
		]
	},
	'/api/ptl/pdaskubarcode': {
		code: 1,
		message: '扫码成功',
		Sku_photo: ''
	},
	'/api/ptl/getlocatordrugs': {
		code: 1,
		message: '查询成功',
		drugs: [
			{ name: '阿莫西林胶囊' },
			{ name: '奥美拉唑肠溶片' },
			{ name: '布洛芬缓释片' },
			{ name: '氯氮地平片' },
			{ name: '二甲双胍片' },
			{ name: '对乙酰氨基酚片' },
			{ name: '硝苯地平控释片' },
			{ name: '硫酸氢氯吡格雷片' }
		]
	},
	'/api/ptl/getdrugstock': {
		code: 1,
		message: '查询成功',
		hisStock: '100盒'
	},
	'/api/ptl/correctstock': {
		code: 1,
		message: '修正成功'
	}
};

const server = http.createServer((req, res) => {
	const path = (req.url || '/').split('?')[0].replace(/\/+$/, '').toLowerCase();

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'content-type, x-requested-with, x-ajax, x-token, x-remember');

	if (req.method === 'OPTIONS') {
		res.writeHead(204);
		res.end();
		return;
	}

	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});
	req.on('end', () => {
		const payload = routes[path];
		const status = payload ? 200 : 404;
		const data = payload || { code: 0, message: '未实现的接口: ' + req.url };

		console.log(req.method, req.url, '->', status, body ? body.slice(0, 200) : '');
		res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify(data));
	});
});

server.listen(PORT, '0.0.0.0', () => {
	console.log('假接口已启动: http://127.0.0.1:' + PORT);
	console.log('  POST /api/PTL/LogIn');
	console.log('  POST /api/PTL/GetRegionNO');
	console.log('  POST /api/PTL/PDASkuBarcode');
	console.log('  POST /api/PTL/GetLocatorDrugs');
	console.log('  POST /api/PTL/GetDrugStock');
	console.log('  POST /api/PTL/CorrectStock');
});
