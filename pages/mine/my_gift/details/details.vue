<template>
	<view class="content">
		<view class="img_box">
			<image :src="form.pics" class="img_img"></image>
		</view>
		<view class="card" style="margin-top: 30upx;">
			<view class="card_body">
				<view class="kucun">有效天数：{{form.validity_day}}天</view>
				<view class="xiangqing">
					<view>
						名称：{{form.name}}
					</view>
				</view>
				<view class="xiangqing">
					<view>详情：
						<view v-html="form.content"></view>
					</view>
				</view>
			</view>
			<view class="card_footer">
				<view class="btn_box">
					<view class="save_btn" @click="delForm()">删除礼品</view>
				</view>
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
			this.$request(1017,{
				id:option.id
			}).then(res=>{
				this.form = res.data
			})
		},
		methods: {
			delForm(){
				const that = this
				uni.showModal({
				    title: '提示',
				    content: '确认删除当前礼品吗？',
					confirmColor: '#D04442',
				    success: function (res) {
				        if (res.confirm) {
				            that.$request(1015,{
				            	id:that.form.id
				            }).then(res=>{
				            	uni.showToast({
				            		title:'删除成功！',
									icon:'success'
				            	})
								setTimeout(()=>{
									that.goBack()
								},1000)
				            })
				        } else if (res.cancel) {
				           uni.showToast({
				           	title:'已取消',
				           	icon:'none'
				           })
				        }
				    }
				});
				
			}
		}
	}
</script>

<style scoped lang="scss">
.img_box{
		height: 800upx;
		overflow: hidden;
		margin: -28px -28upx 0;
		.img_img{
			width: 100%;
			height: 800upx;
		}
	}
	.card{
		background: #FFFFFF;
		.card_body{
			padding: 40upx;
			.kucun{
				font-size: 22upx;
				font-weight: 400;
				color: #B7852A;
				margin-bottom: 20upx;
			}
		}
		.card_footer{
			padding: 20upx;
			.btn_box{
				margin-top: 26upx;
				padding: 0 116upx;
				.save_btn{
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
		}
	}
	
	
</style>
