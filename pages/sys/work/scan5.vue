<template>
	<view class="wrap">
		<js-lang title="login.titleAll" :showBtn="true"></js-lang>
		<view class="logo">
			<image src="/static/jeesite/RTBO LOGO.png"></image>
		</view>
		<view class="list">
			
			<view class="list-call" @click="showSelect = true">
				<!-- <u-icon class="u-icon" size="40" name="list"></u-icon> -->
				<view class="u-input">
					{{ baseUrl || $t('login.Please_select_a_workspaceAll') }}
				</view>
			</view>
		<!-- 	<u-form-item label="輸入條碼:" prop="signs" label-width="130"> -->
			<view class="list-call" >
				<!-- <u-icon class="u-icon" size="40" name="account"></u-icon> -->
				<input :focus="isFocus" fixed="true" value="" class="u-input" type="text"  v-model="username" maxlength="32"
					:placeholder="$t('login.placeholderScan')"  @confirm="submit" />
					
					<!-- <u-input ref="pkgId" v-model="username" :placeholder="$t('login.placeholderScan')"  type="text" :focus="isFocus" clearable -->
						<!-- @confirm="onSelectConfirm" /> -->
			</view>
			<!-- </u-form-item>
		<!-- 	<view class="list-call">
				<u-icon class="u-icon" size="40" name="lock"></u-icon>
				<input fixed="true" value="" class="u-input" type="text" v-model="password" maxlength="32"
					:placeholder="$t('login.placeholderPassword')" :password="!showPassword" />
			</view> -->
			<u-select v-model="showSelect" :list="baseUrlList" value-name="value" label-name="name"
				@confirm="onSelectConfirm">
			</u-select>
			<!-- <view class="slider-box">
				<view class="slider-track" id="sliderTrack">
					<view 
						class="slider-block" 
						:style="{ left: sliderLeft + 'px' }"
						@touchstart="onTouchStart"
						@touchmove="onTouchMove"
						@touchend="onTouchEnd"
					></view>
			
					<view 
						class="slider-target" 
						:style="{ left: targetLeft + 'px' }"
					></view>
				</view>
			
				<view class="slider-text">
					{{ sliderSuccess ? '验证成功' : '请拖动滑块完成验证' }}
				</view>
			</view> -->


		</view>
		<view class="button" hover-class="button-hover" @click="submit()"><text>{{$t('login.loginButtonAll')}}</text>
		</view>


	</view>

</template>
<script>
	/**
	 * Copyright (c) 2013-Now http://jeesite.com All rights reserved.
	 */
	import base64 from '@/common/base64.js';
	import md5Libs from "uview-ui/libs/function/md5";
	export default {
		data() {
			return {
				isFocus: true, //  控制焦点
				title: 'ad',
				logmsg: '123',
				seconds: 60,
				username: '',
				// password: '',
				UserName: '',
				showPassword: false,
				username: '',
				isValidCodeLogin: false,
				InputParas: {
					username: '',
					// password: ''
				},
				//验证码
				sliderLeft: 0, // 当前滑块位置
				targetLeft: 0, // 目标位置
				startX: 0,
				sliderSuccess: false,
				maxWidth: 260, // 滑动区域宽度
				//下拉框
				//工作区
				mobile: '',
				showSelect: false, // 控制弹窗
				baseUrl: '',
				baseUrlList: []
			};
		},
		onLoad() {
			this.getWorkAreaList();
			// setTimeout(() => {
			// 		this.initSlider();
			// 	}, 300);
		},
		methods: {
			onload(e) {
				console.log("onload");
			},
			onclose(e) {
				console.log("onclose: " + e.detail);
			},
			onerror(e) {
				console.log("onerror: " + e.detail.errCode + " message:: " + e.detail.errMsg);
			},
			initSlider() {
				const query = uni.createSelectorQuery().in(this);

				query.select('#sliderTrack').boundingClientRect(data => {
					this.maxWidth = data.width - 80; // 减去滑块宽度

					this.targetLeft = Math.random() * this.maxWidth;
					this.sliderLeft = 0;
					this.sliderSuccess = false;

					console.log("真实宽度:", this.maxWidth);
					console.log("目标位置:", this.targetLeft);
				}).exec();
			},

			onTouchStart(e) {
				this.startX = e.touches[0].pageX;
			},

			onTouchMove(e) {
				if (this.sliderSuccess) return;

				let moveX = e.touches[0].pageX - this.startX;

				if (moveX < 0) moveX = 0;
				if (moveX > this.maxWidth) moveX = this.maxWidth;

				this.sliderLeft = moveX;
			},


			onTouchEnd() {
				if (Math.abs(this.sliderLeft - this.targetLeft) < 15) {
					this.sliderSuccess = true;
					this.$u.toast('验证通过');
				} else {
					this.$u.toast('验证失败');
					this.resetSlider();
				}
			},

			resetSlider() {
				setTimeout(() => {
					this.initSlider();
				}, 500);
			},
			//下拉框事件
			onSelectConfirm(e) {
				const item = e[0];
				this.baseUrl = item.label;
				this.mobile = item.label;
				console.log('当前选择下拉框：', item);

				this.$u.toast(`已切换：${item.label}區`);
			},
			
			refocus() {
				this.isFocus = false;
				this.$nextTick(() => {
					this.isFocus = true;
				});
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
			
							this.baseUrlList = res.region_no.map(item => ({
								name: item.name,   // 显示
							}));
			
						})
						.catch(() => {
							this.$u.toast('获取工作区失败');
						});
				},
			submit() {
				if (this.username.length == 0) {
					this.$u.toast('请扫描条码');
					return;
				}
				if (this.baseUrl.length == 0) {
					this.$u.toast('请选择工作区');
					return;
				}
				const a = this.username; // 直接用 v-model
				console.log('扫码内容：' + a);
				
				const inputParas = {

					staffid: a,
					// pwd: this.password,
					//username: this.username,
					//password: md5Libs.md5(this.password),
					region_no: this.mobile

				};
				console.log("请求输入参数:", JSON.stringify(inputParas)); // 打印输入参数

				this.$u.post('/LogIn', JSON.stringify(inputParas))
					.then(res => {
						//res=JSON.parse(res);
						console.log("请求输出参数:", res); // 打印输入参数
						// const res_Result = res.Result;
						 console.log("请求输出参数2:", res.code); // 打印输入参数
						console.log("请求输出参数3:", this.username); // 打印输入参数
						this.$u.toast(res.message || '未连接服务器');
						if (res.code == 1) {
							// ✅ 清空输入（关键）
							this.username = '';
							this.refocus();
						} else {
							this.username = '';
							// ✅ 重新聚焦（关键）
							this.refocus();
							this.$u.toast(res.message);
						}

					});
			},

		}
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
</style>