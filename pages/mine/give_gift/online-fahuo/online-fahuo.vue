<template>
	<view class="content">
		<view style="margin:0 30upx;padding-top: 30upx;">
			<view class="u-cell-group">
				<view class="u-cell-item" @click="openBox = !openBox">
					<view class="title">选择快递公司</view>
					<view class="item_body" style="text-align: right;">
						<image :src="selectImg" style="width: 120upx;height:60upx"></image>
					</view>
					<view class="right_arr">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
				<view class="select_box" v-if="openBox">
					<uni-row>
					<uni-col :xs="8" v-for="(item,index) in list" :key="index">
						<view class="text-center">
							<view class="img_box" :class="{active:isActive == index}" @click="select(item,index)">
								<image :src="item.url" style="width: 100%;height: 100upx;"></image>
							</view>
						</view>
					</uni-col>
					</uni-row>
				</view>
				<view class="u-cell-item">
					<view class="title">快递单号</view>
					<view class="item_body">
						<input type="text" @keypress="keyFn" ref="input"  style="text-align: right;" v-model="form.express_no" placeholder="请输入单号" class="input">
					</view>
					<view class="right_arr">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
			</view>
			<view class="save_btn">
				<button class="fx_btn" @click="submit()">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openBox:false,
				isActive:100,
				selectImg:'',
				form: {
					express_company: '',
					express_no:"",
					id:""
				},
				list:[
					{
						id:1,
						name:'顺丰快递',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_1.png'
					},
					{
						id:2,
						name:'中通快递',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_4.png'
					},
					{
						id:3,
						name:'圆通快递',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_2.png'
					},
					{
						id:4,
						name:'韵达快递',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_5.png'
					},{
						id:5,
						name:'申通快递',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_3.png'
					},{
						id:6,
						name:'天天快递',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_6.png'
					},
					{
						id:7,
						name:'EMS',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_8.png'
					},
					{
						id:8,
						name:'京东',
						url:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/kuaidi_7.png'
					}
					
				]
			}
		},
		onLoad(e) {
			this.form.id = e.id
		},
		methods: {
			keyFn(e){
				if (e.keyCode === 13) this.$refs.input.blur();
			},
			select(e,k){
				this.isActive  = k
				this.openBox = false
				this.form.express_company = e.name
				this.selectImg = e.url
			},
			submit(){
				if(!this.form.express_company){
					uni.showToast({
						title:'请选择快递公司',
						icon:'none'
					})
				}else if(!this.form.express_no){
					uni.showToast({
						title:'请输入快递单号',
						icon:'none'
					})
				}else{
					this.$request(1043,{
						id:this.form.id,
						express_company:this.form.express_company,
						express_no:this.form.express_no
					}).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title:'已发货'
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta:2
								})
							},1000)
						}
					})
				}
			}
		}
	}
</script>

<style scoped lang='scss'>
	.select_box{
		padding: 28upx;
		overflow: hidden;
		.text-center{
			text-align: center;
		}
		.img_box{
			width: 100%;
			height: 100upx;
			border: 2upx solid #FFFFFF;
			border-radius: 12upx;
			overflow: hidden;
			margin:10upx 0;
		}
		.img_box.active{
			width: 100%;
			height: 100upx;
			border: 2upx solid red;
			border-radius: 12upx;
			overflow: hidden;
			margin:10upx 0;
		}
	}
	.save_btn{
		display: block;
		background: #D04442;
		border-radius: 80upx;
		height: 80upx;
		width: 100%;
		text-align: center;
		line-height: 80upx;
		color: #FFFFFF;
		margin-top: 100upx;
		font-weight: 500;
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
	
	.u-cell-group{
		background: #FFFFFF;
		border-radius: 10upx;
		.u-cell-item{
			padding:30upx 20upx;
			border-bottom: 2upx solid #e6e6e6;
			display: flex;
			align-items: center;
			.title{
				width: 300upx;
			}
			.item_body{
				width: 100%;
			}
			.right_arr{
				width: 50upx;
				text-align: right;
				.right_access{
					width: 12upx;
					height: 20upx;
				}
			}
		}
	}
</style>
