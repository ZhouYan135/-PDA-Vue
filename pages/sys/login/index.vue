<template>
	<view class="wrap">
		<js-lang title="login.title" :showBtn="false"></js-lang><!-- showBtn：是否显示语言切换按钮 -->
		<view class="logo">
			<image src="/static/jeesite/logo.png"></image>
		</view>
		<view class="list">
			<view class="list-call">
				<u-icon class="u-icon" size="40" name="account"></u-icon>
				<input focus="true" fixed="true" value="" class="u-input" type="text" v-model="username" maxlength="32"
					:placeholder="$t('login.placeholderAccount')" />
			</view>
			<view class="list-call">
				<u-icon class="u-icon" size="40" name="lock"></u-icon>
				<input fixed="true" value="" class="u-input" type="text" v-model="password" maxlength="32"
					:placeholder="$t('login.placeholderPassword')" :password="!showPassword" />
			</view>
			<!-- <view class="list-call" @click="showSelect = true">
				<u-icon class="u-icon" size="40" name="list"></u-icon>
				<view class="u-input">
					{{ baseUrl || $t('login.Please_select_a_workspace') }}
				</view>
			</view> -->
			<!-- <u-select v-model="showSelect" :list="baseUrlList" value-name="value" label-name="name"
				@confirm="onSelectConfirm">
			</u-select> -->
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
		<view class="button" hover-class="button-hover" @click="submit()"><text>{{$t('login.loginButton')}}</text>
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
				title: 'ad',
				logmsg: '123',
				seconds: 60,
				username: '',
				password: '',
				UserName: '',
				showPassword: false,
				isValidCodeLogin: false,
				submitting: false,
				// //验证码
				// sliderLeft: 0, // 当前滑块位置
				// targetLeft: 0, // 目标位置
				// startX: 0,
				// sliderSuccess: false,
				// maxWidth: 260, // 滑动区域宽度
				// //下拉框
				// //工作区
				// mobile: '',
				// showSelect: false, // 控制弹窗
				// baseUrl: '',
				// baseUrlList: []
			};
		},
		onLoad() {
			//this.getWorkAreaList();
			// setTimeout(() => {
			// 		this.initSlider();
			// 	}, 300);
		},
		methods: {
			// onload(e) {
			// 	console.log("onload");
			// },
			// onclose(e) {
			// 	console.log("onclose: " + e.detail);
			// },
			// onerror(e) {
			// 	console.log("onerror: " + e.detail.errCode + " message:: " + e.detail.errMsg);
			// },
			// initSlider() {
			// 	const query = uni.createSelectorQuery().in(this);

			// 	query.select('#sliderTrack').boundingClientRect(data => {
			// 		this.maxWidth = data.width - 80; // 减去滑块宽度

			// 		this.targetLeft = Math.random() * this.maxWidth;
			// 		this.sliderLeft = 0;
			// 		this.sliderSuccess = false;

			// 		console.log("真实宽度:", this.maxWidth);
			// 		console.log("目标位置:", this.targetLeft);
			// 	}).exec();
			// },

			// onTouchStart(e) {
			// 	this.startX = e.touches[0].pageX;
			// },

			// onTouchMove(e) {
			// 	if (this.sliderSuccess) return;

			// 	let moveX = e.touches[0].pageX - this.startX;

			// 	if (moveX < 0) moveX = 0;
			// 	if (moveX > this.maxWidth) moveX = this.maxWidth;

			// 	this.sliderLeft = moveX;
			// },


			// onTouchEnd() {
			// 	if (Math.abs(this.sliderLeft - this.targetLeft) < 15) {
			// 		this.sliderSuccess = true;
			// 		this.$u.toast('验证通过');
			// 	} else {
			// 		this.$u.toast('验证失败');
			// 		this.resetSlider();
			// 	}
			// },

			// resetSlider() {
			// 	setTimeout(() => {
			// 		this.initSlider();
			// 	}, 500);
			// },
			//下拉框事件
			// onSelectConfirm(e) {
			// 	const item = e[0];
			// 	this.baseUrl = item.label;
			// 	this.mobile = item.label;
			// 	console.log('当前选择下拉框：', item);

			// 	this.$u.toast(`已切换：${item.label}區`);
			// },
			//下拉框绑定
			// getWorkAreaList() {
			// 	const params = {

			// 	};

			// 	this.$u.post('/GetRegionNO', params)
			// 		.then(res => {
			// 			console.log('工作区列表：', res);

			// 			// 🔥 假设返回格式：
			// 			// [{ regionName: 'A区', regionNo: '1' }]

			// 			this.baseUrlList = res.region_no.map(item => ({
			// 				name: item.name, // 显示
			// 			}));

			// 		})
			// 		.catch(() => {
			// 			this.$u.toast('获取工作区失败');
			// 		});
			// },
			submit() {
				if (this.submitting) {
					return;
				}
				if (this.username.length == 0) {
					this.$u.toast('请输入账号');
					return;
				}
				if (this.password.length == 0) {
					this.$u.toast('请输入密码');
					return;
				}
				// if (this.baseUrl.length == 0) {
				// 	this.$u.toast('請選擇工作區');
				// 	return;
				// }
				// if (!this.sliderSuccess) {
				// 	this.$u.toast('请先完成滑块验证');
				// 	return;
				// }
				const inputParas = {

					UserName: this.username,
					UserPwd: this.password
					//username: this.username,
					//password: md5Libs.md5(this.password),
					//region_no: this.mobile

				};
				console.log("请求输入参数:", JSON.stringify(inputParas)); // 打印输入参数

				this.submitting = true;
				this.$u.postJson('/LogIn', JSON.stringify(inputParas))
					.then(res => {
						console.log("请求输出参数:", res);
						if (res && res.code == 1) {
							//接口有返回 且 code==1
							this.$u.vuex('vuex_userName', this.username);
							this.$u.toast(res.message || '登录成功');
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/sys/home/index?UserName=' + encodeURIComponent(this.username)
								});
							}, 500);
						} else {
							//接口无返回 或 接口有返回但code!=1
							this.submitting = false;
							this.$u.toast((res && res.message) || '登录失败');
						}
					})
					.catch(() => {
						this.submitting = false;
						this.$u.toast('未连接到服务器');
					});
			},

		}
	};
