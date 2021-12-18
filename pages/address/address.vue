<template>
	<view  class="content">
		<view class="content_box_white" style="padding: 30upx; background: #FFFFFF;">
			<form @submit="formSubmit">
				<view class="uni-form-item">
					<view class="label">收件人</view>
					<view class="input_box">
						<input placeholder="请输入" @keypress="keyFn" ref="input"  v-model="form.name" name="name"/>
					</view>
				</view>
				<view class="uni-form-item">
					<view class="label">手机号码</view>
					<view class="input_box">
						<input placeholder="请输入" @keypress="keyFn" ref="input"  v-model="form.mobile"  name="mobile"/>
					</view>
				</view>
				<view class="uni-form-item">
					<view class="label">收件地址</view>
					<view class="input_box">
						<input placeholder="省、市、区、街道" @keypress="keyFn" ref="input" readonly="readonly"  v-model="form.ssq" @click="openPicker()" :disabled="true"/>
					</view>
				</view>
				<view class="uni-form-item">
					<view class="label">详细地址</view>
					<view class="input_box">
						<input placeholder="小区门牌号" @keypress="keyFn" ref="input"  v-model="form.address" name="address"/>
					</view>
				</view>
				<view class="uni-form-item block" style="border:0">
					<view class="label">配送留言</view>
					<view class="input_box">
						<textarea class="textarea_border" @keypress="keyFn" ref="input"  placeholder="请输入" v-model="form.remarks"/>
					</view>
				</view>
				<view class="btn_box" v-if="showBtn">
					<button class="btn" form-type="submit">确定</button>
				</view>
				<view class="btn_box" v-if="!showBtn">
					<button class="btn" form-type="submit">保存</button>
				</view>
			</form>
		</view>
		<lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
	</view>
</template>

<script>
	import lotusAddress from "@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue";
	export default {
		components: {
			"lotus-address": lotusAddress
		},
		data() {
			return {
				form: {
					name:'',
					mobile:'',
					ssq:'',
					address:'',
					remarks:'',
				},
				showBtn:false,
				mode: 'date',
				active:'',
				headerText: '填写收件地址',
				lotusAddressData: {
					visible: false,
					provinceName: '',
					cityName: '',
					townName: '',
				},
			}
		},
		onLoad(option) {
			console.log(option.obj)
			this.form.regard_id = option.id
			const obj = option.obj
			if(option.obj == 'null'){
				this.showBtn = true
				this.form.name = uni.getStorageSync('real_name')
				this.form.mobile = uni.getStorageSync('mobile')
			}else{
				const obj = JSON.parse(option.obj)
				this.showBtn = false
				this.form.name = obj.name
				this.form.mobile = obj.mobile
				this.form.ssq = obj.address1
				this.form.address = obj.address2
				this.form.remarks = obj.message
				this.form.id = obj.id
			}
		},
		methods: {
			keyFn(e){
				if (e.keyCode === 13) this.$refs.input.blur();
			},
			change(e) {
				this.userInfo.birthday = e.result
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
					this.lotusAddressData.provinceName = res.province; //省
					this.lotusAddressData.cityName = res.city; //市
					this.lotusAddressData.townName = res.town; //区
					this.form.ssq = `${res.province} ${res.city} ${res.town}`;
				}
			},
			formSubmit(e) {
				const that = this
				// name:'',
				// mobile:'',
				// ssq:'',
				// address:'',
				// remarks:'',
				if(this.form.name && this.form.mobile && this.form.ssq && this.form.address){
					if(that.showBtn){
						that.$request(1038,{
							regard_id:that.form.regard_id,
							name:that.form.name,
							mobile:that.form.mobile,
							address1:that.form.ssq,
							address2:that.form.address,
							message:that.form.remarks
						}).then(res=>{
							if(res.code == 0){
								uni.navigateTo({
									url:'/pages/huizeng/huizeng'
								})
							}
						})
					}else{
						that.$request(1039,{
							id:that.form.id,
							regard_id:that.form.regard_id,
							name:that.form.name,
							mobile:that.form.mobile,
							address1:that.form.ssq,
							address2:that.form.address,
							message:that.form.remarks
						}).then(res=>{
							if(res.code == 0){
								uni.navigateTo({
									url:'/pages/huizeng/huizeng'
								})
							}
						})
					}
				}else{
					uni.showToast({
						title:'请完善信息',
						icon:"none"
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn_box{
		position: absolute;
		bottom: 200upx;
		left: 0;
		width: 100%;
		.btn{
			height: 80upx;
			background: #D04442;
			border-radius: 78upx;
			line-height: 76upx;
			border: 2upx solid #D04442;
			color: #FFFFFF;
			width: 600upx;
			margin: 0 auto;
		}
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
		.textarea_border{
			width: calc(100% - 20upx);
			padding: 10upx;
			height: 100upx;
			border:2upx solid #e6e6e6;
			border-radius: 10upx;
		}
	}
	.go_home{
		text-align: center;
		position: fixed;
		bottom: 150upx;
		left: 0;
		width: 100%;
		color: #D04442;
	}
</style>
