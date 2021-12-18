<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		created() {
			uni.getSystemInfo({
				success: function (res) {
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					model.forEach(item => {
						//适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
						if(res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
							uni.setStorage({
								key: 'iphone',
								data: true,
							});
						}
					})
				}
			});
		},
	}
</script>

<style>
	@import url("@/pages/iconfont.css");
	/*每个页面公共css */
	.content {
		background: linear-gradient(180deg, #f1f1f1 0%, #fafafa 100%);
		min-height: 100vh;
		font-size: 28upx;
	}
	button{
		font-size: 28upx!important;
	}
</style>
