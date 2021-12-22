<template>
	<view class="content">
		<view class="yulan_box">
			<image :src="hekaobj.pics" class="bg_img"></image>
			<image :src="mosicIcon" @click="playOrStop()" class="music_icon" :class="{active:audioPlay == true}"></image>
			<view ref="text" class="heka_text_box" :class="{down:hekaobj.style.animation == 'downshow'}" :style="{'top':hekaobj.style.position[1] +'px','left':hekaobj.style.position[0] + 'px','width':hekaobj.style.width}">
				<view class="heka_text" :class="hekaobj.animation" :style="{'font-size':hekaobj.style.fontSize}">
					<textarea style="padding-bottom: 20upx;width:100%" :disabled="true" v-model="hekaobj.content"></textarea>
				</view>
			</view>
		</view>
		<luch-audio class="audio" :play.sync="audioPlay" :src="hekaobj.music" :autoplay="audioPlay"></luch-audio>
		<view class="btn_box">
			<view class="btn" @click="chakan">查看心意</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hekaobj:{},
				obj:{},
				audioPlay:true,
				mosicIcon:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_icon.png',
			}
		},
		onShow() {
			setTimeout(()=>{
				if(this.hekaobj.music) this.audioPlay = true	
			},500)
		},
		onLoad(option) {
			const that = this
			console.log(option)
			this.obj.uid = option.uid
			this.obj.sign = option.sign
			this.obj.id = option.id
			// that.obj = {
			// 	sign:'ebe4b0f5a90e45993b44ca7513c6248a',
			// 	id:173,
			// 	uid:1
			// }
			this.$request(1031,that.obj).then(res=>{
				if(res.code == 0){
					this.dataObj = res.data
					this.hekaobj = res.data.cardInfo
					uni.setStorageSync('to_name',res.data.to_name)
					this.hekaobj.style = JSON.parse(res.data.cardInfo.style)
					const token = uni.getStorageSync('token')
					const uid = uni.getStorageSync('uid')
					let text = ''
					if(this.dataObj.status == 2) text = '礼品已经被领取啦！'
					else if(this.dataObj.status == 3) text = '礼品已经被拒绝啦！'
					if(this.dataObj.to_uid != 0){
						if(this.dataObj.to_uid != uid){
							uni.showModal({
							    title: '提示',
							    content: `${text}`,
								showCancel:false,
								confirmColor:"#D04442",
							    success: function (res) {
							        if (res.confirm) {
							           uni.switchTab({
											url:'/pages/home/home'
							           })
							        }
							    }
							});
						}else if(!token){
							uni.showModal({
							    title: '提示',
							    content: `${text}`,
								showCancel:false,
								confirmColor:"#D04442",
							    success: function (res) {
							        if (res.confirm) {
							           uni.switchTab({
											url:'/pages/home/home'
							           })
							        }
							    }
							});
						}
					}
					
				}else{
					uni.showModal({
					    title: '提示',
					    content: `${res.text}`,
						showCancel:false,
						confirmColor:"#D04442",
					    success: function (res) {
					        if (res.confirm) {
					           uni.switchTab({
					           	url:'/pages/home/home'
					           })
					        }
					    }
					});
				}
				
			}) 
		},
		methods: {
			playOrStop(){
				this.audioPlay = !this.audioPlay
			},
			getinfo(id){
				const that = this
				this.$request(1025,{id:id}).then(res=>{
					that.hekaobj = res.data
					that.hekaobj.style = JSON.parse(that.hekaobj.style)
					setTimeout(()=>{
						if(that.hekaobj.music) {
							that.audioPlay = true	
						}
					},500)
				})
			},
			chakan(){
				uni.navigateTo({
					url:"/pages/chakan_gift/chakan_gift?obj=" + JSON.stringify(this.obj)
				})
				this.audioPlay = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		overflow: hidden;
	}
	.yulan_box{
		height: 100vh;
		position: relative;
		margin-left: -30upx;
		margin-right: -30upx;
		.bg_img{
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;
		}
		.music_icon{
			width: 72upx;
			height: 72upx;
			position: absolute;
			right: 30upx;
			top: 30upx;
			z-index: 2;
		}
		.music_icon.active{
			animation: myfirst 1s;
			animation-iteration-count:1000
		}
		.audio{
			width: 100%;
			position: absolute;
			left: 0;
			right: 0;
			z-index: 0;
			opacity: 0;
		}
		
	}
	.heka_text_box {
		color: #FFFFFF;
		width: 600upx;
		border: 2upx solid transparent;
		position: fixed !important;
		z-index: 1000000;
		padding: 10upx;
		top: 10000upx;
		left: 72upx;
	}
	.heka_text{
		margin-top:0;
	}
	.down {
		transition: all 1s ease-in-out;
	}
	.animation_down{
		animation: downshow 1s;
		animation-iteration-count: 1
	}
	@keyframes downshow {
		from {
			margin-top: 1000px;
		}
	
		to {
			margin-top: 0;
		}
	}
	@keyframes myfirst
	{
	    from {transform: rotate(0);}
	    to {transform: rotate(360deg)}
	}
	.btn_box{
		width: 600upx;
		height: 80upx;
		position: absolute;
		bottom: 100upx;
		left: 75upx;
		z-index: 9;
		.btn{
			width: 100%;
			height: 80upx;
			background: #D04442;
			box-shadow: 0px 4upx 16upx 0px rgba(0, 0, 0, 0.44);
			border-radius: 40upx;
			text-align: center;
			color: #FFFFFF;
			line-height: 80upx;
			border: 0;
		}
	}
</style>
