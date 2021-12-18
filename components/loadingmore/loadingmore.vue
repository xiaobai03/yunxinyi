<template>
	<view class="lading-box">
		<view class="line"></view>
		<view class="loading-text">
			<text v-if="lading_text == 'loadmore'">加载更多</text>
			<text v-else>
				<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/loading.gif" class="loading_img"></image>
				正在加载...
			</text>
		</view>
		<view class="line"></view>
	</view>
</template>

<script>
	export default {
		props:['lading_text'],
		name:"loadingmore",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.lading-box{
		display: flex;
		height: 30upx;
		background: #f5f5f5;
		justify-content: center;
		align-items: center;
		.line{
			width: 80upx;
			height: 2upx;
			background: #d9d9d9;
			margin: 0 10upx;
		}
		.loading-text{
			color: #999999;
		}
		
	}
</style>
