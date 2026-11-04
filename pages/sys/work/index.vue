<template>
	<view class="wrap">
		<u-form class="form">
			<!-- <u-form-item label="请扫描:" prop="userName" label-width="120">
				<input fixed="true" value="" v-model="PTLvalue" placeholder="请输入条码内容自动识别" type="text"
					@blur="GetupList"></u-input>
			</u-form-item>
			<u-form-item label="SKU" prop="email" label-width="120">
				<input fixed="true" value="" v-model="SKU" placeholder="自动识别" type="text" :disabled="true"></u-input>
			</u-form-item>
			<u-form-item label="供应商" prop="mobile" label-width="120">
				<input fixed="true" value="" v-model="Supplier" placeholder="自动识别" type="number" maxlength="11"
					:disabled="true"></u-input>
			</u-form-item>
			<u-form-item label="期效" prop="phone" label-width="120">
				<input fixed="true" value="" v-model="Period_effect" placeholder="自动识别" type="text"
					:disabled="true"></u-input>
			</u-form-item>
			<u-form-item label="批次" prop="sign" label-width="120">
				<input fixed="true" value="" v-model="Batch" type="textarea" placeholder="自动识别" height="35"
					:disabled="true" />
			</u-form-item> -->
			<u-form-item label="请扫描" prop="signs" label-width="120">
				<u-input  @tap="onTap"   v-model="LPN" type="text" placeholder="请输入托盘号" height="35" />
				<!-- <u-field :focus="true" ref="myInput" v-model="LPN" label="手机号" placeholder="请填写手机号" /> -->
			</u-form-item>

		</u-form>
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="submit">提交显示推荐库位</u-button>
			<!-- <u-button class="btn" type="default" @click="cancel">关闭</u-button> -->
		</view>
		<u-form class="form">
			<u-form-item label="荐库位" prop="signs" label-width="120">
				<u-input  v-model="Tlocator" type="text" placeholder="自动识别" height="35" />
			</u-form-item>
			<u-form-item label="实库位" prop="signs" label-width="120">
				<!-- //2024、01、05解决
				//u-input使用原生keydown不生效，解决办法加修饰符.native
				<el-input class='myFormWidth' @keydown.native='handleNumberKeyDown(r.name, $event)' @change='handleChange(name)'></el-input> -->

				<Input id="myInput1"  v-model="Slocator" ref="myInput" type="text" placeholder="请输入实际库位" height="35" />
			</u-form-item>
		</u-form>
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="submit2">确定</u-button>
			<!-- <u-button class="btn" type="default" @click="cancel">关闭</u-button> -->
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				//(91)86212441(92)9500208(11)230710(93)0000709
				PTLvalue: '',
				SKU: '',
				Supplier: '',
				Period_effect: '',
				Batch: '',
				UserName: '',
				LPN: '',
				Tlocator: '',
				Slocator: '',
				intnumber:0
			}
		},
		// onShow() {
		//     // 在页面显示时获取输入框的焦点
		// 	console.log('onShow called');
		//     const inputElement = document.querySelector('#myInput'); // 或者其他方式获取输入框元素
		//     inputElement.focus();
		//   },

		onLoad: function(option) {
			//if(Option.UserName!=null){
			this.UserName = option.UserName;
			//}
			//if(Option.LPN!=null){
			this.LPN = option.LPN;
			this.intnumber=option.intnumber;
			//}
			console.log("接收到页面intnumber：", this.intnumber);
			//this.submit();
			
			
		},
		mounted() {
			//this.baseUrl = this.baseUrlList[0].value;
			var input = document.getElementById('myInput1');
			var self =this;
			input.addEventListener('keydown', function(event) {
			    if (event.key === 'Enter') {
			        console.log('在输入框中按下Enter键');
			        // 在这里执行你想要的操作
					self.submit2();
			    }
			});
			// var input2 = document.getElementById('myInput2');
			// var self =this;
			// input2.addEventListener('keydown', function(event) {
			//     if (event.key === 'Enter') {
			//         console.log('在输入框中按下Enter键');
			//         // 在这里执行你想要的操作
			// 		self.submit1();
			//     }
			// });
		},
		methods: {
			// 页面渲染完成时自动聚焦到用户名输入框，ref="unameInput"
			   //      onTap() {
						// console.log('123')
			   //            // 在点击事件中调用 focus 方法
			   //            this.$refs.myInput.focus();
			   //          },
			//失去焦点触发api
			GetupList() {
				// 使用正则表达式和 split 方法将字符串分割成数组
				var resultArray = this.PTLvalue.split(/\(\d+\)/).filter(Boolean);
				//开始赋值
				this.SKU = resultArray[0];
				this.Supplier = resultArray[1];
				this.Period_effect = resultArray[2];
				this.Batch = resultArray[3];
			},
			submit() {
				//需修改api路径
				const inputParas = {
					InputParas: {
						LPN: this.LPN,
						UserName: this.UserName
					}
				};
				console.log("请求输入参数：", inputParas);
				this.$u.api.TaskGroundingPush(
						JSON.stringify(inputParas)
					)
					.then(res => {
						//console.log(JSON.parse(this.params));
						console.log("请求输出参数:", res); // 打印输入参数
						const res_Result = res.Result;
						console.log("请求输出参数2:", res_Result); // 打印输入参数

						if (res_Result.Code == 0) {
							//文本款开始赋值
							this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
							this.Tlocator = res_Result.Locator;
						} else {
							this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
						}

					});
					this.$refs.myInput.focus();
			},
			submit2() {
				//需修改api路径
				var a=	document.getElementById('myInput1').value;
				console.log('上架实际库位'+a);
				const inputParas = {
					InputParas: {
						LPN: this.LPN,
						Locator: a,
						Qty: this.Qty,
						UserName: this.UserName
					}
				};
				this.$u.api.UplodGrounding(
						JSON.stringify(inputParas)
					)
					.then(res => {
						//console.log(JSON.parse(this.params));
						console.log("请求输出参数:", res); // 打印输入参数
						const res_Result = res.Result;
						console.log("请求输出参数2:", res_Result); // 打印输入参数

						if (res_Result.Code == 0) {

							this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
							//提示成功并跳转界面
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/sys/work/Outbound?UserName=' + this.UserName +'&intnumber='+this.intnumber+''
								});
							}, 500);
						} else {
							this.$u.toast(res_Result.sMsg || '未连接服务器',3000);
						}

					});
			}
			
		}

	}
</script>

<style>
</style>