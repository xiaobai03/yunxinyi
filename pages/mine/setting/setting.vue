<template>
	<view class="content">
		<view style="padding-top: 30upx;">
			<view class="flex">
				<view class="box">
					<text class="title">电话绑定</text>
				</view>
				<view class="box">
					<text class="text">{{wechart.mobile}}</text>
				</view>
			</view>
			<view class="flex">
				<view class="box">
					<text class="title">微信绑定</text>
				</view>
				<view class="box">
					<text class="text">{{wechart.oppenId}}</text>
				</view>
			</view>
		</view>
		<view class="btn_box">
			<view class="btn" @click="logout">退出</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				wechart:{
					mobile:'',
					oppenId:''
				}
			}
		},
		created() {
			this.wechart.mobile = uni.getStorageSync('mobile')
			this.wechart.oppenId = uni.getStorageSync('openid')
		
		},
		methods: {
			logout(){
				uni.showModal({
				    title: '提示',
				    content: '确定要退出吗？',
					confirmColor:"#DD524D",
				    success: function (res) {
				        if (res.confirm) {
							uni.clearStorage();
				            uni.switchTab({
				            	url:'/pages/home/home'
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	
		.flex{
			border-bottom:2upx solid #F8F8F8;
			background: #FFFFFF;
			display: flex;
			padding: 26upx 34upx;
			.box{
				.title{
					font-size: 28upx;
					font-weight: 500;
					color: #333333;
					
					margin-right: 70upx;
				}
				.text{
					font-size: 28upx;
					font-weight: 400;
					color: #505050;
				}
			}
		}
		.btn_box{
			position: absolute;
			bottom: 180upx;
			left: 75upx;
			width: 600upx;
			.btn{
				text-align: center;
				width: 600upx;
				height: 80upx;
				line-height: 76upx;
				border: 2upx solid #DD524D;
				border-radius: 80upx;
				background: #DD524D;
				color: #FFFFFF;
				font-weight: 500;
			}
		}
</style>
