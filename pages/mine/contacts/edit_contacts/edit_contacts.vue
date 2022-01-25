<template>
	<view  class="contents">
			<view class="contacts_box">
			<form @submit="formSubmit">
				<view class="uni-form-item">
					<view class="label">头像</view>
					<view class="input_box"  @click="uploadImg">
						<view v-if="!form.logo" class="cell_tx"></view>
						<image v-else :src="form.logo" class="cell_tx"></image>
					</view>
					<view class="right_arr">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
				<view class="uni-form-item">
					<view class="label">姓名</view>
					<view class="input_box">
						<input placeholder="请输入" @keypress="keyFn" v-model="form.realname"  name="realname"/>
					</view>
					<view class="right_arr">
						<!-- <image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image> -->
					</view>
				</view>
				<view class="uni-form-item" >
					<view class="label">性别</view>
					<view class="input_box">
						<picker mode="selector" :range="array" @change="chageGender">
							<input placeholder="请选择" readonly="readonly" v-model="form.genderName" disabled/>
							
						</picker>
					</view>
					<view class="right_arr">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
				<view class="uni-form-item" >
					<view class="label">手机号</view>
					<view class="input_box">
						<input placeholder="请输入" @keypress="keyFn" v-model="form.tel"  name="tel"/>
					</view>
					<view class="right_arr">
						<!-- <image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image> -->
					</view>
				</view>
				<view class="uni-form-item" >
					<view class="label">生日</view>
					<view class="input_box">
						<input placeholder="请选择生日" readonly="readonly" @click="showDate = true" :disabled="true"  v-model="form.birthday"/>
					</view>
					<view class="right_arr">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
				<view class="uni-form-item">
					<view class="label ">收货地址</view>
					<view class="input_box">
						<input placeholder="省、市、区、街道" @keypress="keyFn" ref="input" readonly="readonly"
							v-model="address1" @click="openPicker()" :disabled="true" />
					</view>
					<view class="right_arr">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png" class="right_access"></image>
					</view>
				</view>
				<view class="uni-form-item block" style="border: 0;">
					<view class="label ">详细地址</view>
					<view class="input_box">
						<textarea class="textarea_border" @keypress="keyFn" ref="input" placeholder="请输入收货地址" v-model="address2"/>
					</view>
				</view>
				<view class="btn_box">
					<button class="save_btn" form-type="submit">保存</button>
				</view>
			</form>
			 <popup v-model="showDate" position="bottom" ref="lvvpopref">
				<view class="popupBg"  style="width: 100%;height: 55vh;background:#fff;left:0;bottom:0;">
					<view class="body">
						 <uni-calendar 
						 style="width: 710upx;height: 50vh;"
							 :insert="true"
							 :lunar="true" 
							 :end-date="'2021-7-11'"
							 @change="change"
							  />
					</view>
				</view>
			 </popup>
		</view>
		<lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
	</view>
</template>