</script>
<style lang="scss">
	@import 'index.scss';

	.content {
		background-color: #DBDBDB;
		padding: 10px;
	}

	.ad-view {
		background-color: #FFFFFF;
		margin-bottom: 10px;
	}

	.logo {
		width: 580rpx;
		height: 189rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 5rpx 20rpx 5rpx rgba(45, 127, 235, 0.5);
		margin: 70rpx auto 10rpx auto;
	}

	.logo image {
		width: 580rpx;
		height: 189rpx;
	}

	.base-url js-select {
		width: 100%;
	}

	.button {
		margin: 30rpx auto 0;
	}

	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: #46afff;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 35rpx;
		margin-top: 60rpx;
	}

	.footer text {
		font-size: 30rpx;
		margin-left: 25rpx;
		margin-right: 25rpx;
	}

	.oauth2 {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin: 55rpx 100rpx;

		image {
			height: 100rpx;
			width: 100rpx;
		}
	}

	.slider-box {
		width: 100%;
		padding: 20rpx;
	}

	.slider-track {
		position: relative;
		width: 100%;
		height: 80rpx;
		background: #eee;
		border-radius: 40rpx;
		overflow: hidden;
	}

	.slider-block {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		background: #3b79eb;
		border-radius: 50%;
		z-index: 2;
	}

	.slider-target {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 50%;
	}

	//下拉框样式
	.list-call .u-input {
		flex: 1;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 10rpx;
		color: #333;
	}
</style>