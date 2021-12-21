<template>
	<view class="content">
		<view class="yulan_box">
			<image :src="hekaobj.pics" class="bg_img"></image>
			<image :src="mosicIcon" @click="playOrStop()" class="music_icon" :class="{active:audioPlay == true}"></image>
			<view ref="text" class="heka_text_box" :class="{down:hekaobj.style.animation == 'downshow'}" :style="{'top':hekaobj.style.position[1] + 'px','left':hekaobj.style.position[0] + 'px','width':hekaobj.style.width}">
				<view class="heka_text" :class="hekaobj.animation" :style="{'font-size':hekaobj.style.fontSize}">
					<textarea style="padding-bottom: 20upx;width:100%" :disabled="true" v-model="hekaobj.content"></textarea>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="item" v-for="(item,index) in footerList" :key="index" @click="gotoPage(index)">
				<view class="icon_box">
					<image :src="item.icon" class="footer_icon" mode="aspectFit"></image>
				</view>
				<view class="footer_text">{{item.text}}</view>
			</view>
		</view>
		<luch-audio class="audio" :play.sync="audioPlay" :src="hekaobj.music" :autoplay="audioPlay"></luch-audio>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hekaobj:{},
				audioPlay:true,
				showModal:true,
				items:[],
				lianxirenList:[],
				showSelect:false,
				real_name:'',
				canvas_text:'',
				parsonName:'',
				card_id:'',
				mosicIcon:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/music_icon.png',
				footerList:[
					{icon:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edityulan_icon1.png',text:'编辑一下'},
					{icon:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edityulan_icon2.png',text:'换张贺卡'},
					{icon:'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/edityulan_icon3.png',text:'下一步'},
				]
			}
		},
		onLoad(option) {
			this.getinfo(option.id)
		},
		onShow() {
			
		},
		methods: {
			playOrStop(){
				this.audioPlay = !this.audioPlay
			},
			getinfo(id){
				const that = this
				this.$request(1018,{id:id}).then(res=>{
					that.hekaobj = res.data
					that.hekaobj.style = JSON.parse(that.hekaobj.style)
					setTimeout(()=>{
						if(that.hekaobj.music) {
							that.audioPlay = true	
						}
					},500)
				})
			},
			addmyheka(e){
				console.log(e)
				const that = this
				const data  = {}
				data.card_id = that.hekaobj.id
				data.title = that.hekaobj.title
				data.tags = that.hekaobj.tags
				data.pics = that.hekaobj.pics
				data.music = that.hekaobj.music
				data.content = that.hekaobj.content
				data.style = JSON.stringify(that.hekaobj.style)
				that.$request(1021,data).then(res=>{
					that.$request(1024,{
						curr_page:1,
						page_size:100,
					}).then(res=>{
						if(res.code == 0){
							const arr = res.data.data_list.filter(item=>{return item.card_id == that.hekaobj.id})
							if(e == 0){
								uni.navigateTo({
									url:'/pages/greeting_card/edit_more/edit_more?id=' + arr[arr.length - 1].id
								})
								that.audioPlay = false
							}else{
								uni.setStorageSync('card_id',arr[arr.length - 1].id)
								that.audioPlay = false
								uni.switchTab({
									url:'/pages/gift_bag/gift_bag'
								})
							}
						}
					})
					
				})
				
			},
			gotoPage(i){
				if(i == 0){
					this.addmyheka(i)
				}else if(i == 1){
					uni.navigateBack({
						delta:1
					})
				}else{
					this.addmyheka(i)
				}
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.yulan_box{
		height: calc(100vh - 100upx);
		position: relative;
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
			animation-iteration-count:10000
		}
	}
	.heka_text_box{
		color: #FFFFFF;
		position: absolute;
		z-index: 99;
	}
	.down{
		transition: all 1s ease-in-out;
	}
	.heka_text{
		margin-top:0;
		color: #FFFFFF;
	}
	@keyframes myfirst
	{
	    from {transform: rotate(0);}
	    to {transform: rotate(360deg)}
	}
	.footer{
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		display: flex;
		left: 0;
		height: 100upx;
		justify-content: center;
		align-items: center;
		.item{
			width: 180upx;
			text-align: center;
			.icon_box{
				width:50upx;
				height: 42upx;
				margin: 0 auto;
				.footer_icon{
					width: 50upx;
					height: 42upx;
				}
			}
			.footer_text{
				font-size: 20upx;
				font-weight: 400;
				color: #333333;
				margin-top: 10upx;
			}
		}
	}
	.audio{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 200upx;
		opacity: 0;
		z-index: 0;
	}
</style>
