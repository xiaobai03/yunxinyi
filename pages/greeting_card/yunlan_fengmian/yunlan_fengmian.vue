<template>
	<view class="content">
		<view class="select_box" v-if="showModal">
			<input type="text" @input="inputInput"  @focus="inputFocus" class="input_box" placeholder="请输入收件人姓名或昵称" v-model="parsonName" />
			<view class="select_boxes" v-if="showSelect">
				<view v-if="lianxirenList.length == 0" style="text-align: center;line-height: 200upx;">暂无联系人,请输入</view>
				<radio-group @change="radioChange" v-else>
					<label class="select_item" v-for="(item, index) in lianxirenList" :key="item.realname">
						<view>
							<radio :value="item.realname" :checked="index === current" />
						</view>
						<view>{{item.realname}}</view>
					</label>
				</radio-group>
			</view>
			<view class="img_box">
				<view class="first_name">{{parsonName}}亲启</view>
				<view class="last_name">{{real_name}}赠</view>
			</view>
			<canvas canvas-id="imgCanvas"  id="imgCanvas"></canvas>
			<view class="sure_btn" @click="generate">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showModal:true,
				items:[],
				lianxirenList:[],
				showSelect:false,
				real_name:'',
				canvas_text:'',
				parsonName:'',
				card_id:'',
			}
		},
		onLoad(option) {
			this.active = option.active
			this.card_id = option.id
		},
		onShow() {
			this.real_name = uni.getStorageSync('real_name')
		},
		methods: {
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
			getlianxirenList() {
				this.$request(1011, {
					curr_page: 1,
					page_size: 100,
				}).then((res) => {
					this.lianxirenList = this.items = res.data.data_list
				})
			},
			inputInput(e) {
				this.lianxirenList = []
				this.items.map(item => {
					if (item.realname.includes(e.target.value)) {
						this.lianxirenList.push(item)
					}
				})
			},
			inputFocus() {
				this.showSelect = true
				this.getlianxirenList()
			},
			generate() {
				
				const that = this
				if(!this.parsonName) {
					uni.showToast({
						title:'请输入收礼人',
						icon:'none'
					})
				}else{
					uni.getImageInfo({
						src: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/xinfeng.png'
					}).then(res => {
						that.canvas_text = that.parsonName + '亲启';
						const ctx = uni.createCanvasContext('imgCanvas');
						ctx.drawImage(res[1].path, 0, -30, 437, 366) // 底图
						ctx.font = 'bold 30rpx serif'
						ctx.setTextAlign('left')
						ctx.setFillStyle("#d9d9d9")
						ctx.fillText(that.canvas_text, 30, 80)
						ctx.setTextAlign('right')
						ctx.setFillStyle("#d9d9d9")
						ctx.fillText(that.real_name + '赠', 350, 200)
						ctx.draw()
						setTimeout(() => {
							that.saveImage()
						}, 50)
					})
				}
				
			},
			saveImage() {
				const that = this
				uni.canvasToTempFilePath({
					canvasId: 'imgCanvas',
					fileType: 'jpg',
					x: 0,
					y: 0,
					width: 874,
					height: 714,
					destWidth: 437,
					destHeight: 366,
					success: function(res) {
						console.log(res.tempFilePath)
						uni.setStorageSync('fenxiangImg', res.tempFilePath)
						uni.setStorageSync('personName', that.parsonName)
						if(that.active == 0){
							uni.navigateTo({
								url:`/pages/greeting_card/yulan_more/yulan_more?id=${that.card_id}`
							})
						}else{
							uni.navigateTo({
								url:'/pages/greeting_card/yulan_card/yulan_card?id=' + that.card_id
							})
						}
					},
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.select_box{
		padding: 30upx;
		position: relative;
		.input_box {
			margin: 20upx auto;
			color: #333333;
			padding-left: 30upx;
			font-size: 26upx;
			border-radius: 40upx;
			line-height: 80upx;
			height: 80upx;
			background: #FFFFFF;
			border: 2upx solid #3F536E;
		}
		.select_boxes {
			height: 360upx;
			overflow-y: auto;
			background-color: #FFFFFF;
			.select_item {
				border-bottom: 2upx solid #d9d9d9;
				display: flex;
				padding: 20upx;
				align-items: center;
			}
		}
		#imgCanvas{
			width: 750upx;
			height: 662upx;
			opacity: 0;
			position: fixed;
			top:-632upx;
			left: -750upx;
		}
		.img_box{
			position: relative;
			width: 680upx;
			height: 520upx;
			background: url('https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/xinfeng.png') no-repeat;
			background-size: 100% 100%;
			.first_name{
				position: absolute;
				top: 100upx;
				left: 30upx;
				color: #f5f5f5;
				font-size: 40upx;
			}
			.last_name{
				position: absolute;
				bottom: 150upx;
				right: 60upx;
				font-size: 40upx;
				color: #f5f5f5;
			}
		}
		
		.sure_btn{
			width: 650upx;
			position: fixed;
			bottom: 100upx;
			left: 50upx;
			border-radius: 40upx;
			line-height: 80upx;
			color: #FFFFFF;
			text-align: center;
			background: #D04442;
			box-shadow: 0px 4upx 16upx 0px rgba(0, 0, 0, 0.44);
		}
	}
</style>
