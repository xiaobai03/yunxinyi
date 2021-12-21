<template>
	<view class="content">
		<view class="yulan_box" @click="maopao">
			<image :src="hekaobj.pics" class="bg_img"></image>
			<view class="tishi_text" :class="hidden">双击文字进行编辑</view>
			<image :src="mosicIcon" @click.stop="playOrStop()" class="music_icon" :class="{active:audioPlay == true}">
			</image>
			<view  class="heka_text_box" 
			:class="{down:hekaobj.style.animation == 'downshow',border:disabled == false,move:move} "
			:style="'left:'+moveX+'px;top:'+moveY+'px'"
			@touchstart="drag_start"
			@touchmove.prevent="drag_hmove" @click.stop="handClick(index)">
				<textarea class="heka_text" :disabled="disabled" v-model="hekaobj.content"></textarea>
			</view>
			<view class="btn_box">
				<view class="btn" @click="yulan">预览</view>
			</view>
		</view>
		<view class="footer">
			<!-- <view class="item">
				<picker mode="selector" :range="array" @change="change_anmition">
					<view class="icon_box">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edit_a.png" class="footer_icon" mode="aspectFit"></image>
					</view>
					<view class="footer_text">添加动画</view>
				</picker>
			</view> -->
			<view class="item" >
				<picker mode="selector" :range="music" @change="change_music">
					<view class="icon_box">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edit_c.png" class="footer_icon" mode="aspectFit"></image>
					</view>
					<view class="footer_text">背景音乐</view>
				</picker>
			</view>
		</view>
		<luch-audio class="audio" :play.sync="audioPlay" :src="hekaobj.music" :autoplay="audioPlay"></luch-audio>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hekaobj: {},
				lastTapTimeoutFunc: null,
				lastTapDiffTime: 0,
				audioPlay: true,
				disabled: true,
				array:[],
				hidden:'',
				moveY:1000,
				moveX:36,
				move:'',
				list: [{
					name: '钢琴曲-当爱来临.mp3',
					value:1,
					url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_new_1.mp3'
				},
				{
					name: '钢琴曲-Shining Smile闪亮的微笑.mp3',
					value:2,
					url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_new_2.mp3'
				},{
					name: '管弦乐-新春乐.mp3',
					value:3,
					url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_new_3.mp3'
				},{
					name: '交响音乐-普天同庆.mp3',
					value:4,
					url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_new_4.mp3'
				},{
					name: '民乐大合奏-花好月圆.mp3',
					value:5,
					url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_new_5.mp3'
				},{
					name: '民乐大合奏-龙飞凤舞.mp3',
					value:6,
					url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_new_6.mp3'
				},{
					name: '民乐大合奏-紫竹调.mp3',
					value:6,
					url: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_new_7.mp3'
				}],
				array:['是','否'],
				music:['钢琴曲-当爱来临.mp3','钢琴曲-Shining Smile闪亮的微笑.mp3','管弦乐-新春乐.mp3','交响音乐-普天同庆.mp3','民乐大合奏-花好月圆.mp3','民乐大合奏-龙飞凤舞.mp3','民乐大合奏-紫竹调.mp3'],
				windowWidth:'',
				windowHeight:'',
				mosicIcon: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_icon.png',
				footerList: [{
						icon: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edit_a.png',
						text: '添加动画'
					},
					{
						icon: 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edit_c.png',
						text: '背景音乐'
					},
				]
			}
		},
		onLoad(option) {
			this.getinfo(option.id)
		},
		onShow() {
			const { windowWidth, windowHeight } = uni.getSystemInfoSync();
			this.windowWidth = windowWidth
			this.windowHeight = windowHeight
			setTimeout(()=>{
				this.hidden = 'hidden'
			},5000)
		},
		methods: {
			playOrStop() {
				this.audioPlay = !this.audioPlay
			},
			handClick(index) {
				let _this = this;
				let curTime = new Date().getTime();
				let lastTime = _this.lastTapDiffTime;
				_this.lastTapDiffTime = curTime;
				let diff = curTime - lastTime;
				if (diff < 300) {
					clearTimeout(_this.lastTapTimeoutFunc);
					_this.disabled = false
				}
			},
			maopao() {
				this.disabled = true
				this.move = ''
			},
			drag_start(event){
				this.move = 'move'
			},
			yulan(){
				const that = this
				const data = {}
				data.id = this.hekaobj.id
				data.title = this.hekaobj.title
				data.tags = this.hekaobj.tags
				data.pics = this.hekaobj.pics
				data.music = this.hekaobj.music
				data.content = this.hekaobj.content
				data.style = JSON.stringify(this.hekaobj.style)
				this.$request(1022, data).then(res => {
					if (res.code == 0) {
						uni.reLaunch({
							url:`/pages/greeting_card/yulan_card/yulan_card?id=${data.id}&showPage=true`
						})
						that.audioPlay = false
					}
				})
			},
			drag_hmove(event){
			        let  tag    = event.touches;
			        if(tag[0].clientX < 0 ) tag[0].clientX = 0
			        if(tag[0].clientY < 0 ) tag[0].clientY = 0
			        if(tag[0].clientX > this.windowWidth ) tag[0].clientX = this.windowWidth
			        if(tag[0].clientY > this.windowHeight ) tag[0].clientY = this.windowHeight
			        this.moveX  = tag[0].clientX;
			        this.moveY  = tag[0].clientY;
					this.hekaobj.style.position[0] =  this.moveX 
					this.hekaobj.style.position[1] =  this.moveY
			},
			change_anmition(e){
				if(e.target.value== 0) this.hekaobj.style.animation = 'downshow'
				if(e.target.value== 1) this.hekaobj.style.animation = ''
			},
			change_music(e){
				const name = this.music[e.target.value]
				const array = this.list.filter(item=>{return item.name == name})
				this.hekaobj.music = array[0].url
			},
			getinfo(id) {
				const that = this
				this.$request(1025,{id:id}).then(res=>{
					that.hekaobj = res.data
					that.hekaobj.style = JSON.parse(that.hekaobj.style)
					this.moveY = this.hekaobj.style.position[1]
					this.moveX = this.hekaobj.style.position[0]
					setTimeout(()=>{
						if(that.hekaobj.music) {
							that.audioPlay = true	
						}
					},500)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.yulan_box {
		height: calc(100vh - 100upx);
		position: relative;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.tishi_text{
			width: 750upx;
			position: absolute;
			z-index: 99;
			bottom: 200upx;
			left: 0;
			text-align: center;
			transition: 1s all ease-out;
			color: #FFFFFF;
		}
		.tishi_text.hidden{
			display: none;
		}
		
		.music_icon {
			width: 72upx;
			height: 72upx;
			position: absolute;
			right: 30upx;
			top: 30upx;
			z-index: 2;
		}
		.music_icon.active {
			animation: myfirst 1s;
			animation-iteration-count: 10000
		}
		.bg_img {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;
		}
		.heka_text_box {
			color: #FFFFFF;
			width: 600upx;
			border: 2upx solid transparent;
			position: fixed !important;
			z-index: 1000000;
			padding: 10upx;
			
		}
		
		.heka_text_box.border {
			border: 2upx solid #d9d9d9;
		}
		.down {
			transition: all 1s ease-in-out;
		}
		.move{
			transition:inherit;
		}
		.heka_text {
			margin-top: 0;
			color: #FFFFFF;
			line-height: 1.7;
			font-size: 36upx;
		}
		.btn_box{
			position: absolute;
			bottom: 60upx;
			left: 50upx;
			width: 650upx;
			height: 80upx;
			z-index: 99;
			.btn{
				border-radius: 40upx;
				line-height: 80upx;
				color: #FFFFFF;
				text-align: center;
				background: #D04442;
				box-shadow: 0px 4upx 16upx 0px rgba(0, 0, 0, 0.44);
			}
		}
		
	}



	@keyframes myfirst {
		from {
			transform: rotate(0);
		}

		to {
			transform: rotate(360deg)
		}
	}
	.footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		display: flex;
		left: 0;
		height: 100upx;
		justify-content: center;
		align-items: center;

		.item {
			width: 180upx;
			text-align: center;

			.icon_box {
				width: 50upx;
				height: 42upx;
				margin: 0 auto;

				.footer_icon {
					width: 50upx;
					height: 42upx;
				}
			}

			.footer_text {
				font-size: 20upx;
				font-weight: 400;
				color: #333333;
				margin-top: 10upx;
			}
		}
	}

	.audio {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 200upx;
		opacity: 0;
		z-index: 0;
	}
</style>
