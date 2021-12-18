<template>
	<view  class="content" style="padding-top: 30upx;padding-left: 30upx;padding-right: 30upx;">
		<view class="card shadow">
				<view class="card_body" style="padding-bottom: 40upx;">
					<view class="edit">
						<image @click="editForm" src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edit.png" class="edit_img">
						</image>
					</view>
					<view class="flex" style="margin-top: -30upx;">
						<view class="box user_tx">
							<image :src="form.logo" class="user_img"></image>
						</view>
						<view class="box">
							<view class="user_name">{{form.realname}}</view>
							<view class="user_info_other">
								<text class=""> 手机 {{form.tel}} </text>
								<text style="margin: 0 20upx;">|</text>
								<text class=""> 生日 {{form.birthday}} </text>
							</view>
						</view>
					</view>
				</view>
				<view class="card_footer">
					<view class="box" style="width: 160upx;">收货地址:</view>
					<view class="box">{{form.address}}</view>
				</view>
			</view>
			<view class="list-box">
				<view class="list_item" @click="gotoPag(index)" v-for="(item,index) in list" :key="index">
					<view class="left">{{item}}</view>
					<view class="right">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
			</view>
			<view class="btn_box">
				<button class="save_btn" @click="del()">删除联系人</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form:{}
			}
		},
		onLoad(option) {
			this.$request(1012, {
				id:option.id,
			}).then(res=>{
				console.log(res.data)
				this.form = res.data
				if(this.form.gender == '1') this.form.genderName = '男'
				if(this.form.gender == '2') this.form.genderName = '女'
			})
		},
		methods: {
			editForm(){
				uni.navigateTo({
					url:"/pages/mine/contacts/edit_contacts/edit_contacts?id=" + this.form.id
				})
			},
			del(){
				this.$request(1010, {
					id:this.form.id
				}).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title:'已删除',
							icon:'success'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.card{
		background: #FFFFFF;
		border-radius: 12upx;
		margin-bottom: 20upx;
	}
	.card .card_body{
		padding: 22upx 14upx;
	}
	.card .card_footer{
		border-top: 2upx solid #f8f8f8;
		padding: 30upx 28upx;
		display: flex;
	}
	.shadow {
		box-shadow: 0px 4upx 26upx 0px rgba(0, 0, 0, 0.09);
		.edit {
			text-align: right;
	
			.edit_img {
				width: 34upx;
				height: 36upx;
				margin-right: 20upx;
				margin-top: 10upx;
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
				}
			}
	
		}
	}
	.btn_box{
		width: 600upx;
		margin: 150upx auto;
		.save_btn {
			display: block;
			background: #D04442;
			border-radius: 80upx;
			height: 80upx;
			width: 100%;
			text-align: center;
			line-height: 80upx;
			color: #FFFFFF;
			font-weight: 500;
		}
	}
		
</style>
