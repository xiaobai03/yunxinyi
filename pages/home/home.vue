<template>
	<view class="home_box">
		<view class="header_index"  :class="active">
			<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/logo.png"
				class="logo"></image>
		</view>
		<view v-if="showPage">
			<view class="banner" :class="active">
				<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/home_banner.jpg" class="banner_img"></image>
			</view>
			<view class="nav_box">
				<view class="item" v-for="(item,index) in navList" :key="index" @click="gotoPageHome(index)">
					<image :src="item.url" class="item_icon"></image>
					<view class="item_text">{{item.text}}</view>
				</view>
			</view>
			<view class="message_item_box">
				<view class="title">
					通知
				</view>
				<view v-if="list.length == 0" style="line-height: 500upx;text-align: center;color: #FFFFFF;">暂无通知</view>
				<view class="message_item" v-else>
					<view class="item" v-for="(item,index) in list" :key="index" @click="gotoDetail_shou(item.id)">
						<view class="box_left">
							<text class="red_btn" v-if="item.status == 1">未领取</text>
							<text class="red_btn" v-else-if="item.status == 2">已领取</text>
							<text class="red_btn" v-else-if="item.status ==3">已拒绝</text>
							<text class="red_btn" v-else-if="item.status == 4">已转增</text>
							<text class="red_btn" v-else-if="item.status == 5">已过期</text>
							<text class="red_btn" v-else-if="item.status == 6">已发货</text>
							<text class="red_btn" v-else-if="item.status == 7">已签收</text>
							<text class="red_btn" v-else-if="item.status == 8">已退货</text>
						</view>
						<view class="box_right">
							<text v-if="item.status == 1">您有尚未领取的礼品</text>
							<text v-if="item.status == 2">您已领取{{item.from_name}}送您的礼品</text>
							<text v-if="item.status == 3">您已拒绝{{item.from_name}}送您的礼品</text>
							<text v-if="item.status == 4">您已转增{{item.from_name}}送您的礼品</text>
							<text v-if="item.status == 5">您有未领取的礼品已过期</text>
							<text v-if="item.status == 6">{{item.from_name}}送您的礼品已发货</text>
							<text v-if="item.status == 7">您已签收{{item.from_name}}送您的礼品</text>
							<text v-if="item.status == 8">{{item.from_name}}送您的礼品已退货</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="banner" :class="active">
				<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/home_banner.png" class="banner_img"></image>
			</view>
			<view class="card_box">
				<view class="card_a">
					<view class="btn_box">
						<view class="btn" @click="gotoPage(1)">马上送心意</view>
					</view>
				</view>
				<view class="card_b">
					<view class="btn_box">
						<view class="btn" @click="gotoPage(2)">去礼包看看</view>
					</view>
				</view>
				<view class="card_c">
					<view class="btn_box">
						<view class="btn">
							<button class="fx_btn" @click="gotoPage(3)" v-if="!token">邀请发货助理</button>
							<button id="button_a" v-else class="fx_btn" data-name="shareBtn" open-type="share">邀请发货助理</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active:'',
				list:[],
				showPage:true,
				obj:{},
				token:'',
				navList: [{
						url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/index_icon1.png',
						text: '送心意'
					},
					{
						url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/index_icon2.png',
						text: '加礼品'
					}, {
						url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/index_icon3.png',
						text: '查礼单'
					}, {
						url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/index_icon4.png',
						text: '联系人'
					}
				],
			}
		},
		created() {
			const iphone = uni.getStorageSync('iphone')
			if(iphone) this.active = 'active'
		},
		onShow() {
			this.token = uni.getStorageSync('token')
			if(uni.getStorageSync('token')) {
				this.$request(1046).then(res=>{
					this.obj.boss_uid = res.data.boss_uid
					this.obj.sign = res.data.sign
					this.obj.boss_name = res.data.boss_name
				})
				this.getTongzhiList()
			}else{
				this.showPage = false
			}
		},
		methods: {
			getTongzhiList(){
			
				this.$request(1036, {
					curr_page:1,
					page_size:100,
				}).then(res=>{
					this.list = res.data.data_list
					this.$request(1034, {
						curr_page:1,
						page_size:100,
						key:''
					}).then(res=>{
						let array = res.data.data_list
						if(this.list.length > 0 || array.length > 0) this.showPage = true
						else this.showPage = false
					})
				})
			},
			onShareAppMessage(e) {
				uni.setStorageSync('loginNum', 1)
				const that = this
				let title = `${this.obj.boss_name}邀请您为他的发货助理！`
				let provider = 'weixin'
				let scene = "WXSceneSession"
				let path = `/pages/mine/my_boss/my_boss?boss_name=${that.obj.boss_name}&boss_uid=${that.obj.boss_uid}&sign=${that.obj.sign}`
				let imageUrl = 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/zhuli.png'
				setTimeout(()=>{
					uni.switchTab({
						url:'/pages/home/home'
					})
				},2000)
				return {
					title: title,
					provider:provider,
					scene:scene,
					type:1,
					path: path,
					imageUrl:imageUrl
				}
			},
			gotoDetail_shou(id){
				console.log(id)
			},
			gotoPageHome(e){
				if(!this.token){
					uni.navigateTo({
						url:"/pages/login/login"
					})
				}else{
					if(e == 0){
						uni.switchTab({
							url:'/pages/greeting_card/greeting_card'
						})
					}else if(e== 1){
						uni.navigateTo({
							url:'/pages/mine/my_gift/add_gift/add_gift'
						})
					}else if(e== 2){
						uni.navigateTo({
							url:'/pages/mine/accept_gift/accept_gift'
						})
					}else if(e == 3){
						uni.navigateTo({
							url:"/pages/mine/contacts/contacts"
						})
					}
				}
			},
			gotoPage(e){
				if(!this.token){
					uni.navigateTo({
						url:"/pages/login/login"
					})
					
				}else{
					uni.setStorageSync('loginNum', 1)
					if(e == 1){
						uni.switchTab({
							url:'/pages/greeting_card/greeting_card'
						})
					}else if(e == 2){
						uni.navigateTo({
							url:'/pages/mine/my_gift/my_gift'
						})
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.home_box{
		font-size: 28upx;
	}
	.header_index {
		height: 100upx;
		line-height: 90upx;
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		background: #FFFFFF;
		width: 100%;
		z-index: 99;
		flex-flow: nowrap;
		padding: 25upx 20upx 0;
		.logo {
			width: 126upx;
			height: 48upx;
			margin-top: 34upx;
			margin-left: 15upx;
		}
	}
	.header_index.active {
		height: 150upx;
		line-height: 90upx;
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		background: #FFFFFF;
		width: 100%;
		z-index: 99;
		flex-flow: nowrap;
		padding: 25upx 20upx 0;
		.logo {
			width: 126upx;
			height: 48upx;
			margin-top: 84upx;
			margin-left: 15upx;
		}
	}
	.banner.active{
		margin-top: 180upx;
	}
	.banner{
		width: 100%;
		height: 320upx;
		margin-top: 110upx;
		.banner_img{
			width: 100%;
			height: 100%;
		}
	}
	.nav_box {
		padding: 20upx 40upx;
		display: flex;
		margin-top: 30upx;
		flex-flow: nowrap;
		background: #FFFFFF;
		.item {
			width: 100%;
			text-align: center;
			margin: 0 5upx;
	
			.item_icon {
				width: 52upx;
				height: 52upx;
			}
		}
	}
	.message_item_box {
		margin: 30upx 30upx 0 30upx;
		border: 4upx solid #FFFFFF;
		padding: 20upx;
		background: url(https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/home_bg.png) no-repeat;
		border-radius: 20upx;
		min-height: 500upx;
		.title {
			font-size: 30upx;
			font-weight: 500;
			color: #FFFFFF;
		}
	
		.message_item {
			height: 500upx;
			width: 100%;
			margin-top: 10upx;
			overflow-y: auto;
			background: #FFFFFF;
			border-radius: 10upx;
			.item {
				height: 54upx;
				margin: 8upx 0;
				padding:20upx;
				display: flex;
				flex-flow: nowrap;
				align-items: center;
				border-bottom: 2upx solid #e6e6e6;
				.box_left {
					width: 110upx;
	
					.red_btn {
						text-align: center;
						width: 100upx;
						display: block;
						background: rgba(208, 68, 66, 0.08);
						border-radius: 14px;
						border: 2px solid rgba(208, 68, 66, 0.39);
						font-size: 20upx;
						color: #AC3E3C;
					}
				}
	
				.box_right {
					font-size: 24upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-left: 20upx;
				}
			}
		}
	}
	.card_box{
		margin-top: -10upx;
		padding:0 30upx 30upx;
		background-size: 100% 100%;
		background: url('https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/bg.png');
		.card_a{
			background: url('https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/home1.png') no-repeat;
			height: 740upx;
			width: 100%;
			background-size: 100% 100%;
			position: relative;
			.btn_box{
				width: 520upx;
				margin: 0 auto;
				position: absolute;
				bottom: 40upx;
				left: 85upx;
				.btn{
					width: 100%;
					height: 80upx;
					line-height: 80upx;
					background: #A9010F;
					color: #FFFFFF;
					font-size: 28upx;
					text-align: center;
					margin: 20upx 0;
					border: 2upx solid #A9010F;
					border-radius: 80upx;
				}
			}
		}
		.card_b{
			background: url('https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/home2.png') no-repeat;
			height: 740upx;
			width: 100%;
			position: relative;
			background-size: 100% 100%;
			margin-top: 40upx;
			.btn_box{
				width: 520upx;
				margin: 0 auto;
				position: absolute;
				bottom: 40upx;
				left: 85upx;
				.btn{
					width: 100%;
					height: 80upx;
					line-height: 80upx;
					background: #A9010F;
					color: #FFFFFF;
					font-size: 28upx;
					text-align: center;
					margin: 20upx 0;
					border: 2upx solid #A9010F;
					border-radius: 80upx;
				}
			}
		}
		.card_c{
			background: url('https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/home3.png') no-repeat;
			height: 674upx;
			width: 100%;
			background-size: 100% 100%;
			margin-top: 40upx;
			position: relative;
			.btn_box{
				width: 520upx;
				margin: 0 auto;
				position: absolute;
				bottom: 30upx;
				left: 85upx;
				.btn{
					width: 100%;
					height: 80upx;
					line-height: 80upx;
					background: #A9010F;
					color: #FFFFFF;
					font-size: 28upx;
					text-align: center;
					margin: 20upx 0;
					border: 2upx solid #A9010F;
					border-radius: 80upx;
				}
				.fx_btn{
					border: 0;
					background: rgba(0,0,0,0);
					color: #FFFFFF;
					border-radius: 80upx;
					height: 80upx;
					line-height: 80upx;
					font-size: 26upx;
				}
			}
		}
	}
</style>
