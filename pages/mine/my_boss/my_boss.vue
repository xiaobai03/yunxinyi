<template>
	<view class="content">
		<view class="content_text">
			您将成为{{obj.boss_name}}的发货助理！是否同意？
		</view>
		
		<view class="btn_box">
			<view class="btn" @click="btnFun(1)">同意</view>
			<view class="btn_a" @click="btnFun(2)">拒绝</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				obj:{}
			}
		},
		onLoad(option){
			
			this.obj = {
				boss_uid:option.boss_uid,
				sign:option.sign,
				boss_name:option.boss_name,
			}
			console.log(this.obj,0)
			const token = uni.getStorageSync('token')
			if(!token){
				uni.navigateTo({
					url:`/pages/login/login?sign=${option.sign}&boss_name=${option.boss_name}&boss_uid${option.boss_uid}`
				})
			}
		},
		onShow(){
			console.log(this.obj)
			
		},
		methods: {
			btnFun(e){
				const that = this
				if(e === 1){
					that.$request(1047,{
						boss_uid:that.obj.boss_uid,
						sign:that.obj.sign
					}).then(res=>{
						
						uni.showToast({
							title:`您已成为${that.obj.boss_name}的发货助理！`
						})
						uni.setStorageSync('boss_uid',res.data.boss_uid)
						uni.switchTab({
							url:'/pages/home/home'
						})
					})
				}else{
					uni.showModal({
					    title: '提示',
					    content: `您将拒绝成为${that.obj.boss_name}的发货助理？`,
					    success: function (res) {
					        if (res.confirm) {
								uni.showToast({
									title:`您已拒绝成为${that.obj.boss_name}的发货助理！`
								})
								uni.switchTab({
									url:'/pages/home/home'
								})
					        }
					    }
					});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.content_text{
		text-align: center;
		padding: 100upx 0;
	}
	.btn_box{
		width: 650upx;
		margin: 100upx auto;
		.btn{
			width: 100%;
			height: 80upx;
			background: #D04442;
			box-shadow: 0px -12upx 24upx -12upx rgba(217, 217, 217, 0.5);
			border-radius: 40upx;
			border: 2upx solid #D04442;
			line-height: 76upx;
			color: #FFFFFF;
			text-align: center;
			font-weight: 500;
		}
		.btn_a{
			width: 100%;
			height: 80upx;
			text-align: center;
			background: #F6E5E5;
			box-shadow: 0px -12upx 24upx -12upx rgba(217, 217, 217, 0.5);
			border-radius: 40upx;
			border: 2upx solid #D04442;
			line-height: 76upx;
			color: #D04442;
			margin-top: 50upx;
			font-weight: 500;
		}
	}
</style>
