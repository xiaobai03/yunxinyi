<template>
	<view class="content">
		<view style="padding-top: 20upx;">
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
						<view v-if="!item.validity" style="border-top: 2upx solid #e6e6e6;padding: 20upx;">
							<view  style="text-align: left;color: #D04442; font-size:24upx;">已经过了领取时效，可能存在无货的情况</view>
						</view>
					</view>
				</view>
				<view class="btn_box" v-if="dataObj.status == 1">
					<view class="btn_box_box">
						<view class="btn_left btns" @click="subFun(1)">婉拒</view>
						<view class="btn_right btns" @click="subFun(2)">留下心意</view>
					</view>
				</view>
				<view v-if="dataObj.status == 2" class="list_item" @click="gotoPages(1)">
					<view class="left" v-if="dataObj.regardExpressInfo">查看收货信息</view>
					<view class="left" v-else>输入收货信息</view>
					<view class="right">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
				<view v-if="dataObj.status == 3" class="list_item">
					<view class="left">已拒绝礼品</view>
				</view>
			</view>
			<view class="footer_box" :class="active">
				<view class="footer" @click="gotoPage(1)">
					<view class="footer_icon">
						<image src="../../static/images/icon_1.png" class="icon"></image>
					</view>
					<view class="footer_text">首页</view>
				</view>
				<view class="footer" @click="gotoPage(2)">
					<view class="footer_icon">
						<image src="../../static/images/icon_2.png" class="icon"></image>
					</view>
					<view class="footer_text">贺卡</view>
				</view>
				<view class="footer">
					<view class="footer_icon">
						<image src="../../static/images/icon_3_active.png" class="icon"></image>
					</view>
					<view class="footer_text" style="color: #DD524D;">礼包</view>
				</view>
				<view class="footer" @click="gotoPage(4)">
					<view class="footer_icon">
						<image src="../../static/images/icon_4.png" class="icon"></image>
					</view>
					<view class="footer_text">我的</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				active: "",
				isActive:2,
				giftbag_detail_list: [],
				obj:{},
				dataObj:{},
				address:null,
				list:[
					
					{
						icon:require('../../static/images/icon_1.png'),
						iconActive:require('../../static/images/icon_1_active.png'),
						text:"首页"
					},
					{
						icon:require('../../static/images/icon_2.png'),
						iconActive:require('../../static/images/icon_2_active.png'),
						text:"贺卡"
					},{
						icon:require('../../static/images/icon_3.png'),
						iconActive:require('../../static/images/icon_3_active.png'),
						text:"礼包"
					},{
						icon:require('../../static/images/icon_4.png'),
						iconActive:require('../../static/images/icon_4_active.png'),
						text:"我的"
					}
				]
			}
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj)
			this.getData()
		},
		onShow() {
			this.getData()
		},
		created() {
			const that = this
			uni.getStorage({
				key: 'iphone',
				success: function(res) {
					if (res.data) {
						that.active = 'active'
					}
				}
			})
			
		},
		methods: {
			getData(){
				this.$request(1031,this.obj).then(res=>{
					this.dataObj = res.data
					this.giftbag_detail_list = JSON.parse(res.data.giftbag_detail_list)
					if(res.data.regardExpressInfo) this.address = res.data.regardExpressInfo
					else  this.address = null
				}) 
			},
			gotoDetails(e){
				uni.navigateTo({
					url:'/pages/chakan_gift/details_gift/details_gift?id='+ e.id
				})
			},
			gotoPages(e){
				if(e == 1){
					uni.navigateTo({
						url:`/pages/address/address?id=${this.obj.id}&obj=${JSON.stringify(this.address)}`
					})
				}
			},
			gotoPage(e){
				if(e == 1) {
					uni.switchTab({
						url:"/pages/home/home"
					})
				}else if(e== 2){
					uni.switchTab({
						url:"/pages/greeting_card/greeting_card"
					})
				}else {
					uni.switchTab({
						url:"/pages/mine/mine"
					})
				}
			},
			subFun(e) {
				const that = this
				const token = uni.getStorageSync('token')
				if(!token) {
					uni.navigateTo({
						url:'/pages/login/login?sign=' + this.obj.sign
					})
				}else{
					let from_uid = this.obj.uid
					let id = this.obj.id
					let sign = this.obj.sign
					if (e === 1) {
						uni.showModal({
							content: '您确认不接受这份心意？',
							confirmColor:'#D04442',
							    success: function (res) {
							        if (res.confirm) {
										that.$request(1033,{
											from_uid:from_uid,
											id:id,
											sign:sign
										}).then(res=>{
											if(res.code == 0){
												uni.switchTab({
													url:'/pages/home/home'
												})
											}
										}) 
							        } else if (res.cancel) {
							            console.log('用户点击取消');
							        }
							    }
						})
					} else {
						this.$request(1032,{
							from_uid:from_uid,
							id:id,
							sign:sign
						}).then(res=>{
							if(res.code == 0){
								uni.showToast({
									title:'已接受礼品'
								})
								setTimeout((
									uni.navigateTo({
										url:`/pages/address/address?id=${that.obj.id}&obj=${JSON.stringify(that.address)}`
									})
								),1000)
								
							}
						}) 
					}
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.box_body {
		overflow: hidden;
		.order-item {
			width: 100%;
			display: flex;
			position: relative;
			align-items: right;
			flex-direction: row;
			background: #FFFFFF;
			flex-flow: column;
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
	
		.remove {
			margin-left: -5%;
			width: 80px;
			height: 100%;
			background-color: red;
			color: #FFFFFF;
			position: absolute;
			top: 0;
			right: -160upx;
			transition: .2s all ease-out;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.btn_box {
		padding: 28upx 56upx;
		margin-top: 100upx;
		.btn_box_box {
			display: flex;
			flex-flow: nowrap;
		}

		.btns {
			width: 100%;
		}

		.btn_left {
			width: 100%;
			text-align: center;
			height: 80upx;
			background: #F6E5E5;
			box-shadow: 0px -12upx 24upx -12upx rgba(217, 217, 217, 0.5);
			border-radius: 40upx 0px 0px 40upx;
			border: 2upx solid #D04442;
			line-height: 76upx;
			color: #D04442;
			font-weight: 500;
		}

		.btn_right {
			width: 100%;
			text-align: center;
			height: 80upx;
			background: #D04442;
			border-radius: 0upx 40px 40px 0upx;
			border: 2upx solid #D04442;
			line-height: 76upx;
			color: #FFFFFF;
			font-weight: 500;
		}

		.btn_center {
			width: 580upx;
			text-align: center;
			height: 80upx;
			background: #F6E5E5;
			box-shadow: 0px -12upx 24upx -12upx rgba(217, 217, 217, 0.5);
			border-radius: 40upx;
			border: 2upx solid #D04442;
			line-height: 76upx;
			color: #D04442;
			font-weight: 500;
		}

	}
	.title-wrap{
		width: 300upx;
	}
	.border-card{
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
	.go_home{
		text-align: center;
		position: fixed;
		bottom: 150upx;
		left: 0;
		width: 100%;
		color: #D04442;
	}
	
	.list_item{
		display: flex;
		flex-flow: nowrap;
		justify-content: space-between;
		align-items: center;
		background: #FFFFFF;
		border-radius: 12upx;
		padding: 28upx 40upx;
		margin-bottom: 22upx;
		.left{
			width: 100%;
			.nav_icon{
				width: 30upx;
				height: 30upx;
			}
		}
		.right{
			width: 30upx;
			.right_access{
				width: 12upx;
				height: 20upx;
			}
		}
	}
	.footer_box.active{
		padding-bottom: 40upx;
	}
	.footer_box{
		width: 720upx;
		height: 100upx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		padding:0 15upx ;
		align-items: center;
	}
	.footer{
		width: 100%;
		text-align: center;
		.footer_icon{
			width: 50upx;
			height: 50upx;
			margin-bottom: 10upx;
			margin: auto;
			.icon{
				width: 50upx;
				height: 50upx;
			}
		}
		.footer_text{
			font-size: 24upx;
		}
	}
</style>
