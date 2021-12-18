<template>
	<view>
		<view class="content" v-if="!showDetails">
			<view class="form_box">
				 <form @submit="formSubmit">
					 <view class="uni-form-item">
					 	<view class="label">名称</view>
					 	<view class="input_box">
					 		<input placeholder="请输入礼品名称" @keypress="keyFn" ref="input" v-model="form.name"  name="name"/>
					 	</view>
					 </view>
					 <view class="uni-form-item block">
					 	<view class="label">封面</view>
					 	<view class="input_box">
					 		<view class="update_box" @click="success">
					 			<image v-if="!form.pics" src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/upload.png" mode="update_icon"></image>
					 			<image v-else :src="form.pics" class="update_img"></image>
					 		</view>
					 	</view>
					 </view>
					 <view class="uni-form-item block">
					 	<view class="label">礼品介绍：</view>
						<view class="beizhu">备注：请在下⾯直接输⼊⽂字介绍，点击图⽚⼩图标可上传图⽚或视频，每次上传⼀张。</view>
					 	<view class="input_box">
					 		<view class="edit_box">
					 			<view class="edit_header" >
					 				<i v-for="(item,index) in formatsList" @click="changeText(item,index)" :key="index" :style="item.value ? 'color:#D04442' : ''" class="iconfont"
					 				:class="item.className"
					 					:data-name="item.name" :data-value= 'item.value'></i>
					 				<i class="iconfont icon-charutupian"  data-name="image" @touchend.stop="insertImage"></i>
					 			</view>
					 			<editor id="editor" @blur="getContent" class="ql-container" :placeholder="placeholder"
					 				@ready="onEditorReady"></editor>
					 		</view>
					 	</view>
					 </view>
					 <view class="uni-form-item">
					 	<view class="label">领取时效</view>
					 	<view class="input_box">
					 		<picker mode="selector" :range="array" @change="changeTimes">
					 			<input placeholder="请选择" @keypress="keyFn" ref="input" style="width:calc(100% - 50upx);float:left" readonly="readonly"  v-model="form.dayName" disabled />
								<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					 		</picker>
					 	</view>
					 </view>
					 <view class="uni-form-item">
					 	<view class="label">发货助理</view>
					 	<view class="input_box" style="position: relative;">
					 		<picker mode="selector" :range="zhuliListName" @change="changeZhu" style="width: 250upx;">
					 			<input placeholder="请选择" style="width: 210upx;float: left;" @keypress="keyFn" ref="input" readonly="readonly" v-model="form.assetsName" disabled />
								<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
							</picker>
							<button class="share_btn" data-name="shareBtn" open-type="share">邀请发货助理</button>
					 	</view>
					 </view>
					 <view class="btn_box">
						 <view class="btn_left" @click="submit(1)">预览</view>
						 <view class="btn_right" @click="submit(2)">保存</view>
					 </view>
				  </form>
			</view>
		</view>
		<view class="content" v-if="showDetails">
			<view class="img_box">
				<image :src="form.pics" class="img_img"></image>
			</view>
			<view class="card" style="margin-top: 30upx;">
				<view class="card_body">
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
						<view class="save_btn" @click="submit(2)">保存</view>
						<view class="save_btn_a"  @click="showDetails = false">修改礼品</view>
					</view>
				</view>
			</view>
		</view>
		<view class="modal_box" :class="modal_box_show">
			<view class="modal">
				<view class="modal_body">您的礼品已保存</view>
				<view class="modal_footer">
					<view class="confirmText" @click="cancel">确定</view>
					<view class="cancelText" @click="confirm">再添加礼品</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import COS from '@/static/js/cos-wx-sdk-v5.js'
	export default {
		data() {
			return {
				showDetails:false,
				modal_box_show:'',
				formats: {
					bold: false,
					left: false,
					italic: false,
					justify: false,
				
				},
				array: ['7天','15天','30天','60天','90天'],
				zhuliList:[],
				cos: null,
				formatsList:[
					{	
						className:'icon-zitijiacu',
						name:'bold',
						value:false
					},
					{
						className:'icon-zitixieti',
						name:'italic',
						value:false
					},{
						className:'icon-zuoduiqi',
						name:'left',
						value:false
					}
				],
				placeholder: '开始输入...',
				form:{
					name:'',
					pics:'',
					content:'',
					stock:999,
					dayName:'15天',
					sender_uid:'0',
					assetsName:'自己',
					validity_day:'15'
				},
				obj:{},
				zhuliListName:[]
			}
		},
		created() {
			this.cos = new COS({
				SecretId:'AKIDpTr0uXu0pOghT1II1TigOp0vZw2rPhjV',
				SecretKey: 'WliQq0uZz4sPfeMoztWsyoNgneEXZLq4',
			});
		},
		onLoad() {
			this.getAssets()
			this.$request(1046).then(res=>{
				this.obj.boss_uid = res.data.boss_uid
				this.obj.sign = res.data.sign
				this.obj.boss_name = res.data.boss_name
			})
		},
		methods: {
			getAssets(){
				this.zhuliList  = [
					{
						sender_uid:0,
						assetsName:'自己'
					}
				]
				this.$request(2001).then(res=>{
					if(res.data.length > 0){
						res.data.map(item=>{
							const obj = {}
							obj.sender_uid = item.id
							obj.assetsName = item.real_name
							this.zhuliList.push(obj)
						})
					}
					this.zhuliListName = this.zhuliList.map(item=> item.assetsName)
					this.form.assetsName = this.zhuliList[0].assetsName
					this.form.sender_uid = this.zhuliList[0].sender_uid
				})
				
			},
			changeTimes(e){
				uni.hideKeyboard()
				this.form.dayName = this.array[e.target.value]
				if(e.target.value == 0) this.form.validity_day = 7
				else if(e.target.value == 1) this.form.validity_day = 15
				else if(e.target.value == 2) this.form.validity_day = 30
				else if(e.target.value == 3) this.form.validity_day = 60
				else if(e.target.value == 4) this.form.validity_day = 90
			},
			changeZhu(e){
				uni.hideKeyboard()
				this.form.assetsName = this.zhuliList[e.target.value].assetsName
				this.form.sender_uid = this.zhuliList[e.target.value].sender_uid
			},
			keyFn(e){
				if (e.keyCode === 13) this.$refs.input.blur();
			},
			submit(e){
				const form = this.form
				const that = this
					if(e == 1){
						this.showDetails = true
					}else if(e ==2){
						this.modal_box_show = 'modal_box_show'
						this.$request(2000,this.form).then(res=>{
							if(res.code == 0){
								that.modal_box_show = 'modal_box_show'
							}
						})
						
					}
			},
			onShareAppMessage: function(e) {
					const that = this
					let title = `${that.obj.boss_name}邀请您为他的发货助理！`
					let provider = 'weixin'
					let scene = "WXSceneSession"
					let path = `/pages/mine/my_boss/my_boss?boss_name=${that.obj.boss_name}&boss_uid=${that.obj.boss_uid}&sign=${that.obj.sign}`
					// let path = `/pages/home/home?boss_name=${that.obj.boss_name}&boss_uid=${that.obj.boss_uid}&sign=${that.obj.sign}`
					let imageUrl = 'https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/zhuli.png'
					return {
						title: title,
						provider:provider,
						scene:scene,
						type:1,
						path: path,
						imageUrl:imageUrl
					}
				},
			confirm() {
				this.modal_box_show = ''
				this.showDetails = false
				this.form = {
					name:'',
					pics:'',
					content:'',
					day:'15',
					sender_uid:'0',
					assetsName:'自己',
					validity_day:'15天'
				}
				this.editorCtx.setContents({html:''})
			},
			cancel() {
				this.modal_box_show = ''
				uni.navigateBack({
					delta: 1
				})
			},
			success(data) {
				const that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						let filePath = res.tempFiles[0].path;
						let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
						that.cos.postObject({
								Bucket: 'yxy-1306997902',
								Region: 'ap-nanjing',
								Key: 'xiaochengxu-update/' + filename,
								FilePath: filePath     
						}, 
							function(err, data) {
								that.form.pics = data.headers.location
							})
					}
				});
			},
			onEditorReady() {
				const that = this
				// #ifdef APP-PLUS || H5 ||MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					this.editorCtx.setContents({
						html: that.form.content
					})
				}).exec()
				// #endif
			},
			changeText(item,index){
				this.formatsList[index].value = !this.formatsList[index].value
				const name = this.formatsList[index].name
				const value = this.formatsList[index].value
				this.editorCtx.format(name, value);
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset;
				if (!name) return;
				this.editorCtx.format(name, value);
			},
			getContent(e) {
				this.form.content = e.detail.html
			},
			insertImage() {
				const that = this;
				uni.chooseImage({
					count: 1,
					success: function(res) {
						let filePath = res.tempFiles[0].path;
						let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
						that.cos.postObject({
								Bucket: 'yxy-1306997902',
								Region: 'ap-nanjing',
								Key: 'xiaochengxu-update/' + filename,
								FilePath: filePath     
						}, 
							function(err, data) {
								that.editorCtx.insertImage({
									src: data.headers.location,
									data: {
										id: 'abcd',
										role: 'god'
									},
									width: '100%',
									success: function() {
										uni.showToast({
											title:'上传成功！',
											icon:"success"
										})
									}
								})
							})
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.form_box{
		padding-top: 20upx;
		.uni-form-item{
			display: flex;
			padding: 30upx;
			background: #FFFFFF;
			align-items: center;
			border-bottom: 2upx solid #F8F8F8;
			.label{
				width: 200upx;
				line-height: 48upx;
				font-weight: 500;
			}
			.input_box{
				width: 100%;
			}
			.share_btn{
				position: absolute;
				right: 0;
				top: -10upx;
				height: 60upx;
				padding: 10upx 20upx;
				color: #FFFFFF;
				background: #DD524D;
				text-align: center;
				line-height: 40upx;
				width: 230upx;
			}
			.right{
				width: 30upx;
				.right_access{
					width: 12upx;
					height: 20upx;
				}
			}
		}
		.block.uni-form-item{
			display: block;
			.update_box {
				width: 218upx;
				height: 218upx;
				image{
					width: 218upx;
					height: 218upx;
					border-radius: 20upx;
					overflow: hidden;
				}
				.update_img {
					width: 218upx;
					height: 218upx;
				}
			}
			.label{
				margin-bottom: 10upx;
				width: 200upx;
				line-height: 48upx;
				font-weight: 500;
			}
			.beizhu{
				font-size: 24upx;
				color: #666666;
			}
			.textarea_border{
				width: calc(100% - 20upx);
				padding: 10upx;
				height: 100upx;
				border:2upx solid #e6e6e6;
				border-radius: 10upx;
			}
			.edit_box {
				border: 2upx solid #d9d9d9;
				border-radius: 10upx;
			}
			
			#editor {
				width: 100%;
				height: 300upx;
				background-color: #fafafa;
				padding: 30upx;
			}
			
			.edit_header {
				position: relative;
				padding: 20upx 0;
				height: 50upx;
				.iconfont {
					float: left;
					margin: 0 10upx;
				}
				.icon_video {
					display: inline-block;
					padding-top: 6upx;
					padding-left: 10upx;
					image {
						width: 34upx;
						height: 34upx;
					}
				}
			}
		}
		.btn_box{
			width: 690upx;
			margin: 30upx auto;
			display: flex;
			.btn{
				width: 100%;
				margin: 20upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				color: #FFFFFF;
				background: #DD524D;
				border-radius: 10upx;
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
		}
	}
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
					.save_btn_a{
						margin-top: 15upx;
						background: #F6E5E5;
						color: #D04442;
						display: block;
						border-radius: 80upx;
						height: 80upx;
						width: 100%;
						text-align: center;
						line-height: 80upx;
						font-weight: 500;
					}
				}
			}
		}
		
		.modal_box.modal_box_show{
			z-index: 9;
			display: flex;
		}
		.modal_box{
			width: 100vw;
			min-height:100vh;
			background: rgba(0,0,0,.25);
			position: fixed;
			top: 0;
			left: 0;
			display: none;
			justify-content: center;
			align-items: center;
			z-index: -1;
			overflow: hidden;
			transition: .5s all ease-out;
			.modal{
				width: 600upx;
				height: 300upx;
				background: #FFFFFF;
				border-radius: 20upx;
				.modal_body{
					height: 200upx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-flow: column;
					font-size: 32upx;
				}
				.modal_footer{
					width: 100%;
					height: 100upx;
					border-top: 2upx solid #e6e6e6;
					display: flex;
					.confirmText{
						width: 300upx;
						text-align: center;
						line-height: 100upx;
						border-right: 2upx solid #e6e6e6;
						color: #D04442;
						font-size: 30upx;
					}
					.cancelText{
						width: 300upx;
						text-align: center;
						line-height: 100upx;
						font-size: 30upx;
					}
				}
			}
			
		}
		.right_access{
			width: 12upx;
			height: 20upx;
			margin-left: 20upx;
			float: right;
			margin-top: 15upx;
			transform:rotate(90deg)
		}
</style>
