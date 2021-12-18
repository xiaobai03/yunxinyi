/*
 * @Description:: 请补充填写
 * @Version: 1.0
 * @Author: 小白
 * @Date: 2021-07-21 08:20:57
 * @LastEditors: 小白
 * @LastEditTime: 2021-08-16 18:56:12
 * @FilePath: /yunxinyi/util/request.js
 */
// const baseUrl = 'http://1.116.26.49/i.php'   
const baseUrl = 'https://wxamp.yunxinyi.cn/i.php'
const request = (action,data = {}) => {
    return new Promise((resolve, reject) => {
		const head = {}
		const token = uni.getStorageSync('token')
		const uid = uni.getStorageSync('uid')
		if(token) {
			head.action = action
			head.timestamp = new Date().getTime()
			head.token = token
			head.uid = uid
		}else{
			head.action = action
			head.timestamp = new Date().getTime()
		}
        uni.request({
            method: 'post',
            url: baseUrl,
            data: {
				head:head,
				body:data
			},
            dataType: 'json',         
        }).then((response) => {
			 // uni.showLoading({
			 // 	title:'加载中'
			 // });
    //        setTimeout(function() {
    //            uni.hideLoading();
    //        }, 200);
            let [error, res] = response;	
            resolve(res.data);
			if(res.data.code == 105){
				uni.showToast({
					title:'请重新登录！',
					icon:'none'
				})
				setTimeout(()=>{
					uni.reLaunch({
						url:"/pages/login/login"
					})
				},2000)
			}else if(res.data.code != 0){
				 uni.showToast({
				 	title:res.data.text,
					icon:'none'
				 })
			}else{
				
			}
        }).catch(error => {
            let [err, res] = error;
            reject(err)
        })
    });
}

export default request