<script>
	import popup from '@/components/lvv-popup/lvv-popup.vue'
	import COS from '@/static/js/cos-wx-sdk-v5.js'
	import lotusAddress from "@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue";
	export default {
		components: {
			popup,
			lotusAddress
		},
		data() {
			return {
				showDate: false,
				mode: 'date',
				date: '',
				endDate:'',
				show:false,
				headerText: '添加联系人',
				array: ['男','女'],
				form: {
					logo: '',
					realname: '',
					genderName:'',
					gender:10,
					tel: '',
					birthday: '',
					address: ''
				},
				address1:'',
				address2:'',
				lotusAddressData: {
					visible: false,
					provinceName: '',
					cityName: '',
					townName: '',
				},
			}
		},
		created() {
			this.cos = new COS({
				SecretId:'AKIDpTr0uXu0pOghT1II1TigOp0vZw2rPhjV',
				SecretKey: 'WliQq0uZz4sPfeMoztWsyoNgneEXZLq4',
			});
			
		},
		onLoad(option) {
			this.$request(1012, {
				id:option.id,
			}).then(res=>{
				console.log(res.data)
				this.form = res.data
				if(this.form.gender == '1') this.form.genderName = '男'
				if(this.form.gender == '2') this.form.genderName = '女'
			})
		},
		onShow() {
			var date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			this.endDate = `${year}-${month}-${day}`
		},
		methods: {
			keyFn(e){
				if (e.keyCode === 13) this.$refs.input.blur();
			},
			chageGender(e){
				
				if(e.target.value == '0') this.form.gender = 1
				if(e.target.value == '1') this.form.gender = 2
				this.form.genderName = this.array[e.target.value]
			},
			openPicker() {
				this.lotusAddressData.visible = true;
				this.lotusAddressData.provinceName = '北京';
				this.lotusAddressData.cityName = '北京市';
				this.lotusAddressData.townName = '东城区';
			},
			//回传已选的省市区的值
			choseValue(res) {
				//res数据源包括已选省市区与省市区code
				this.lotusAddressData.visible = res.visible; //visible为显示与关闭组件标识true显示false隐藏
				//res.isChose = 1省市区已选 res.isChose = 0;未选
				if (res.isChose) {
					this.form.provinceName = this.lotusAddressData.provinceName = res.province; //省
					this.lotusAddressData.cityName=this.form.cityName = res.city; //市
					this.lotusAddressData.townName = this.form.townName = res.town; //区
					this.address1 = `${res.province} ${res.city} ${res.town}`;
				}
			},
			formSubmit() {
				const form = this.form
				this.form.address = this.address1 + this.address2
				if(form.realname && form.gender && form.tel && form.birthday && form.logo){
					this.$request(1009, this.form).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title:'编辑成功！',
								icon:'success'
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta:2
								})
							},2000)
						}
					})
				}else{
					uni.showToast({
						title:'请完善信息',
						icon:"none"
					})
				}
			},
			uploadImg(data){
				console.log(data)
				const that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						let filePath = res.tempFiles[0].path;
						let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
						that.cos.postObject({
								Bucket: 'yxy-1306997902',
								Region: 'ap-nanjing',
								Key: 'xiaochengxu-update/' + filename,
								FilePath: filePath     
						}, 
						function (err, data) {
							that.form.logo = data.headers.location
						})
					}
				});
			},
			change(e) {
				this.form.birthday = e.fulldate
				this.showDate = false
			}
		}
	}
</script>

<style lang="scss">
		.btn_box {
			margin-top: 136upx;
			padding: 0 116upx;

			.save_btn {
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

			.default_btn {
				display: block;
				background: #FFFFFF;
				border: 2upx solid #979797;
				border-radius: 80upx;
				height: 76upx;
				width: 100%;
				text-align: center;
				line-height: 76upx;
				color: #333333;
				font-weight: 500;
				margin-top: 30upx;
			}
		}
	.contacts_box{
		padding: 30upx;
	}
	.uni-form-item{
		display: flex;
		padding: 30upx 0;
		align-items: center;
		border-bottom: 2upx solid #f1f1f1;
		.label{
			width: 200upx;
				line-height: 48upx;
			font-weight: 500;
		}
		
		.input_box{
			width: 100%;
			.cell_tx {
				width: 142upx;
				height: 142upx;
				border-radius: 142upx;
				background: #f1f1f1;
			}
		}
		.right_arr{
			width: 50upx;
			text-align: right;
			.right_access{
				width: 12upx;
				height: 20upx;
			}
		}
	}
	.block.uni-form-item{
		display: block;
		.label{
			margin-bottom: 10upx;
			width: 200upx;
				line-height: 48upx;
			font-weight: 500;
		}
		.input_box{
			width: 100%;
			.cell_tx {
				width: 142upx;
				height: 142upx;
				border-radius: 142upx;
				background: #f1f1f1;
			}
			.textarea_border{
				width: calc(100% - 20upx);
				padding: 10upx;
				height: 100upx;
				border:2upx solid #e6e6e6;
				border-radius: 10upx;
			}
		}
		.right_arr{
			width: 50upx;
			text-align: right;
			.right_access{
				width: 12upx;
				height: 20upx;
			}
		}
		
	}
	
	.popupBg{
		background: #f8f8f8;
		position: absolute;
		padding: 20rpx;
		.title{
			font-size: 30upx;
			font-weight: bold;
			text-align: center;
			line-height: 100upx;
		}
		.body{
			display: flex;
			flex-flow: column;
			height: calc(55vh - 50upx);
			overflow: hidden;
		}
	}
</style>
