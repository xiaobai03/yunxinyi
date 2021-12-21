<template>
	<view  class="content">
			<view class="card">
				<view class="top">
					礼品编号:{{form.id}}
				</view>
				<view class="card_body">
					<view class="card_flex" v-for="(item,index) in form.giftbag_detail_list" :key="index">
						<view class="img_box">
							<image :src="item.pics" style="width: 100%;height:100%"></image>
						</view>
						<view class="text_box">
							<text>{{item.name}}</text>
						</view>
						<view class="count_box">
							<text>共{{item.quantity}}份</text>
						</view>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="card_body">
					<view class="list_item">
						<view class="list_left">收礼人：</view>
						<view class="list_left_body">{{form.to_name}}</view>
						<view class="list_right">
							<text class="tag_error" v-if="form.status == 1">未领取</text>
							<text class="tag_error" v-if="form.status == 2">已领取</text>
							<text class="tag_error" v-if="form.status == 3">拒绝</text>
							<text class="tag_error" v-if="form.status == 4">转增</text>
							<text class="tag_error" v-if="form.status == 5">过期</text>
						</view>
					</view>
					<view class="list_item">
						<view class="list_left">发货人：</view>
						<view class="list_left_body">{{form.senderListName}}</view>
					</view>
					<view class="list_item">
						<view class="list_left">日期：</view>
						<view class="list_left_body">{{form.date}}</view>
					</view>
					
					<view class="list_item" v-if="form.regardExpressInfo != null">
						<view class="list_left">收货地址：</view>
						<view class="list_left_body">{{form.regardExpressInfo.address1}} {{form.regardExpressInfo.address2}}</view>
					</view>
					<view class="list_item" v-if="form.regardExpressInfo">
						<view class="list_left">物流信息：</view>
						<view class="list_left_body" v-if="!form.regardExpressInfo.express_no">未发货</view>
						<view class="list_left_body" v-else>{{form.regardExpressInfo.express_company}}-{{form.regardExpressInfo.express_no}}</view>
					</view>
				</view>
			</view>
			<view class="list-box" v-if="!form.regardExpressInfo && form.status != 3">
				<view class="list-item" @click="gotoPages()">
					<view class="left">填写收货地址</view>
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
				form: {},
				list: ['在线发货', '输入快递单号']
			}
		},
		onLoad(e) {
			this.getList(e.id)
		},
		methods: {
			getYMDHMS (timestamp) {
			      let time = new Date(timestamp)
			      let year = time.getFullYear()
			      const month = (time.getMonth() + 1).toString().padStart(2, '0')
			      const date = (time.getDate()).toString().padStart(2, '0')
			      const hours = (time.getHours()).toString().padStart(2, '0')
			      const minute = (time.getMinutes()).toString().padStart(2, '0')
			      const second = (time.getSeconds()).toString().padStart(2, '0')
			      return year + '-' + month + '-' + date
			},
			getList(e){
				this.$request(1037,{id:e}).then(res=>{
					this.form = res.data
					this.form.giftbag_detail_list = JSON.parse(res.data.giftbag_detail_list)
					let list = this.form.senderList.map(item=>{return item.real_name})
					this.form.senderListName = list.join(',')
					this.form.date = this.getYMDHMS(this.form.receive_time * 1000)
				})
			},
			gotoPages(){
				uni.navigateTo({
					url:`/pages/mine/pages/address/address?id=${this.form.id}&obj=${JSON.stringify(this.form.regardExpressInfo)}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.top {
		height: 88upx;
		background: #F5EEE1;
		border-radius: 12upx 12upx 0px 0px;
		line-height: 88upx;
		padding-left: 30upx;
		font-size: 24upx;
		font-weight: 400;
	}
	.card{
		margin: 20upx;
	}
	.card_body{
		background: #FFFFFF;
		padding: 30upx;
	}
	.card_flex:last-child {
		margin-bottom: 0upx;
	}
	
	.card_flex {
		display: flex;
		margin-bottom: 60upx;
		align-items: center;
	
		.img_box {
			width: 90upx;
			height: 86upx;
			overflow: hidden;
			border-radius: 12upx;
			margin-right: 15upx;
		}
	
		.text_box {
			width: 400upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			font-size: 26upx;
			font-weight: 400;
		}
	
		.count_box {
			height: 80upx;
			border-left: 2upx solid #ECECEC;
			text-align: center;
			line-height: 80upx;
			padding: 0 26upx;
			width: 180upx;
			font-size: 24upx;
			font-weight: 400;
		}
	}
	
	.list_item {
		display: flex;
		flex-flow: nowrap;
		height: 60upx;
		align-items: center;
		width: 100%;
	
		.list_left {
			font-size: 24upx;
			font-weight: 400;
			color: #333333;
			min-width: 150upx;
		}
	
		.list_left_body {
			font-size: 24upx;
			font-weight: 400;
			color: #333333;
			width: 100%;
		}
	
		.list_right {
			width: 360upx;
		}
	}
	
	.list-box {
		border-radius: 12upx;
	
		.list-item {
			display: flex;
			flex-flow: nowrap;
			justify-content: space-between;
			align-items: center;
			background: #FFFFFF;
			border-radius: 12upx;
			padding: 28upx 40upx !important;
			margin-bottom: 22upx;
	
			.left {
				width: 100%;
			}
	
			.right {
				width: 30upx;
	
				.right_access {
					width: 12upx;
					height: 20upx;
				}
			}
		}
	}
	.tag_error{
		padding:4upx 14upx;
		font-size: 24upx;
		background: #F7E5E5;
		color: #D04442;
		text-align: center;
		border-radius: 4upx;
	
	}
</style>
