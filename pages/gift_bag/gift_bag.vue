<template>
	<view class="content">
		<view class="box_body">
			<view v-for="(item,index) in list" :key="index">
				<delSlideLeft :item="item" :data_transit="{index:index,item:item}" @delItem="delItem">
					<view class="content_body">
						<view class="item_left">
							<image mode="aspectFill" :src="item.pics" />
						</view>
						<view class="item_body">
							<text class="title">{{ item.name }}</text>
						</view>
						<view class="right">
							<view class="group">
								<text class="group_item group_item_a" @click="prve(item)"> - </text>
								<text class="group_item">{{item.quantity}}</text>
								<text class="group_item group_item_b" @click="add(item)"> + </text>
							</view>
						</view>
					</view>
				</delSlideLeft>
			</view>
			<view class="btn_box">
				<view v-if="card_id && card_id > 0">
					<view class="btn_box_box " v-if="list.length > 0">
						<view class="btn_left btns" @click="subFun(1)">添加礼品</view>
						<view class="btn_right btns" @click="subFun(2)">上传新礼品</view>
					</view>
					<view v-if="list.length == 0">
						<view style="font-style: 26upx;text-align: center;margin-bottom: 10upx;color: #999;">可将多个礼品放在一个礼包里</view>
						<button class="btn_center_a"  @click="gotoPage">挑选⼀件礼品</button>
					</view>
					<button class="btn_center_a" v-else data-name="shareBtn" open-type="share">发送给微信好友</button>
				</view>
				<view v-else>
					<button class="btn_center" @click="selectCard">请先选择贺卡</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import delSlideLeft from '@/components/ay-operate/del_slideLeft.vue'
	export default {
		components: {
			delSlideLeft,
		},
		data() {
			return {
				list: [],
				showModal:false,
				personName:'',
				hekaobj: {},
				giftbagDetailList: [],
				shareObj: {},
				card_id:'',
				lipinName:'',
			}
		},
		onLoad(option) {
			
		},
		onShow() {
			if(uni.getStorageSync('card_id')){
				this.card_id = uni.getStorageSync('card_id')
				this.personName = uni.getStorageSync('personName')
				this.$request(1025, {
					id: this.card_id
				}).then(res => {
					this.hekaobj = res.data
					this.hekaobj.style = JSON.parse(this.hekaobj.style)
					this.getData()
				})
			}else{
				this.card_id = uni.getStorageSync('card_id')
				this.list = []
			}
		},
		created() {
			const that = this
			const token = uni.getStorageSync('token')
			if (!token) {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		},
		methods: {
			selectCard() {
				uni.switchTab({
					url: '/pages/greeting_card/greeting_card'
				})
			},
			
			gotoPage() {
				uni.navigateTo({
					url: '/pages/mine/my_gift/my_gift'
				})
			},
			openModal(){
				this.showModal = true
				const name = this.list.map(item=>{ return item.name})
				this.lipinName = name.join(',')
				// this.getSign()
			},
			getSign(){
				const that = this
				const data = {}
				data.card_id = that.hekaobj.id
				data.call = uni.getStorageSync('personName')
				data.content = that.hekaobj.content
				data.giftbagDetailList = that.giftbagDetailList
				that.$request(1030, data).then(res => {
					that.shareObj.id = res.data.id
					that.shareObj.sign = res.data.sign
					that.shareObj.uid = res.data.uid
				})
			},
			onShareAppMessage() {
				const that = this
				let img = uni.getStorageSync('fenxiangImg')
			    const promise = new Promise(resolve => {
			      this.getSign()
				  uni.showToast({
				  	title:'加载中...',
					icon:'loading'
				  })
			      setTimeout(() => {
			        resolve({
					title: '',
					scene:'WXSceneSession',
					provider:'weixin',
					imageUrl: img,
					 path : `/pages/chakan_card/chakan_card?id=${that.shareObj.id}&uid=${that.shareObj.uid}&sign=${that.shareObj.sign}`
			        })
			      }, 1000)
			    })
				setTimeout(() => {
						uni.setStorageSync('card_id', '')
						uni.setStorageSync('fenxiangImg', '')
						uni.navigateTo({
							url: '/pages/greeting_card/success/success'
						})
					}, 2000)
			    return {
			      title: '',
				  scene:'WXSceneSession',
				  provider:'weixin',
				  imageUrl: uni.getStorageSync('fenxiangImg'),
			      promise 
			    }
			  },
			getData() {
				const that = this
				this.$request(1029, {
					curr_page: 1,
					page_size: 100
				}).then(res => {
					if (res.code == 0) {
						that.list = res.data.data_list
						if(that.list.length > 0){
							that.giftbagDetailList = []
							that.list.map(item => {
								item.quantity = parseInt(item.quantity)
								that.$set(item, 'right', 0)
								const obj = {}
								obj.id = parseInt(item.id)
								obj.quantity = parseInt(item.quantity)
								that.giftbagDetailList.push(obj)
							})
						}
					}
				})
			},
			subFun(e) {
				const that = this
				if (e === 1) {
					uni.navigateTo({
						url: '/pages/mine/my_gift/my_gift'
					})
				} else {
					uni.navigateTo({
						url: '/pages/mine/my_gift/my_gift'
					})
				}
			},
			add(item, index) {
				const that = this
				this.$request(1068, {
					gid: item.gid,
					quantity: 1,
				}).then(res => {
					if (res.code != 0) {
						uni.showToast({
							title: res.text,
							icon: "none"
						})

					}
					that.getData()
				})
			},
			prve(item, index) {
				const that = this
				this.$request(1069, {
					gid: item.gid,
					quantity: 1,
				}).then(res => {
					if (res.code != 0) {
						uni.showToast({
							title: res.text,
							icon: "none"
						})
					}
					that.getData()
				})

			},
			delItem(item) {
				const that = this
				uni.showModal({
					title: '提示',
					content: '是否删除当前礼品？',
					confirmColor: '#D04442',
					success: function(res) {
						if (res.confirm) {
							that.$request(1027, {
								id: item.item.id
							}).then(res => {
								if (res.code == 0) {
									that.getData()
								}
							})
						} else {
							that.getData()
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.box_body {
		overflow: hidden;
		padding-top: 40upx;

		.t-wrap {
			width: 100%;
			display: flex;
			position: relative;
			align-items: right;
			flex-direction: row;
			margin-bottom: 8upx;
		}

		.content_body {
			width: 100%;
			margin: 0 auto;
			text-align: center;
			display: flex;
			padding: 20upx;
			border-radius: 20upx;
			overflow: hidden;
			background: #FFFFFF;
			// align-items: center;

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
				width: 280upx;

				.title {
					text-align: left;
					font-size: 28rpx;
					color: #333333;
					margin-left: 20upx;
					margin-top: 10upx;
					font-weight: 500;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}

			.right {
				width: 200upx;

				.group {

					margin-left: 20upx;
					margin-right: 30upx;
					display: flex;
					margin-top: 60upx;

					.group_item {
						display: block;
						min-width: 54upx;
						padding: 0 10upx;
						height: 54upx;
						text-align: center;
						line-height: 54upx;
						border: 2upx solid #d9d9d9;
						margin-left: -2upx;
						color: #131313;
					}

					.group_item_a {
						border-radius: 12upx 0 0 12upx;
					}

					.group_item_b {
						border-radius: 0 12upx 12upx 0;
					}

					.group_item_c {
						border-radius: 12upx;
					}
				}

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
					margin-top: 60upx;
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

		.btn_center_a {
			width: 638upx;
			text-align: center;
			height: 80upx;
			background: #D04442;
			box-shadow: 0px -12upx 24upx -12upx rgba(217, 217, 217, 0.5);
			border-radius: 40upx;
			border: 2upx solid #D04442;
			line-height: 76upx;
			color: #FFFFFF;
			font-weight: 500;
			margin-top: 40upx;
		}

		.btn_center {
			width: 640upx;
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
	button[disabled]:not([type]) {
		background-color: #F1F1F1;
		color: rgba(0, 0, 0, .3);
	}
</style>
