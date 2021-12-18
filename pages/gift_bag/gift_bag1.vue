<template>
	<view class="content">
		<input type="text" class="input_box" style="background: red" @keypress="keyFn" placeholder="请输入"  v-model="parsonName"/>
		<view @click="generate" style="text-align: center;height:100upx;line-height: 100upx;">确定</view>
		<canvas canvas-id="imgCanvas" id="imgCanvas">
		</canvas>
		<image :src="imageUrl" mode="aspectFit" style="width: 750upx;"></image>
	</view>
</template>

<script>
	import tSlide from "@/components/t-slide/t-slide.vue"
	import popup from '@/components/lvv-popup/lvv-popup.vue'
	export default {
		components: {
			tSlide,
			popup
		},
		data() {
			return {
				showModal: false,
				list: [],
				disabled:false,
				parsonName:'',
				text:'亲启',
				//左滑默认宽度
				delBtnWidth: 80,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				hekaobj:{},
				giftbagDetailList:[],
				real_name:'',
				imageUrl:'',
				canvas_text:'',
				shareObj:{}
			}
		},
		onShow() {
			this.real_name = '王老三'
		},
		methods: {
			generate() {
				const that = this
				uni.getImageInfo({
				  src: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/xinfeng.png'
				}).then(res =>{
					that.canvas_text = that.parsonName + '亲启';
					const ctx = uni.createCanvasContext('imgCanvas');
					ctx.drawImage(res[1].path, 0, 0, 375, 306)// 底图
					ctx.font = 'bold 30rpx serif'
					ctx.setTextAlign('left')
					ctx.setFillStyle("#333333")
					ctx.fillText(that.canvas_text, 30, 80)
					ctx.setTextAlign('right')
					ctx.setFillStyle("#d9d9d9")
					ctx.fillText(that.real_name + '赠', 350,240)
					ctx.draw()
					setTimeout(()=>{
						that.saveImage()
					},50)
				})
			},
			saveImage(){
				const that = this
					uni.canvasToTempFilePath({
						canvasId: 'imgCanvas',
						fileType: 'jpg',
						x: 0,
						y: 0,
						width: 750,
						height: 612,
						destWidth: 375,
						destHeight: 306,
						success: function(res) {
							that.imageUrl = res.tempFilePath
							uni.setStorageSync('fenxiangImg',res.tempFilePath)
							return
							// 在这里保存图片
						},
					})
			},
		}
	}
</script>

<style lang="scss">
	#imgCanvas {
		opacity: 1;
		width: 750upx;
		height: 612upx;
	}
		
</style>
