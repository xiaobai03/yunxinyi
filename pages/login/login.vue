<template>
	<view class="content">
		<view class="login">
			<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/login.png"
				style="width: 100%;height:100%"></image>
			<view class="btn" @click="getUserInfo()">微信登录</view>
		</view>
		<popup v-model="add" position="bottom" ref="lvvpopref">
			<view class="popupBg"  style="width: 100%;height: 50vh;background:#fff;left:0;bottom:0;">
				<view class="title">填写手机号</view>
				<view class="body">
					<!-- <view style="height: 150upx;width: 500upx;margin:20upx auto">
						<input type="text" @keypress="keyFn" ref="input" style="width: 100%;border-bottom:2upx solid #d9d9d9" placeholder="请输入手机号"  v-model="mobile"/>
					</view>
					<button class="btn_mobile_a" @click="getPhoneNumber">登录</button>
					 -->
					<view style="padding:50upx 100upx">
						<image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/weixin_icon.png"
							class="weixin_icon" style="width:120upx;height:120upx"></image>
						<button class="btn_mobile_a" open-type="getPhoneNumber"
							@getphonenumber="getPhoneNumber">一键获取手机号</button>
					</view>
				</view>
			</view>
		</popup>
	</view>
</template>
<script>
	import popup from '@/components/lvv-popup/lvv-popup.vue'
	export default {
		components: {
			popup
		},
		data() {
			return {
				role:1,
				add:false,
				// showMobile: false,
				id: 0,
				content:'',
				userInfo: {},
				code_text: '获取验证码',
				disabled: false,
				form: {
					mobile: ''
				},
				title:'',
				sign:'',
				mobile: '',
				customStyle: {
					minWidth: '100rpx'
				}
			};
		},
		onLoad(e) {
			if(e.sign) this.sign = e.sign
			console.log(e)
		},
		methods: {
			keyFn(e){
				if (e.keyCode === 13) this.$refs.input.blur();
			},
			getUserInfo() {
				const that = this
				// 获取用户信息
				uni.getUserProfile({
					desc: 'Wexin', // 这个参数是必须的
					success: res => {
						const data = res.rawData
						uni.setStorageSync('userInfo', data)
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								that.$request(1005, {
									js_code: loginRes.code
								}).then(res => {
									
									that.userInfo.obj = {}
									that.userInfo.obj.openid = res.data.openid
									that.userInfo.obj.session_key = res.data.session_key
									that.userInfo.obj.unionid = res.data.unionid
									
								})
							}
						});
						this.userInfo.user = res.userInfo
						// this.showMobile = true
						that.add = true
						console.log(1)
						
					}
				})
			},
			getPhoneNumber(e) {
				const that = this
				that.$request(1006, {
					session_key: that.userInfo.obj.session_key,
					encrypted_data: e.detail.encryptedData,
					iv: e.detail.iv
				}).then(res => {
					that.userInfo.mobile = res.data.phoneNumber
					that.login(res.data.phoneNumber)
				})
			},
			// getPhoneNumber() {
			// 	this.login(this.mobile)
			// },
			login(mobile){
				const that = this
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				this.$request(1003, {
					mobile:mobile,
					nick_name:userInfo.nickName,
					wx_openid:that.userInfo.obj.openid,
					icon_url:userInfo.avatarUrl,
					gender:userInfo.userInfo,
					province_name:userInfo.province,
					city_name:userInfo.city
				}).then(res=>{
					uni.setStorageSync('token', res.data.token)
					uni.setStorageSync('mobile', res.data.mobile)
					uni.setStorageSync('nick_name', res.data.nick_name)
					uni.setStorageSync('real_name', res.data.real_name)
					uni.setStorageSync('uid', res.data.id)
					uni.setStorageSync('openid', that.userInfo.obj.openid)
					uni.setStorageSync('boss_uid', res.data.boss_uid)
					if(res.code == 0){
						uni.showToast({
							title:'登录成功！'
						})
						setTimeout(()=>{
							if(that.sign) {
								uni.navigateBack({
									delta:1
								})
								
							}else{
								uni.switchTab({
									url:'/pages/home/home'
								})
							}
							
						},1000)
					}else{
						uni.showToast({
							title:'登录失败！'
						})
					}
				})
			},



		}
	}
</script>

<style lang="scss">
	.login {
		width: 750upx;
		height: 100vh;
	}

	.btn {
		position: fixed;
		bottom: 200upx;
		width: 550upx;
		left: 100upx;
		height: 80upx;
		background: #F6E5E5;
		box-shadow: 0px -12px 24px -12px rgba(217, 217, 217, 0.5);
		border-radius: 38upx;
		border: 2upx solid #D04442;
		line-height: 76upx;
		text-align: center;
		font-weight: 500;
		color: #D04442;
	}

	.btn_mobile {
		position: fixed;
		bottom: 100upx;
		width: 550upx;
		left: 100upx;
		height: 80upx;
		border-radius: 38upx;
		line-height: 76upx;
		text-align: center;
		font-weight: 500;
		color: #D04442;
	}

	.form_mobile {
		padding: 200upx 30upx 0;
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

	.weixin_icon {
		width: 100upx;
		height: 100upx;
		display: block;
		margin: 30px auto;
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
				align-items: center;
				justify-content: center;
				height: calc(50vh - 100upx);
			}
	    }
</style>
