<template>
	<view class="page">
		<view class="drug-grid">
			<view v-for="(item, index) in drugList" :key="index" class="drug-item"
				:class="{ active: selectedIndex === index }" @click="selectedIndex = index">
				{{ item.name }}
			</view>
		</view>
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="confirm">确认</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				UserName: '',
				drugList: [],
				selectedIndex: -1,
				confirming: false
			};
		},
		onLoad(option) {
			const fromUrl = option && option.UserName && option.UserName !== 'undefined'
				? decodeURIComponent(option.UserName) : '';
			this.UserName = fromUrl || this.vuex_userName;
			if (!this.UserName) {
				this.$u.toast('缺少工号，请重新登录');
				return;
			}
			this.$u.vuex('vuex_userName', this.UserName);
			this.loadDrugs();
		},
		methods: {
			loadDrugs() {
				const inputParas = {
					UserName: this.UserName
				};
				this.$u.api.GetLocatorDrugs(JSON.stringify(inputParas))
					.then(res => {
						if (res && res.code == 1 && res.drugs) {
							this.drugList = res.drugs;
							this.selectedIndex = this.drugList.length ? 0 : -1;
						} else {
							this.$u.toast((res && res.message) || '查询药品失败');
						}
					});
			},
			confirm() {
				if (this.confirming) {
					return;
				}
				if (!this.UserName) {
					this.$u.toast('缺少工号，请重新登录');
					return;
				}
				const drug = this.drugList[this.selectedIndex];
				if (this.selectedIndex < 0 || !drug || !drug.name) {
					this.$u.toast('请选择药品');
					return;
				}
				this.confirming = true;
				this.$u.vuex('vuex_drugName', drug.name);
				uni.navigateTo({
					url: '/pages/sys/work/stockConfirm?drugName=' + encodeURIComponent(drug.name) +
						'&UserName=' + encodeURIComponent(this.UserName),
					complete: () => {
						this.confirming = false;
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.page {
		background: #ffffff;
	}

	.drug-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 28rpx 24rpx 0;
	}

	.page .form-footer {
		margin-top: 0;
		padding-bottom: 24rpx;
	}

	.page .form-footer .btn {
		margin-top: 0;
	}

	.drug-item {
		width: 48%;
		height: 148rpx;
		margin-bottom: 28rpx;
		padding: 16rpx;
		box-sizing: border-box;
		background: #ececec;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 30rpx;
		color: #333333;
	}

	.drug-item.active {
		box-shadow: 0rpx 5rpx 20rpx 5rpx rgba(45, 127, 235, 0.5);
	}
</style>
