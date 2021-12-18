<template>
  <view  class="content">
      <view class="u-cell-group">
        <view class="u-cell-item" @click="gotoDetails(item)" v-for="(item,index) in list" :key="index">
          <view class="left">
            <image :src="item.logo" mode="aspectFit" class="item_images"></image>
          </view>
          <view class="item-body">
            <view class="title">{{item.realname}}</view>
            <view class="label">{{item.tel}}</view>
          </view>
          <view class="right">
            <image src="https://yxy-1306997902.cos.ap-nanjing.myqcloud.com/xiaochengxu-images/right_access.png"
              class="right_access"></image>
          </view>
        </view>

      </view>
      <view class="save_btn">
        <button class="fx_btn" @click="addlianxiren">添加联系人</button>
      </view>

  </view>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      showDate: false,
      list: [],
    }
  },
  created() {
    const that = this
    uni.getStorage({
      key: 'iphone',
      success: function (res) {
        if (res.data) {
          that.active = 'active'
        }
      },
    })
    this.getData()
  },
  methods: {
    getData() {
      this.$request(1011, {
        curr_page: 1,
        page_size: 50,
      }).then((res) => {
        this.list = res.data.data_list
      })
    },
    addlianxiren() {
      uni.navigateTo({
        url: '/pages/mine/contacts/add_contacts/add_contacts',
      })
    },
    gotoDetails(e) {
      uni.navigateTo({
        url: '/pages/mine/contacts/details/details?id=' + e.id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.u-cell-group{
	padding-top: 20upx;
	.u-cell-item{
		border-bottom: 2upx solid #e6e6e6;
		display: flex;
		align-items: center;
		background: #ffffff;
		padding: 20upx;
		.left{
			width: 100upx;
			margin-right: 20upx;
			.item_images {
				width: 80upx;
				height: 80upx;
				border-radius: 80upx;
			}
		}
		.item-body{
			width: 100%;
			.label{
				font-size: 26upx;
				color: #666666;
				margin-top: 10upx;
			}
		}
		.right{
				width: 30upx;
				.right_access{
					width: 12upx;
					height: 20upx;
				}
			}
	}
}

.save_btn {
	  display: block;
	  background: #d04442;
	  border-radius: 80upx;
	  height: 80upx;
	  width: 100%;
	  text-align: center;
	  line-height: 80upx;
	  color: #ffffff;
	  width: 550upx;
	  margin: 100upx auto 0;
	  font-weight: 500;
	  .fx_btn {
		border: 0;
		background: rgba(0, 0, 0, 0);
		color: #ffffff;
		border-radius: 80upx;
		height: 80upx;
		line-height: 80upx;
		font-size: 26upx;
	  }
}
.save_btn_box{
	width: 500upx;
	position:fixed;
	bottom: 200upx;
	left: 125upx;
	z-index: 9;
	.fx_btn {
			border: 0;
			background: #d04442;
			color: #ffffff;
			border-radius: 80upx;
			height: 80upx;
			line-height: 80upx;
			font-size: 26upx;
	}
}
</style>
