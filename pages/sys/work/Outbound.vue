<template>
	<view class="wrap">
		<u-form class="form">
			<u-form-item label="出库单号:" prop="signs" label-width="180">
				<view class="list-call base-url">
					<!-- <u-icon class="u-icon" size="40" name="setting" style="padding-right:15rpx;"></u-icon> -->
					<js-select v-model="baseUrl" :items="baseUrlList" placeholder="选择出库单号" @confirm="updateBaseUrl" @change="getSelectedIndex">

					</js-select>
				</view>
			</u-form-item>
			
			<view class="form-footer">
				<u-button class="btn" type="primary" @click="submit2">跳过此托盘号</u-button>
			</view>
			<u-form-item label="库位"  prop="signs" label-width="130">
				<input fixed="true" :disabled="true" value="" v-model="Locator" type="text" placeholder="自动识别" height="35" />
			</u-form-item>

			<u-form-item label="未完成数量:" prop="signs" label-width="170">
				<input fixed="true" :disabled="true" value="" v-model="Qty" type="text" placeholder="自动识别" height="35" />
			</u-form-item>
			<u-form-item label="SKU:" prop="signs" label-width="130">
				<input fixed="true" :disabled="true" value="" v-model="itemCode" type="text" placeholder="自动识别" height="35" />
			</u-form-item>
			<u-form-item label="数量:" prop="signs" label-width="130">
				<input fixed="true" :disabled="false" value="" v-model="ActualQty" type="text" placeholder="请输入数量" height="35" />
			</u-form-item>
			<u-form-item label="荐托盘号:"  prop="signs" label-width="130">
				<input fixed="true" :disabled="true" value="" v-model="TJLPN" type="text" placeholder="自动识别" height="35" />
			</u-form-item>
			<u-form-item label="实托盘号:" prop="signs" label-width="130">
				<Input id="myInput" class="u-input" v-model="LPN" focus="true" ref="pkgId"  fixed="true" value=""  type="text"  placeholder="请扫描托盘号" height="35" />
				<!-- <input  class="u-input" focus="true" ref="pkgId"  fixed="true" value=""  v-model="LPN" type="text"   height="35" /> -->
			</u-form-item>
		</u-form>
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="submit">确定</u-button>
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
				itemCode:'',
				Locator: '',
				ActualQty:'',
				RequestQty:'',
				TJLPN: '',
				LPN: '',
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
			this.UserName = option.UserName;
			console.log("接收到页面UserName：",this.UserName);
			if(option.intnumber!=null){
				this.intnumber=option.intnumber;
				console.log("接收到页面intnumber：",this.intnumber);
			}
			
			//调用api加载下拉框
			this.$u.api.TaskList()
				.then(res => {
					//JSON格式化
					console.log("请求输出参数:", res); // 打印输入参数
					const res_Result = res.Result;
					console.log("请求输出参数2:", res_Result); // 打印输入参数
					console.log("请求输出参数3:", res_Result.TaskOrderList); // 打印输入参数
					if (res_Result.Code == 0) {
						//循环绑定数据源
						const baseUrlListbase = res_Result.TaskOrderList.map(item => ({
							name: item.TaskOrder,
							value: item.TaskOrder
						}));
						this.baseUrlList = baseUrlListbase;
						console.log(this.intnumber);
						//选择第一个
						this.baseUrl = this.baseUrlList[this.intnumber].value;
						//触发接口
						this.updateBaseUrl();
						
						console.log(this.baseUrlList);

					} else {
						this.$u.toast(res_Result.sMsg || '获取出库单号失败！',2000);
					}

				});
			//加载home传来的用户
			//console.log(this.vuex_config.baseUrl);
			
					
		},
		mounted() {
			this.baseUrl = this.baseUrlList[0].value;
			var input = document.getElementById('myInput');
			var self = this; // 创建一个指向当前对象的引用
			input.addEventListener('keydown', function(event) {
			    if (event.key === 'Enter') {
			        console.log('在输入框中按下Enter键');
			        // 在这里执行你想要的操作
					self.submit();
			    }
			});
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
			focusInput() {
			  this.$refs.pkgId.focus();
			},
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
							this.ActualQty=res_Result.ActualQty;
							this.RequestQty=res_Result.ActualQty;
						}
						else {
							this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
						}
					});
					this.$refs.pkgId.focus();

			},
			  //myfocus() { document.getElementById('myInput').focus(); },
			submit() {
				const value = parseInt(this.ActualQty);
				const maxQty = parseInt(this.RequestQty);
				console.log('当前数量:'+value+'最大数量:'+maxQty);
				        // 验证数量是否为整数，且不超过未完成数量
				        if (isNaN(value) || value < 0) {
				            this.$u.toast('请输入有效的数量！', 2000);
				            return;
				        } else if (value > maxQty) {
				            this.$u.toast(`数量不能大于指标数量：${maxQty}`, 2000);
				            return;
				        }
				var a=document.getElementById('myInput').value;
				console.log('出库实际托盘号：'+a);
				const inputParas = {
					InputParas: {
						OrderNo: this.baseUrl,
						UserName: this.UserName,
						LPN: a,
						Locator: this.Locator,
						Qty: this.Qty,
						ActualQty:this.ActualQty,
						JumpOver:false
					}
				};
				//需修改api路径
				this.$u.api.UploadTaskDetail(
						JSON.stringify(inputParas)
					)
					.then(res => {
						//console.log(JSON.parse(this.params));
						console.log("请求输出参数:", res); // 打印输入参数
						const res_Result = res.Result;
						console.log("请求输出参数2:", res_Result); // 打印输入参数
						// this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
						// if (res_Result.Code == 0) {
							//跳转页面并传递托盘号
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/sys/work/index?UserName=' + this.UserName +'&LPN=' + a + '&intnumber='+this.intnumber+''
								});
								// uni.navigateBack({
								// 	delta:0
								// })
							}, 500);
						// } else {
						// 	this.$u.toast(res_Result.sMsg,3000);

						// }
					});
			},
			submit2(){
				
				const inputParas = {
					InputParas: {
						OrderNo: this.baseUrl,
						UserName: this.UserName,
						LPN: this.TJLPN,
						Locator: this.Locator,
						Qty: this.Qty,
						JumpOver:true
					}
				};
				//需修改api路径
				this.$u.api.UploadTaskDetail(
						JSON.stringify(inputParas)
					)
					.then(res => {
						//console.log(JSON.parse(this.params));
						console.log("请求输出参数:", res); // 打印输入参数
						const res_Result = res.Result;
						console.log("请求输出参数2:", res_Result); // 打印输入参数
						this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
						 if (res_Result.Code == 0) {
							//跳转页面并传递托盘号
							// setTimeout(() => {
							// 	uni.reLaunch({
							// 		url: '/pages/sys/work/Outbound?UserName=' + this.UserName +
							// 			'&LPN=' + this.LPN + ''
									
							// 	});
							// }, 500);
							//调用api加载下拉框
							this.$u.api.TaskList()
								.then(res => {
									//JSON格式化
									console.log("请求输出参数:", res); // 打印输入参数
									const res_Result = res.Result;
									console.log("请求输出参数2:", res_Result); // 打印输入参数
									console.log("请求输出参数3:", res_Result.TaskOrderList); // 打印输入参数
									if (res_Result.Code == 0) {
										//循环绑定数据源
										const baseUrlListbase = res_Result.TaskOrderList.map(item => ({
											name: item.TaskOrder,
											value: item.TaskOrder
										}));
										this.baseUrlList = baseUrlListbase;
										//选择第一个
										this.baseUrl = this.baseUrlList[this.intnumber].value;
										//触发接口
													this.updateBaseUrl();
										
										console.log(this.baseUrlList);
							
									} else {
										this.$u.toast(res_Result.sMsg || '获取出库单号失败！',2000);
									}
							
								});
							//加载home传来的用户
							//console.log(this.vuex_config.baseUrl);
						} else {
							this.$u.toast(res_Result.sMsg,3000);
				
						}
						this.$refs.pkgId.focus();
					});
			}
		},
	};
</script>

<style>
</style>