<template>
	<view  class="content">
		<view class="content_box_white" style="background: #FFFFFF;">
			<!-- <view class="card_top">
				<view class="box">
					<view class="text_a">
						请关注“<text style="color: #D04442;">云⼼意</text>”公众号
					</view>
					<view class="text_a">可以实时获取礼品配送进度。</view>
				</view>
				<view class="box">
					<view class="btn_a">
						关注公众号
					</view>
				</view>
			</view> -->
			<view class="card_bg">
				<view class="title">谢谢您！</view>
				<view class="text">收了{{name}}的小心意！</view>
				<view class="btn_box">
					<view class="btn" @click="gotoHome(1)">
						回赠心意
					</view>
				</view>
			</view>
			<view class="btn_home" @click="gotoHome(2)">
				返回首页
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				name:'',
			}
		},
		onShow() {
			this.name = uni.getStorageSync('to_name')
		},
		methods:{
			gotoHome(e){
				if(e == 1){
					uni.switchTab({
						url:'/pages/greeting_card/greeting_card'
					})
				}else if(e == 2){
					uni.switchTab({
						url:'/pages/home/home'
					})
				}
			}
		},
	}
</script>

<style lang="scss">
	.btn_box{
		width: 100%;
		margin-top: 80upx;
		.btn{
			height: 80upx;
			background: #D04442;
			border-radius: 78upx;
			line-height: 76upx;
			border: 2upx solid #D04442;
			color: #FFFFFF;
			width: 500upx;
			text-align: center;
			margin: 0 auto;
		}
	}
	
	.card_top{
		background: #F6EDED;
		padding: 30upx 40upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 12upx;
		margin-top: 20upx;
		.text_a{
			font-size: 22upx;
			line-height: 36upx;
		}
		.btn_a{
			width: 160upx;
			height: 48upx;
			background: linear-gradient(270deg, #CAA777 0%, #B7862A 100%);
			border-radius: 24px;
			color: #FFFFFF;
			font-size: 20upx;
			text-align: center;
			line-height: 48upx;
		}
	}
	.card_bg{
		width: 100%;
		height: 500upx;
		background: url(http://admin.api.baliyiqu.com:80/images/1627894749359.png) no-repeat;
		background-size: 100% 100%;
		.title{
			font-size: 52upx;
			font-weight: 500;
			color: #505050;
			line-height: 37px;
			padding-top: 136upx;
			padding-left: 68upx;
		}
		.text{
			font-size: 32upx;
			font-weight: 400;
			color: #AC3E3C;
			padding-left: 68upx;
			margin-top: 15upx;
		}
	}
	.btn_home{
		width: 600upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		position: absolute;
		bottom: 100upx;
		left: 75upx;
		background: #D04442;
		color: #FFFFFF;
		border-radius: 80upx;
	}
</style>
