<template>
	<view class="content">
		<view class="search_box">
			<view class="search">
				<input class="search_input" type="search" placeholder="请输入您要找的收礼人" v-model="value"/>
				<view class="close_input" v-if="value" @click="clearData()">x</view>
				<image @click="getList()" src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/search.png" class="search_icon"></image>
			</view>
		</view>
		<view style="margin-top: 20upx;" v-if="list.length == 0">
			<view style="text-align: center;margin-top: 100upx;">暂无数据</view>
		</view>
		<view style="margin-top: 20upx;" v-else>
			<view class="card" v-for="(item,index) in list" :key="index" @click="gotoDetails(item.id)">
				<view class="card_body" >
					<view style="display: flex;">
						<view class="box img_box_box">
							<view :style="{'width':item.width}" style="height:160upx;">
								<view class="img_box" v-for="(k,j) in item.giftbag_detail_list" :key="j">
									<image :src="k.pics" style="width: 100%;height:100%;"></image>
								</view>
							</view>
						</view>
						<view class="box text-right_box">
							<text class="text-right">共{{item.giftbag_detail_list.length}}份</text>
						</view>
					</view>
					<view class="item_name">
						<view class="box" style="width: 280upx;">
							<view class="group" >
								<view class="cell">收礼人</view>
								<view class="cell text" v-if="item.status == 2">{{item.to_name}}</view>
								<view class="cell text" v-if="item.status == 1">{{item.call}}</view>
							</view>
						</view>
						<view class="box" style="margin-left: 20upx;">
							<text class="date_text">日期：{{item.createTime}}</text>
						</view>
					</view>
					<view class="item_footer">
						<view style="color: #333333;" v-if="item.status == 1">未领取</view>
						<view style="color: #B7852A;" v-if="item.status == 2">已领取</view>
						<view style="color: #333333;" v-if="item.status == 3">已拒绝</view>
						<view style="color: #D04442;" v-if="item.status == 4">已转增</view>
						<view style="color: #D04442;" v-if="item.status == 5">已过期</view>
						<view style="color: #D04442;" v-if="item.status == 6">已发货</view>
						<view style="color: #D04442;" v-if="item.status == 7">已发货</view>
						<view style="color: #D04442;" v-if="item.status == 8">已退货</view>
					</view>
				</view>
			</view>
		</view>
		<LoadingMore v-if="list.length > 4" :lading_text="loadStatus"></LoadingMore>
	</view>
</template>

<script>
	import LoadingMore from '@/components/loadingmore/loadingmore.vue'
	export default {
		components:{LoadingMore},
		data() {
			return {
				value:'',
				width:'',
				list:[],
				curr_page:1,
				page_size:10,
				loadStatus: 'loadmore',
			}
		},
		onLoad(option) {
			if(option.name) this.value = option.name
			else this.value = ''
			this.getList()
		},
		onShow() {
			this.getList()
		},
		methods: {
			onReachBottom() {
				console.log(111)
				this.loadStatus = 'loading';
				this.page_size +=10
				// 模拟数据加载
				setTimeout(() => {
					this.getList();
					this.loadStatus = 'loadmore';
				}, 1000)
			},
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
			clearData(){
				this.value = ''
				this.getList()
			},
			getList(){
				const that = this
				this.$request(1034, {
					curr_page:this.curr_page,
					page_size:this.page_size,
					key:this.value
				}).then(res=>{
					this.list = res.data.data_list
					if(this.list.length > 0){
						this.list.map(item=>{
							item.giftbag_detail_list = JSON.parse(item.giftbag_detail_list)
							const index = item.giftbag_detail_list.length
							that.$set(item,'width',index * 95 + 'px')
							const time = this.getYMDHMS(item.insert_time * 1000)
							this.$set(item,'createTime',time)
						})
					}
				})
			},
			gotoDetails(e){
				uni.navigateTo({
					url:"/pages/mine/give_gift/details/details?id=" + e
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search_box{
		margin: -30upx -28upx 0 -28upx;
		background: #FFFFFF;
		padding: 40upx 60upx 20upx 60upx;
		.search{
			width: 100%;
			border-radius: 30upx;
			background: #F2F3F6;	
			overflow: hidden;
			position: relative;
			.search_input{
				padding: 15upx 20upx;
				width: calc(100% - 160upx);
			}
			.close_input{
				position: absolute;
				right: 60upx;
				top: 12upx;
				width: 40upx;
				height: 40upx;
				z-index: 9;
				font-size: 32upx;
			}
			.search_icon{
				position: absolute;
				right: 20upx;
				top: 16upx;
				width: 40upx;
				height: 40upx;
				z-index: 9;
			}
		}
	}
	.card{
		margin: 20upx;
		background: #FFFFFF;
		border-radius: 10upx;
		.card_body{
			align-items: center;
			padding: 20upx;
			.box{
				width:100%;
			}
			.img_box_box{
				overflow-x: auto;
				.img_box{
					width: 160upx;
					height: 160upx;
					float: left;
					margin-right: 20upx;
					border-radius: 10upx;
					overflow: hidden;
				}
			}
			.text-right_box{
				width: 100upx;
				height: 160upx;
				line-height: 160upx;
				text-align: right;
				box-shadow: -30upx 0 40upx 0upx #FFFFFF;
				.text-right{
					font-size: 24upx;
					font-weight: 400;
					color: #AAAAAA;
					display: block;
				}
			}
			
		}
		.item_name{
			margin-top: 20upx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.group{
				width: 220upx;
				height: 40upx;
				background: linear-gradient(180deg, #E7C799 0%, #B7862A 100%);
				border-radius: 6upx;
				color: #FFFFFF;
				display: flex;
				.cell{
					width: 96upx;
					text-align: center;
					font-size: 22upx;
					line-height: 40upx;
					
				}
				.text{
					background: #FFFFFF;
					color: #B7862A;
					text-align: center;
					width: 122upx;
					height: 36upx;
					line-height: 36upx;
					margin-top: 2upx;
					border-radius: 0 6upx 6upx 0;
				}
			}
			.date_text{
				font-size: 24upx;
				font-weight: 400;
				color: #9A9A9A;
			}
		}	
		.item_footer{
			margin-top: 20upx;
			text-align: right;
		}
	}
</style>
