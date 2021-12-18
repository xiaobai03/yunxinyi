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
				<view v-if="list.length > 0">
					<view class="btn_box_box">
						<view class="btn_left btns" @click="subFun(1)">添加礼品</view>
						<view class="btn_right btns" @click="subFun(2)">上传新礼品</view>
					</view>
					<button class="btn_center_a" v-if="disabled" @click="selectCard">选择贺卡</button>
					<button class="btn_center_a" v-else @click="openModal()">选好了，发送给朋友</button>
				</view>
				<view v-else>
					<view style="font-style: 26upx;text-align: center;margin-bottom: 10upx;color: #999;">可将多个礼品放在一个礼包里
					</view>
					<view class="btn_center" @click="gotoPage()">挑选⼀件礼品</view>
					<!-- <button class="btn_center_a" @click="openModal()">选好了，发送给朋友</button> -->
				</view>
			</view>
		</view>
		<popup v-model="showModal" position="bottom" ref="lvvpopref">
			<view class="popupBg" style="width: 100%;height: 50vh;background:#fff;left:0;bottom:0;">
				<view class="title">即将生成微信贺卡封面</view>
				<view class="body">
					<view style="height: 100upx;width: 500upx;margin:20upx auto">
						<view class="input_boxes">
							<input type="text" class="input_box" @focus="inputFocus" @input="inputInput"
								@keypress="keyFn" placeholder="请输入收件人姓名或昵称" v-model="parsonName" />
							<view class="input_btn" @click="generate" v-if="showBtnes">确定</view>
							<view class="input_btn" @click="repeatInput" v-else>重新输入</view>
						</view>
						<view class="select_box" v-if="showSelect">
							<radio-group @change="radioChange">
								<label class="select_item" v-for="(item, index) in lianxirenList" :key="item.realname">
									<view>
										<radio :value="item.realname" :checked="index === current" />
									</view>
									<view>{{item.realname}}</view>
								</label>
							</radio-group>
						</view>

						<canvas canvas-id="imgCanvas" id="imgCanvas">
						</canvas>
					</view>
					<button v-if="showBtn" class="btn_mobile_a" data-name="shareBtn" open-type="share">赠送礼品</button>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	import tSlide from "@/components/t-slide/t-slide.vue"
	import delSlideLeft from '@/components/ay-operate/del_slideLeft.vue'
	import popup from '@/components/lvv-popup/lvv-popup.vue'
	export default {
		components: {
			tSlide,
			delSlideLeft,
			popup
		},
		data() {
			return {
				showModal: false,
				list: [],
				disabled: false,
				parsonName: '',
				showSelect: false,
				showBtnes: true,
				text: '亲启',
				current: 100,
				items: [],
				lianxirenList: [],
				//左滑默认宽度
				delBtnWidth: 80,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				showBtn: false,
				hekaobj: {},
				giftbagDetailList: [],
				real_name: '',
				imageUrl: '',
				canvas_text: '',
				shareObj: {}
			}
		},
		onLoad(option) {
			this.real_name = uni.getStorageSync('real_name')
		},
		onShow() {
			this.getData()
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
			radioChange(evt) {
				this.parsonName = evt.detail.value
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].realname === evt.detail.value) {
						this.current = i;
						break;
					}
				}
				this.showSelect = false
			},
			gotoPage() {
				uni.navigateTo({
					url: '/pages/mine/my_gift/my_gift'
				})
			},
			repeatInput() {
				this.parsonName = ''
				this.showBtn = false
				this.showBtnes = true
			},
			getlianxirenList() {
				this.$request(1011, {
					curr_page: 1,
					page_size: 100,
				}).then((res) => {
					this.lianxirenList = this.items = res.data.data_list
				})
			},
			inputFocus() {
				this.showBtn = false
				this.showSelect = true
				this.showBtnes = true
			},
			inputInput(e) {
				this.lianxirenList = []
				this.items.map(item => {
					if (item.realname.includes(e.target.value)) {
						this.lianxirenList.push(item)
					}
				})
			},
			openModal() {
				this.getlianxirenList()
				const that = this
				this.giftbagDetailList = []
				this.list.map(item => {
					const obj = {}
					obj.id = parseInt(item.id)
					obj.quantity = item.quantity
					this.giftbagDetailList.push(obj)
				})
				const data = {}
				data.card_id = that.hekaobj.id
				data.call = that.parsonName
				data.content = that.hekaobj.content
				data.giftbagDetailList = that.giftbagDetailList
				this.$request(1030, data).then(res => {
					that.shareObj.id = res.data.id
					that.shareObj.sign = res.data.sign
					that.shareObj.uid = res.data.uid
				})
				this.showModal = true
			},
			generate() {
				uni.showToast({
					title: '正在生成封面图片',
					icon: 'loading'
				})
				this.showBtnes = false
				const that = this
				uni.getImageInfo({
					src: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/xinfeng.png'
				}).then(res => {
					that.canvas_text = that.parsonName + '亲启';
					const ctx = uni.createCanvasContext('imgCanvas');
					ctx.drawImage(res[1].path, 0, -30, 375, 336) // 底图
					ctx.font = 'bold 30rpx serif'
					ctx.setTextAlign('left')
					ctx.setFillStyle("#d9d9d9")
					ctx.fillText(that.canvas_text, 30, 80)
					ctx.setTextAlign('right')
					ctx.setFillStyle("#d9d9d9")
					ctx.fillText(that.real_name + '赠', 350, 240)
					ctx.draw()
					setTimeout(() => {
						that.saveImage()
					}, 50)
				})
			},
			saveImage() {
				const that = this
				uni.canvasToTempFilePath({
					canvasId: 'imgCanvas',
					fileType: 'jpg',
					x: 0,
					y: 0,
					width: 750,
					height: 612,
					destWidth: 375,
					destHeight: 336,
					success: function(res) {
						uni.setStorageSync('fenxiangImg', res.tempFilePath)
						that.imageUrl = res.tempFilePath
						that.showBtn = true
					},
				})
			},
			onShareAppMessage(e) {
				const that = this
				const img = uni.getStorageSync('fenxiangImg')
				let title = ''
				let provider = 'weixin'
				let scene = "WXSceneSession"
				let path =
					`/pages/chakan_card/chakan_card?id=${that.shareObj.id}&uid=${that.shareObj.uid}&sign=${that.shareObj.sign}`
				let imageUrl = that.imageUrl
				setTimeout(() => {
					uni.setStorageSync('card_id', 0)
					uni.setStorageSync('fenxiangImg', '')
					that.parsonName = ''
					that.showModal = false
					uni.navigateTo({
						url: '/pages/greeting_card/success/success'
					})
				}, 2000)
				return {
					title: title,
					provider: provider,
					scene: scene,
					type: 1,
					path: path,
					imageUrl: imageUrl
				}
			},
			getData() {
				if (uni.getStorageSync('card_id')) {
					this.disabled = false
					this.$request(1025, {
						id: uni.getStorageSync('card_id')
					}).then(res => {
						this.hekaobj = res.data
						this.hekaobj.style = JSON.parse(this.hekaobj.style)
					})
				} else {
					this.disabled = true
				}
				const that = this
				this.$request(1029, {
					curr_page: 1,
					page_size: 100
				}).then(res => {
					if (res.code == 0) {
						that.list = res.data.data_list
						that.list.map(item => {
							item.quantity = parseInt(item.quantity)
							that.$set(item, 'right', 0)
						})
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
				console.log(item)
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

	.popupBg {
		background: #f8f8f8;
		position: absolute;
		padding: 20rpx;

		.title {
			font-size: 30upx;
			font-weight: bold;
			text-align: center;
			line-height: 100upx;
			height: 100upx;
		}

		.body {
			display: flex;
			flex-flow: column;
			align-items: center;
			// justify-content: center;
			height: calc(50vh - 100upx);

			.input_boxes {
				position: relative;
				height: 80upx;

				.input_box {
					margin: 20upx auto;
					width: 470upx;
					color: #333333;
					padding-left: 30upx;
					font-size: 26upx;
					border-radius: 40upx;
					line-height: 80upx;
					height: 80upx;
					background: #F1F1F1;
				}

				.input_btn {
					width: 120upx;
					text-align: center;
					height: 80upx;
					line-height: 80upx;
					color: #FFFFFF;
					background: #D04442;
					position: absolute;
					top: 0;
					right: 0;
					z-index: 9999;
					border-radius: 0 40upx 40upx 0;
				}
			}

			.select_box {
				height: calc(50vh - 200upx);
				overflow-y: auto;

				.select_item {
					border-bottom: 2upx solid #d9d9d9;
					display: flex;
					padding: 20upx;
					align-items: center;
				}
			}

			#imgCanvas {
				opacity: 0;
				// background: url(../../static/images/xinfeng.png) no-repeat;
				// background-size: 100% 100%;
				width: 750upx;
				height: 632upx;
				margin-top: -100upx;
				margin-left: -120upx;
				position: fixed;
				top: -632rpx;
				left: -750upx;
			}

			.btn_mobile_a {
				width: 500upx;
				margin: 20upx auto;
				height: 80upx;
				border-radius: 38upx;
				line-height: 76upx;
				text-align: center;
				box-shadow: 0px -12px 24px -12px rgba(217, 217, 217, 0.5);
				background: #D04442;
				border: 2upx solid #D04442;
				font-size: 26upx;
				color: #ffffff;
			}
		}
	}

	button[disabled]:not([type]) {
		background-color: #F1F1F1;
		color: rgba(0, 0, 0, .3);
	}
</style>
