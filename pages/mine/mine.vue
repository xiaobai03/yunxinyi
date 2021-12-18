<template>
	<view class="content">
		<view class="top_box">
			<view class="user_info_box" :class="active">
				<view class="user_info">
					<view class="box flex">
						<view class="box user_tx">
							<image :src="userInfo.avatarUrl" class="user_img"></image>
						</view>
						<view class="box">
							<view class="user_name">{{userInfo.nickName}}</view>
							<view class="user_info_other">
								<text class="">{{mobile}} </text>
								<!-- <text style="margin: 0 20upx;">|</text> -->
								<!-- <text class=""> 生日 {{userInfo.birthday}} </text> -->
							</view>
						</view>
					</view>
					<view class="box setting">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_icon_set.png" @click="gotoSetting()" class="setting_icon"></image>
					</view>
				</view>
			</view>
			<view class="nav_box">
				<view class="item" v-for="(item,index) in navList" :key="index" @click="gotoPage(index)">
					<image v-if="index == 0" src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_icon1.png" class="item_icon"></image>
					<image v-if="index == 1" src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_icon2.png" class="item_icon"></image>
					<image v-if="index == 2" src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_icon3.png" class="item_icon"></image>
					<image v-if="index == 3" src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_icon4.png" class="item_icon"></image>
					<view class="item_text">{{item}}</view>
				</view>
			</view>
		</view>
		<view class="list-box">
			<view class="list_item" v-for="(item,index) in list" :key="index" @click="gotoPages(index)">
				<view class="icon">
					<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_1.png" style="width: 40upx;height:36upx;margin-right: 10upx;" v-if="index == 0"></image>
					<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_2.png" style="width: 40upx;height:36upx;margin-right: 10upx;" v-if="index == 1"></image>
					<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_3.png" style="width: 40upx;height:36upx;margin-right: 10upx;" v-if="index == 2"></image>
				</view>
				<view class="left">{{item}}</view>
				<view class="right">
					<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
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
				userInfo: {
				},
				boss_uid:'0',
				mobile:'',
				list:['我的发货助理','发货管理','发货统计'],
				navList: ['联系人', '礼品库', '送礼单', '收礼单']
			};
		},
		onShow() {
			const token = uni.getStorageSync('token')
			if(!token){
				uni.navigateTo({url:'/pages/login/login'})
			}else{
				this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				this.mobile = uni.getStorageSync('mobile')
				this.boss_uid = uni.getStorageSync('boss_uid')
			}
		},
		created() {
			if(uni.getStorageSync('iphone')) this.active = 'active'
			else this.active = ''
		},
		methods: {
			gotoPage(index){
				if(index == 0) {
					uni.navigateTo({
						url:'/pages/mine/contacts/contacts'
					})
				}else if(index == 1){
					uni.navigateTo({
						url:"/pages/mine/my_gift/my_gift"
					})
				}else if(index == 2){
					uni.navigateTo({
						url:"/pages/mine/give_gift/give_gift"
					})
				}else if(index == 3){
					uni.navigateTo({
						url:"/pages/mine/accept_gift/accept_gift"
					})
				}
			},
			gotoSetting(){
				uni.navigateTo({
					url:'/pages/mine/setting/setting'
				})
			},
			gotoPages(index){
				if(index == 0){
					uni.navigateTo({
						url:'/pages/mine/my_assistant/my_assistant'
					})
				}else if(index == 1){
					uni.navigateTo({
						url:'/pages/mine/fahuo_management/fahuo_management'
					})
				}else if(index == 2){
					uni.navigateTo({
						url:'/pages/mine/fahuo_tongji/fahuo_tongji'
					})
				}
				console.log(index)
			}
		}
	}
</script>

<style lang="scss">
	.content_boxy {
		background: linear-gradient(180deg, #FFFFFF 0%, #F2F2F2 100%);
		height: 100vh;
	}

	.top_box {
		width: 100%;
		height: 554upx;
		background: url('https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/mine_bg.png') no-repeat;
		background-size: 100% 100%;
	}
	.user_info_box {
		width: 690upx;
		padding-top: 200upx;
		padding-left: 30upx;
		.user_info {
			display: flex;
			flex-flow: nowrap;

			.box {
				width: 100%;
			}

			.setting {
				width: 44upx;
				height: 44upx;

				.setting_icon {
					width: 44upx;
					height: 44upx;
				}
			}

			.flex {
				display: flex;
				flex-flow: nowrap;
				align-items: center;

				.box {
					width: 100%;

					.user_name {
						font-size: 32upx;
						font-weight: 500;
						color: #333333;
						line-height: 44upx;
					}

					.user_info_other {
						font-size: 24upx;
						font-weight: 400;
						color: #333333;
						line-height: 34upx;
						margin-top: 15upx;
					}
				}

				.user_tx {
					width: 142upx;
					height: 142upx;
					margin: 0 22upx;
					border-radius: 142upx;
					.user_img {
						width: 142upx;
						height: 142upx;
						border-radius: 142upx;
						overflow: hidden;
					}
				}

			}
		}
	}
	
	.nav_box {
		padding:100upx 30upx 0;
		display: flex;
		flex-flow: nowrap;
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
	.nav_box.active{
		margin-top: -130upx;
	}
	.list-box{
		padding: 0 28upx;
		border-radius: 12upx;
		overflow: hidden;
		width: 694upx;
		margin-top: 40upx;
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
	}
	
</style>
