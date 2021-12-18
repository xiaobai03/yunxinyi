<template>
	<view class="content">
		<view class="card">
			<view class="card_item" v-for="(item,index) in list" :key="index">
				<view class="card_body">
					<view class="item_left">
						<view class="item_name">{{item.nick_name}}</view>
						<view class="item_tag">发货助理</view>
					</view>
					<view class="item_right">{{item.mobile}}</view>
				</view>
				<view class="card_footer">
					<view class="btn" @click="Stop()">停用</view>
				</view>
			</view>
		</view>
		<view class="btn_box">
			<button class="btn" data-name="shareBtn" open-type="share">邀请发货助理</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				obj:{}
			}
		},
		onLoad() {
			this.$request(1046).then(res=>{
				this.obj.boss_uid = res.data.boss_uid
				this.obj.sign = res.data.sign
				this.obj.boss_name = res.data.boss_name
			})
			this.getData()
		},
		methods: {
			getData(){
				this.$request(1054).then(res=>{
					this.list = []
					if(res.data) this.list.push(res.data)
				})
			},
			Stop(){
				this.$request(1055).then(res=>{
					this.getData()
				})
			},
			onShareAppMessage: function(e) {
					const that = this
					let title = '您的BOSS邀请您为他的发货助理！'
					let provider = 'weixin'
					let scene = "WXSceneSession"
					let path = `/pages/home/home?boss_name=${that.obj.boss_name}&boss_uid=${that.obj.boss_uid}&sign=${that.obj.sign}`
					let imageUrl = 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/zhuli.png'
					return {
						title: title,
						provider:provider,
						scene:scene,
						type:1,
						path: path,
						imageUrl:imageUrl
					}
				}
		}
	}
</script>

<style lang="scss" scoped>
	.card{
		background: #FFFFFF;
		.card_item{
			padding: 30upx;
			.card_body{
				display: flex;
				justify-content: space-between;
				.item_left{
					.item_name{
						display: inline-block;
						font-size: 28upx;
						font-weight: 500;
						color: #333333;
						border-right: 2upx solid #333;
						padding-right: 30upx;
					}
					.item_tag{
						display: inline-block;
						padding-left: 30upx;
						font-size: 24upx;
						color: #C79C4F;
					}
				}
			}
			.card_footer{
				text-align: right;
				margin-top: 20upx;
				height: 78upx;
				.btn{
					float: right;
					width: 186upx;
					height: 58upx;
					background: #D04442;
					color: #FFFFFF;
					text-align: center;
					border-radius: 30upx;
					line-height: 58upx;
				}
			}
		}
	}
	.btn_box{
		width: 690upx;
		margin: 30upx auto;
		display: flex;
		position: fixed;
		bottom: 100upx;
		left: 30upx;
		.btn{
			width: 100%;
			margin: 20upx;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			color: #FFFFFF;
			background: #DD524D;
			border-radius: 10upx;
		}
	}
</style>
