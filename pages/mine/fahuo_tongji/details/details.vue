<template>
	<view class="content" style="padding-top: 20upx;">
		<view class="times_box" @click="DatePicker">
			时间：{{value[0]}}到{{value[1]}}
			<tn-date-picker :beforeDateDisable="false" color="rgb(230,86,86)" :show="showPicker" :format="'yyyy-mm-dd'" :monthNum="6" :value="value" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" @confirm="ed" @cancel="ed" />
		</view>
		<view class="box_body">
			<view v-for="(item, index) in giftbag_detail_list" :key="index" :data-index="index" class="order-item">
					<view class="contente">
						<view class="item_left">
							<image mode="aspectFill" :src="item.pics" />
						</view>
						<view class="item_body">
							<text class="title">{{ item.name }}</text>
						</view>
						<view class="right">
							<view class="border-card"> x{{item.quantity}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import TnDatePicker from "@/components/tn-datepicker/tn-datepicker.vue";
	export default {
		components:{
			TnDatePicker
		},
		data() {
			return {
				id:"",
				showPicker: false,
				value: [],
				giftbag_detail_list:[]
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getYMDHMS()
		},
		methods: {
			getYMDHMS (timestamp) {
			      let time = new Date()
			      const year = time.getFullYear()
			      let month = time.getMonth() + 1
			      let date = time.getDate()
				  if(month < 10) month = `0${month}`
				  else  month = month
				  if(date < 10) date = `0${date}`
				  else date = date
			     this.value = [`${year}/${month}/01`,`${year}/${month}/${date}`]
			},
			DatePicker(){//显示
				this.showPicker = true;
			},
			ed(e) {//选择
				this.showPicker = false;
				if(e) {
					this.value = []
					this.value = e.value
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.times_box{
		height: 100upx;
		width: 750upx;
		background: #FFFFFF;
		line-height: 100upx;
		text-align: center;
	}
	.box_body {
		overflow: hidden;
		margin-top: 20upx;
		.order-item {
			width: 100%;
			display: flex;
			position: relative;
			align-items: right;
			flex-direction: row;
			background: #FFFFFF;
			margin-bottom: 8upx;
		}
	
		.contente {
			width: 100%;
			height: 160upx;
			margin: 0 auto;
			text-align: center;
			display: flex;
			padding: 20upx;
			align-items: center;
	
			.item_left {
				width: 120upx;
				border-radius: 10upx;
				image {
					width: 120upx;
					height: 120upx;
					border-radius: 10upx;
				}
			}
	
			.item_body {
				width: 300upx;
	
				.title {
					text-align: left;
					font-size: 28rpx;
					color: #333333;
					margin-left: 20upx;
					font-weight: 500;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
	
			.right {
				width: 200upx;
	
				.add_box {
					width: 196upx;
					height: 54upx;
					display: flex;
					margin-left: 40upx;
					margin-top: 40upx;
	
					.add_btn {
						display: block;
						width: 50upx;
						height: 50upx;
						line-height: 46upx;
						border: 2upx solid #979797;
						text-align: center;
						margin-left: -2upx;
					}
	
					.add_left {
						border-radius: 6upx 0 0 6upx;
						font-size: 32upx;
					}
	
					.add_right {
						border-radius: 0upx 6upx 6upx 0upx;
						font-size: 32upx;
					}
	
					.add_center {
						width: 60upx;
	
						.add_input {
							width: 60upx;
							height: 50upx;
							padding: 0;
							line-height: 46upx;
						}
					}
				}
	
				.border-card {
					width: 80upx;
					text-align: center;
					height: 60upx;
					background: #FFFFFF;
					border-radius: 20upx;
					border: 2upx solid #d9d9d9;
					line-height: 56upx;
					color: #333333;
					font-weight: 500;
					float: right;
				}
			}
		}
		}
</style>
