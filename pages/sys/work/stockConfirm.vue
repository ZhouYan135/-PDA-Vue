<template>
	<view class="page">
		<view class="barcode-row" v-if="!showDrug">
			<text class="barcode-label">输入条码:</text>
			<u-input ref="pkgId" class="barcode-input" v-model="barcode" placeholder="请扫描" type="text"
				:focus="isFocus" clearable @confirm="onBarcodeConfirm" />
		</view>
		<view class="barcode-confirm" v-if="!showDrug">
			<u-button class="btn" type="primary" :disabled="barcodeSubmitting" :loading="barcodeSubmitting"
				@click="onBarcodeConfirm">确认</u-button>
		</view>
		<view class="card" v-if="showDrug">
			<view class="card-title">药品信息</view>
			<view class="card-body">
				<view class="row">药品名称: {{ drugName }}</view>
				<view class="row">HIS库存: {{ hisStock }}</view>
				<view class="row correct-row">
					<text>库存修正</text>
					<input class="correct-input" :value="correctQty" type="text" maxlength="8"
						:focus="correctFocus" @input="onCorrectInput" />
				</view>
			</view>
		</view>
		<view class="form-footer" v-if="showDrug">
			<u-button class="btn" type="primary" :disabled="submitting" :loading="submitting" @click="confirm">确认</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				drugName: '',
				UserName: '',
				hisStock: '',
				correctQty: '',
				stockReady: false,
				submitting: false,
				barcode: '',
				isFocus: true,
				correctFocus: false,
				barcodeSubmitting: false,
				showDrug: false
			};
		},
		onLoad(option) {
			const fromUrl = option && option.UserName && option.UserName !== 'undefined'
				? decodeURIComponent(option.UserName) : '';
			this.UserName = fromUrl || this.vuex_userName || '';
			if (!this.UserName) {
				this.$u.toast('缺少工号，请返回重试');
				return;
			}
			this.$u.vuex('vuex_userName', this.UserName);
		},
		mounted() {
			if (!this.showDrug) {
				this.refocus();
			}
		},
		// onShow() {
		// 	if (!this.showDrug) {
		// 		this.refocus();
		// 	}
		// },
		methods: {
			refocus() {
				this.isFocus = false;
				this.$nextTick(() => {
					this.isFocus = true;
				});
			},
			focusCorrect() {
				this.correctFocus = false;
				this.$nextTick(() => {
					this.correctFocus = true;
				});
			},
			onBarcodeConfirm() {
				if (this.barcodeSubmitting) {
					return;
				}
				const barcode = String(this.barcode || '').replace(/[\r\n]/g, '').trim();
				this.barcode = barcode;
				if (!barcode) {
					this.$u.toast('请输入条码');
					this.refocus();
					return;
				}
				const inputParas = {
					OpterName: this.UserName,
					barcode: barcode
				};
				this.barcodeSubmitting = true;
				this.$u.api.FindDragNameAndStockByPDABarcode(JSON.stringify(inputParas))
					.then(res => {
						this.barcodeSubmitting = false;
						this.$u.toast((res && res.message) || '未连接到服务器');
						if (res && res.code == 1) {
							this.drugName = res.drugName || '';
							this.hisStock = res.hisStock !== undefined && res.hisStock !== null && res.hisStock !== ''
								? String(res.hisStock) : '';
							this.stockReady = !!(this.drugName && this.hisStock);
							this.barcode = '';
							this.showDrug = true;
							this.$nextTick(() => {
								this.focusCorrect();
							});
						} else {
							this.refocus();
						}
					})
					.catch(() => {
						this.barcodeSubmitting = false;
						this.$u.toast('未连接到服务器');
						this.refocus();
					});
			},
			onCorrectInput(e) {
				const raw = e.detail && e.detail.value !== undefined ? e.detail.value : '';
				const value = String(raw).replace(/\D/g, '').replace(/^0+(?=\d)/, '');
				if (raw === value) {
					this.correctQty = value;
					return;
				}
				this.correctQty = raw;
				this.$nextTick(() => {
					this.correctQty = value;
				});
			},
			confirm() {
				if (this.submitting) {
					return;
				}
				if (!this.UserName || !this.drugName) {
					this.$u.toast('缺少药品或工号，请返回重试');
					return;
				}
				if (!this.stockReady) {
					this.$u.toast('库存未查询成功，不能修正');
					return;
				}
				if (!/^(0|[1-9]\d*)$/.test(this.correctQty)) {
					this.$u.toast('请输入0或正整数');
					return;
				}
				const inputParas = {
					OpterName: this.UserName,
					drugName: this.drugName,
					hisStock: this.hisStock,
					correctQty: this.correctQty
				};
				this.submitting = true;
				this.$u.api.CorrectStock(JSON.stringify(inputParas))
					.then(res => {
						if (res && res.code == 1) {
							this.$u.vuex('vuex_drugName', '');
							uni.showModal({
								title: '提示',
								content: '修正成功',
								showCancel: false,
								confirmText: '确认',
								success: (modalRes) => {
									if (modalRes.confirm) {
										uni.navigateBack();
									}
								}
							});
						} else {
							this.submitting = false;
							this.$u.toast((res && res.message) || '修正失败');
						}
					})
					.catch(() => {
						this.submitting = false;
					});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.page {
		background: #ffffff;
		padding-top: 40rpx;
	}

	.card {
		margin: 0 40rpx;
		border: 6rpx solid #2979ff;
		background: #ffffff;
	}

	.card-title {
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		background: #2979ff;
		color: #ffffff;
		font-size: 32rpx;
	}

	.card-body {
		padding: 36rpx 24rpx 28rpx;
	}

	.barcode-row {
		display: flex;
		align-items: center;
		padding-left: 10px;
		margin: 0 40rpx 28rpx;
		box-shadow: 0rpx 5rpx 20rpx 5rpx rgba(45, 127, 235, 0.5);
	}

	.barcode-label {
		flex-shrink: 0;
		margin-right: 12rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.barcode-input {
		flex: 1;
	}

	.barcode-confirm {
		margin: 0 40rpx 28rpx;
	}

	.barcode-confirm .btn {
		margin: 0;
	}

	.row {
		margin-bottom: 28rpx;
		text-align: center;
		font-size: 32rpx;
		color: #333333;
	}

	.correct-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 8rpx;
	}

	.correct-input {
		width: 160rpx;
		height: 56rpx;
		margin-left: 16rpx;
		border: 2rpx solid #9ec9f5;
		border-radius: 6rpx;
		background: #f7fbff;
		text-align: center;
		font-size: 30rpx;
	}

	.page .form-footer {
		margin-top: 8rpx;
	}
</style>
