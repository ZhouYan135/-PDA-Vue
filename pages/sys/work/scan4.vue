<template>
	<view class="wrap">
		<u-form class="form">
			
			<u-form-item label="输入条码:" prop="signs" label-width="130">
				<u-input
					ref="pkgId"
					v-model="ItemCode"
					placeholder="请扫描"
					type="text"
					:focus="isFocus"
					clearable
					@confirm="submit"
				/>
			</u-form-item>
		</u-form>
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="submit">确认</u-button>
			<!-- <u-button class="btn" type="default" @click="cancel">关闭</u-button> -->
		</view>
	</view>

</template>

<script type="text/javascript">
	import base64 from '@/common/base64.js';
	//import { Input, View, ref } from 'uview-ui';
	import { Input, Button } from 'uview-ui';
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
				isFocus: true ,// 🔥 控制焦点
				itemCode:'',
				Locator: '',
				TJLPN: '',
				LPN: '',
				ItemCode:'',
				Qty: '',
				baseUrl: '',
				UserName: '',
				intnumber:0,
				baseUrlList: [{
					name: '调用失败！',
					value: '调用失败！'
				}, {
					name: '请检查网络后再试！',
					value: '请检查网络后再试！'
				}],
				resList: [{
						TaskOrder: 'R000005042'
					},
					{
						TaskOrder: 'R000005041'
					}
				]

			};
		},
		onLoad: function(option) {
			console.log('UserName:', option.UserName);
			
				this.UserName = option.UserName;
			
			
			//加载home传来的用户
			//console.log(this.vuex_config.baseUrl);
			
					
		},
		mounted() {
			this.baseUrl = this.baseUrlList[0].value;
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
			
			updateBaseUrl() {
				//this.vuex_config.baseUrl = this.baseUrl;
				//this.$u.vuex('vuex_config', this.vuex_config);
				
					//baseUrl: this.baseUrl
					//定义初始下标
					let index = -1;
					//循环去匹配所选的下标并保存
					for (let i = 0; i < this.baseUrlList.length; i++) {
					    if (this.baseUrlList[i].value === this.baseUrl) {
					        index = i; // 找到对应的下标
							this.intnumber=index;//存入模型
					        break;
					    }
					}
				console.log(index);
				console.log(this.baseUrl);
				this.$u.toast('切换成功！',3000);
				//记录选择的下标
				
				//根据选中的单号调用api赋值其他文本款
				const inputParas = {
					InputParas: {
						OrderNo: this.baseUrl,
						UserName:this.UserName
					}
				};
				//需修改api路径
				this.$u.api.TaskDetail(
						JSON.stringify(inputParas)
					)
					.then(res => {
						//console.log(JSON.parse(this.params));
						console.log("请求输出参数:", res); // 打印输入参数
						const res_Result = res.Result;
						console.log("请求输出参数2:", res_Result); // 打印输入参数
						
						if (res_Result.Code == 0) {
							//文本款开始赋值
							this.Locator=res_Result.Locator;
							this.TJLPN= res_Result.LPN;
							this.Qty= res_Result.Qty;
							this.itemCode=res_Result.itemCode;
						}
						else {
							this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
						}
					});
					this.refocus(); 
					//this.$refs.pkgId.focus();

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
						type: 4,
						barcode: a
					
				};
			
				this.$u.api.PDASkuBarcode(JSON.stringify(inputParas))
					.then(res => {
						const res_Result = res;
			
						this.$u.toast(res_Result.message || '未連接伺服器', 1000);
			
						if (res_Result.code == 1) {
							// ✅ 清空输入（关键）
											this.ItemCode = '';
							
											// ✅ 重新聚焦（关键）
											this.refocus();
							setTimeout(() => {
								uni.redirectTo({
									url: `/pages/sys/work/scan?UserName=${this.UserName}`
								});
							}, 1000);
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

<style>
</style>