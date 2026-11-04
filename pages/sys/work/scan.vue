<template>
	<view class="wrap">
		<js-lang :title="'扫码工作台 - ' + UserName" :showBtn="true"></js-lang>
		<u-form class="form">
			<u-form-item label="选择区域:" prop="signs" label-width="130">
				<view class="list-call" @click="showSelect = true">
					<!-- <u-icon class="u-icon" size="40" name="list"></u-icon> -->
					<view class="u-input">
						{{ baseUrlAll || $t('login.Please_select_a_workspace') }}
					</view>
				</view>
				<u-select v-model="showSelect" :list="baseUrlListAll" value-name="value" label-name="name"
					@confirm="onSelectConfirm">
				</u-select>
			</u-form-item>
			<u-form-item label="输入条码:" prop="signs" label-width="130">
				<u-input ref="pkgId" v-model="ItemCode" placeholder="请扫描" type="text" :focus="isFocus" clearable
					@confirm="submit" />
			</u-form-item>

		</u-form>
		<!-- 	<view class="img-box">
			<image :src="imgUrl || '/static/no-image.png'" />
		</view> -->
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="submit">确认</u-button>
			<!-- <u-button class="btn" type="default" @click="cancel">关闭</u-button> -->
		</view>
	</view>

</template>

<script type="text/javascript">
	import base64 from '@/common/base64.js';
	//import { Input, View, ref } from 'uview-ui';
	import {
		Input,
		Button
	} from 'uview-ui';
	import Vue from 'vue';
	// import $  from  'node_modules';
	//import $ from 'jquery'
	export default {
		components: {
			Input,
			Button
		},
		data() {
			return {
				showSelect: false, // 控制弹窗
				// imgUrl: '', //  商品图片
				isFocus: true, //  控制焦点
				// itemCode: '',
				// Locator: '',
				// TJLPN: '',
				// LPN: '',
				ItemCode: '',
				// Qty: '',
				// baseUrl: '',
				UserName: '',
				mobile: '',
				// intnumber: 0,
				// baseUrlList: [{
				// 	name: '调用失败！',
				// 	value: '调用失败！'
				// }, {
				// 	name: '请检查网络后再试！',
				// 	value: '请检查网络后再试！'
				// }],
				// resList: [{
				// 		TaskOrder: 'R000005042'
				// 	},
				// 	{
				// 		TaskOrder: 'R000005041'
				// 	}
				// ],
				baseUrlListAll: [],
				baseUrlAll: ''

			};
		},
		onLoad: function(option) {
			this.getWorkAreaList();
			console.log('UserName:', option.UserName);

			this.UserName = option.UserName;
			// if (option.imgUrl != null) {
			// 	this.imgUrl = option.imgUrl
			// }

			//this.imgUrl=option.imgUrl;


			//加载home传来的用户
			//console.log(this.vuex_config.baseUrl);


		},
		mounted() {
			// this.baseUrl = this.baseUrlList[0].value;
			this.refocus();
		},

		methods: {

			// getSelectedIndex() {
			// 	console.log('Selected index:');
			//                 let index = -1;
			//                 for (let i = 0; i < this.baseUrlList.length; i++) {
			//                     if (this.baseUrlList[i].value === this.baseUrl) {
			//                         index = i; // 找到对应的下标
			//                         break;
			//                     }
			//                 }
			//                 console.log('Selected index:', index); // 输出选中的下标，您可以根据实际需求修改这部分代码
			//             },

			// updateBaseUrl() {
			// 	//this.vuex_config.baseUrl = this.baseUrl;
			// 	//this.$u.vuex('vuex_config', this.vuex_config);

			// 	//baseUrl: this.baseUrl
			// 	//定义初始下标
			// 	let index = -1;
			// 	//循环去匹配所选的下标并保存
			// 	for (let i = 0; i < this.baseUrlList.length; i++) {
			// 		if (this.baseUrlList[i].value === this.baseUrl) {
			// 			index = i; // 找到对应的下标
			// 			this.intnumber = index; //存入模型
			// 			break;
			// 		}
			// 	}
			// 	console.log(index);
			// 	console.log(this.baseUrl);
			// 	this.$u.toast('切换成功！', 3000);
			// 	//记录选择的下标

			// 	//根据选中的单号调用api赋值其他文本款
			// 	const inputParas = {
			// 		InputParas: {
			// 			OrderNo: this.baseUrl,
			// 			UserName: this.UserName
			// 		}
			// 	};
			// 	//需修改api路径
			// 	this.$u.api.TaskDetail(
			// 			JSON.stringify(inputParas)
			// 		)
			// 		.then(res => {
			// 			//console.log(JSON.parse(this.params));
			// 			console.log("请求输出参数:", res); // 打印输入参数
			// 			const res_Result = res.Result;
			// 			console.log("请求输出参数2:", res_Result); // 打印输入参数

			// 			if (res_Result.Code == 0) {
			// 				//文本款开始赋值
			// 				this.Locator = res_Result.Locator;
			// 				this.TJLPN = res_Result.LPN;
			// 				this.Qty = res_Result.Qty;
			// 				this.itemCode = res_Result.itemCode;
			// 			} else {
			// 				this.$u.toast(res_Result.sMsg || '未连接服务器', 3000);
			// 			}
			// 		});
			// 	this.refocus();
			// 	//this.$refs.pkgId.focus();

			// },
			//下拉框事件
			onSelectConfirm(e) {
				const item = e[0];
				this.baseUrlAll = item.label;
				this.mobile = item.label;
				console.log('当前选择下拉框：', item);
				// ✅ 清空输入（关键）
				this.ItemCode = '';
				// ✅ 重新聚焦（关键）
				this.refocus();
				this.$u.toast(`已切换：${item.label}區`);
			},
			//下拉框绑定
			getWorkAreaList() {
				const params = {

				};

				this.$u.post('/GetRegionNO', params)
					.then(res => {
						console.log('工作区列表：', res);

						// 🔥 假设返回格式：
						// [{ regionName: 'A区', regionNo: '1' }]

						this.baseUrlListAll = res.region_no.map(item => ({
							name: item.name, // 显示
						}));

					})
					.catch(() => {
						this.$u.toast('获取工作区失败');
					});
			},
			refocus() {
				this.isFocus = false;
				this.$nextTick(() => {
					this.isFocus = true;
				});
			},
			//myfocus() { document.getElementById('myInput').focus(); },
			submit() {
				const a = this.ItemCode; // 直接用 v-model
				console.log('扫码内容：' + a);

				const inputParas = {


					OpterName: this.UserName,
					region_no: this.mobile,
					type: 1,
					barcode: a

				};

				this.$u.api.PDASkuBarcode(JSON.stringify(inputParas))
					.then(res => {
						const res_Result = res;

						this.$u.toast(res_Result.message || '未連接伺服器', 1000);

						if (res_Result.code == 1) {
							//填充图片
							// this.imgUrl = res_Result.Sku_photo || '/static/jeesite/banner/1.svg';
							// console.log("调用接口后图片地址：" + this.imgUrl)
							// ✅ 清空输入（关键）
							this.ItemCode = '';

							// ✅ 重新聚焦（关键）
							this.refocus();
							// setTimeout(() => {
							// 	uni.redirectTo({
							// 		url: `/pages/sys/work/scan?UserName=${this.UserName}&imgUrl=${this.imgUrl}`
							// 	});
							// }, 1000);
						} else {
							// ❗失败也要重新聚焦
							this.refocus();
							this.$u.toast(res_Result.message, 3000);
						}
					});
			}

		},
	};
</script>

<style lang="scss">
	.img-box {
		width: 100%;
		height: 300rpx;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #f5f5f5;
		border-radius: 10rpx;
	}

	.img-box image {
		max-width: 100%;
		max-height: 100%;
	}

	//下拉框样式
	.list-call .u-input {
		flex: 1;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 10rpx;
		color: #0000ff;
		font-size: 75rpx;
	}
</style>