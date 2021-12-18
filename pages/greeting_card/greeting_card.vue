<template>
	<view class="content">
		<view class="tab_box">
			<view class="tab_item"  @click="gotoTab(index)"  v-for="(item,index) in tabs" :key="index">
				<view class="tab_text":class="{active:isActive == index}">{{item}}</view>
				<view class="tab_active" :class="{active:isActive == index}"></view>
			</view>
		</view>
		<view v-if="isActive == 0" style="margin: 100upx 20upx 0 20upx;">
			<uni-row>
			  <uni-col :xs="24" v-if="moreList.length == 0">
			    <view style="height: 200upx;line-height: 200upx;text-align: center;">暂无数据~</view>
			  </uni-col>
			  <uni-col :xs="12" v-else v-for="(item,index) in moreList" :key="index">
			    <view class="card" @click="gotopageMore(item)">
				<image class="item_img" style="width:100%" :src="item.pics"></image>
			      <view class="card_body">
			        <view class="card_title">
			          {{item.title}}
			        </view>
			      </view>
			    </view>
			  </uni-col>
			</uni-row>
		</view>
		<view v-else style="margin: 100upx 20upx 0 20upx;">
			<uni-row>
			  <uni-col :xs="24" v-if="list.length == 0">
			    <view style="height: 200upx;line-height: 200upx;text-align: center;">暂无数据~</view>
			  </uni-col>
			  <uni-col :xs="12" v-else v-for="(item,index) in list" :key="index">
			    <view class="card" @click="gotopage(item)">
				<image class="item_img" style="width:100%" :src="item.pics"></image>
			      <view class="card_body">
			        <view class="card_title">
			          {{item.title}}
			        </view>
			      </view>
			    </view>
			  </uni-col>
			</uni-row>
			
		</view>
		<LoadingMore v-if="list.length > 5 || moreList.length > 5" :lading_text="loadStatus"></LoadingMore>
	</view>
</template>

<script>
	import LoadingMore from '@/components/loadingmore/loadingmore.vue'
	export default {
		components:{LoadingMore},
		data() {
			return {
				tabs:['贺卡模板','我的贺卡'],
				isActive:0,
				list:[],
				moreList:[],
				page_size_self:6,
				page_size:6,
				tag:'',
				
				loadStatus: 'loadmore',
			}
		},
		onLoad() {
			const token = uni.getStorageSync('token')
			if(!token) uni.navigateTo({url:"/pages/login/login"})
			if (this.isActive == 0) {
			  this.getMoreData()
			} else {
				this.getData()
			}
		},
		methods: {
			onReachBottom() {
			  if (this.isActive == 0) {
			    this.loadStatus = 'loading'
			    this.page_size_self += 6
			    // 模拟数据加载
			    setTimeout(() => {
			      this.loadStatus = 'loadmore'
			      this.getMoreData()
			    }, 1000)
			  } else {
			    this.loadStatus = 'loading'
			    this.page_size += 6
			    // 模拟数据加载
			    setTimeout(() => {
			      this.loadStatus = 'loadmore'
				  this.getData()
			      
			    }, 1000)
			  }
			},
			gotoTab(e){
				this.isActive = e
				if(e == 0) this.getMoreData()
				else this.getData() 
			},
			getData() {
			  this.$request(1024, {
			    curr_page: 1,
			    page_size: this.page_size_self,
			  }).then((res) => {
			    this.list = res.data.data_list
			  })
			},
			getMoreData(){
				this.$request(1019, {
				  tag: this.tag,
				  curr_page: 1,
				  page_size: this.page_size,
				}).then((res) => {
				  this.moreList = res.data.data_list
				})
			},
			gotopage(e){
				uni.navigateTo({
					url:'/pages/greeting_card/yulan_card/yulan_card?id=' + e.id
				})
			},
			gotopageMore(e){
				uni.navigateTo({
					url:'/pages/greeting_card/yulan_more/yulan_more?id=' + e.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab_box{
		background: #FFFFFF;
		height: 88upx;
		display: flex;
		position: fixed;
		width: 750upx;
		left: 0;
		top: 0;
		z-index: 99;
		.tab_item{
			margin:0 30upx;
			line-height: 88upx;
			.tab_text{
				font-size: 32upx;
				font-weight: 400;
			}
			.tab_active{
				width: 130upx;
				height: 12upx;
				background: transparent;
				margin-top: -32upx;
			}
			.tab_active.active{
				background: linear-gradient(to right, #a33e3c, #ffffff);
			}
			.tab_text.active{
				font-weight: 500;
			}
			
		}
	}
	.card{
		overflow: hidden;
		margin: 20upx;
		border-radius: 10upx;
		background: #FFFFFF;
		.card_body{
			padding: 15upx;
		}
	}
</style>
