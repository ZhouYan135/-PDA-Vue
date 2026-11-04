<template>
	<view class="wrap">
		<js-lang :title="'主页面 - ' + UserName" :showBtn="false"></js-lang><!-- showBtn：是否显示语言切换按钮 -->
		<!-- <u-swiper :height="300" :list="imgList" :title="false" @click="imgListClick"></u-swiper> -->
		<u-collapse class="box u-p-b-5" :accordion="false" :arrow="true">
			<view class="item" v-for="(menu, index) in menuList" :key="menu.menuCode">
				<u-collapse-item :open="true">
					<view class="title" slot="title">
						<u-icon :name="menu.menuIcon != '' ? menu.menuIcon : 'home'" :size="40"
							:style="{ color: menu.menuColor != '' ? menu.menuColor : '#666' }"></u-icon>
						<view class="text" :style="{ color: menu.menuColor != '' ? menu.menuColor : '#666' }">
							{{menu.menuName}}</view>
					</view>
					<u-grid class="grid u-m-t-20" :col="3" :border="false">
						<u-grid-item v-for="(child, index2) in menu.childList" :key="child.menuCode"
							@click="navTo(child.url)">
							<u-icon class="grid-icon" :name="child.menuIcon != '' ? child.menuIcon : 'order'" :size="80"
								:style="{ color: child.menuColor != '' ? child.menuColor : '#666' }"></u-icon>
							<view class="grid-text"
								:style="{ color: child.menuColor != '' ? child.menuColor : '#666' }">{{child.menuName}}
							</view>
						</u-grid-item>
					</u-grid>
				</u-collapse-item>
			</view>
		</u-collapse>
	</view>
</template>
<script>
	/**
	 * Copyright (c) 2013-Now http://jeesite.com All rights reserved.
	 */
	export default {
		data() {
			return {
				//用户名
				UserName:'',
				// imgList: [{
				// 		image: '/static/jeesite/banner/1.svg'
				// 	},
				// 	{
				// 		image: '/static/jeesite/banner/2.svg'
				// 	},
				// 	{
				// 		image: '/static/jeesite/banner/3.svg'
				// 	}
				// ],

				// todoCount: 0,

				menuList: [{
					menuCode: 'a-1',
					menuName: '菜单',
					menuIcon: 'order',
					menuColor: '',
					url: '',
					childList: [
						// {
						// 	menuCode: 'a11',
						// 	menuName: this.$t('home.Scan'),
						// 	menuIcon: 'scan',
						// 	menuColor: '',
						// 	url: '/pages/sys/work/scan',
						// },
						// {
						// 	menuCode: 'a12',
						// 	menuName: this.$t('home.Scan2'),
						// 	menuIcon: 'checkmark-circle',
						// 	menuColor: '',
						// 	url: '/pages/sys/work/scan2',
						// },
						// {
						// 	menuCode: 'a13',
						// 	menuName: this.$t('home.Scan3'),
						// 	menuIcon: 'close-circle',
						// 	menuColor: '',
						// 	url: '/pages/sys/work/scan3',
						// },
						// {
						// 	menuCode: 'a14',
						// 	menuName: this.$t('home.Scan4'),
						// 	menuIcon: 'minus-circle',
						// 	menuColor: '',
						// 	url: '/pages/sys/work/scan4',
						// },
						{
							menuCode: 'a15',
							menuName: this.$t('home.stockTake'),
							menuIcon: 'file-text ',
							menuColor: '',
							url: '/pages/sys/work/stockConfirm',
						},
						{
							menuCode: 'a10',
							menuName: this.$t('home.Switch_User'),
							menuIcon: 'account',
							menuColor: '',
							url: '/pages/sys/login/index',
							
						}
					]
				}],

			};
		},
		onLoad:function(option) {
			const fromUrl = option && option.UserName && option.UserName !== 'undefined'
				? decodeURIComponent(option.UserName) : '';
			this.UserName = fromUrl || this.vuex_userName;
			//js中''为false
			if (this.UserName) {
				this.$u.vuex('vuex_userName', this.UserName);
			}
		},
		// onShow() {
		// 	this.refreshCount();
		// },
		methods: {
			navTo(url) {
				if (!this.UserName) {
					this.$u.toast('请先登录');
					return;
				}
				const fullUrl = `${url}?UserName=${encodeURIComponent(this.UserName)}`;
				uni.navigateTo({
					url: fullUrl,
					fail: function(res) {
						console.log('跳转失败', res);
					}
				});
			},
			// refreshCount() {
			// 	this.todoCount = 3;
			// },
			// imgListClick(index) {
			// 	console.log(`点击了第${index + 1}页图片`)
			// },
			// itemClick(index) {
			// 	console.log(index);
			// }
		}
	};
</script>
<style lang="scss">
	@import 'index.scss';

	page {
		background-color: #f8f8f8;
	}
</style>