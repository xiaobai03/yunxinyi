<template>
	<view class="content">
		<view style="padding-top: 150upx;">
			<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/seccess.png" class="success"></image>
			<view class="success_text">已发送</view>
			<view class="tishi" style="margin-top: 30upx;">您的心意已经发送～</view>
			<view class="tishi">小助手会时时通知心意领取状态</view>
			<view class="btn_box">
				<view class="btn_red" @click="gotoPage(1)">再发一份</view>
				<view class="btn_red_print" @click="gotoPage(2)">返回</view>
			</view>
		</view>
			
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
			
			}
		},
		methods:{
			gotoPage(e){
				if(e ==1){
					uni.switchTab({
						url:'/pages/greeting_card/greeting_card'
					})
				}else{
					uni.switchTab({
						url:'/pages/home/home'
					})
				}
				
			}
		}
				
	}
</script>

<style lang="scss" scoped>
	
	.success{
		display: block;
		width: 158upx;
		height: 184upx;
		margin: 0upx auto 20upx;
		
	}
	.success_text{
		font-size: 28upx;
		font-weight: 500;
		color: #333333;
		text-align: center;
		line-height: 40upx;
	}
	.tishi{
		text-align: center;
		font-size: 24upx;
		color: #BEB19D;
		margin: 10upx 0;
	}
	.btn_box{
		margin-top: 200upx;
		width: 100%;
		text-align: center;
		.btn_red{
			width: 520upx;
			height: 80upx;
			background: #D04442;
			border-radius: 40upx;
			color: #FFFFFF;
			text-align: center;
			line-height: 76upx;
			margin: 20upx auto;
		}
		.btn_red_print{
			border:2upx solid #D04442;
			width: 520upx;
			height: 80upx;
			text-align: center;
			line-height: 76upx;
			background: #FFFFFF;
			border-radius: 40upx;
			color: #D04442;
			margin: 20upx auto;
		}
	}
</style>
