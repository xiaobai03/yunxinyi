<template>
	<view class="signature-container">
		<!-- #ifdef  APP-PLUS || H5 -->
		<view
			disable-scroll
			class="wxy-signature"
			@touchstart.stop.prevent="signature.rhandleTouchStart"
			@touchmove.stop.prevent="signature.rhandleTouchMove"
			@touchend="signature.rhandleTouchEnd"
			:data-id="id"
			:data-host="host"
			:data-appkey="appkey"
			:data-channel="channel"
			:imagebase="imgbase64"
			:change:imagebase="signature.insertImage"
		>
			<canvas :canvas-id="id" class="canvas" :id="id" />
		</view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS || H5 -->
		<view disable-scroll class="wxy-signature" @touchstart.stop.prevent="handleTouchStart" @touchmove.stop.prevent="handleTouchMove" @touchend="handleTouchEnd">
			<canvas :canvas-id="id" class="canvas" :id="id" />
		</view>
		<!-- #endif -->
		<view class="signature-btns">
			<view class="signature-btn-item menus" v-if="menuFlag">
				<wxy-icon :name="typeicon" color="white" margin="0,7" size="1.2em" @click.stop.prevent="bindPen"></wxy-icon>
				<view class="signature-btn-item menu pen" :style="{ left, top }" v-if="penShow">
					<wxy-icon name="pulse-line" color="white" size="1.2em" @click.stop.prevent="bindPulse"></wxy-icon>
					<wxy-icon name="pencil-line" color="white" size="1.2em" @click.stop.prevent="bindPencil"></wxy-icon>
					<wxy-icon name="checkbox-blank-line" color="white" size="1.2em" @click.stop.prevent="bindRect"></wxy-icon>
					<wxy-icon name="checkbox-blank-circle-line" color="white" size="1.2em" @click.stop.prevent="bindCircle"></wxy-icon>
					<wxy-icon name="text" color="white" size="1.2em" @click.stop.prevent="bindText"></wxy-icon>
				</view>
				<wxy-icon name="more-fill" :color="pendash ? 'blue' : 'white'" size="1.2em" @click.stop.prevent="bindDash"></wxy-icon>
				<!-- <wxy-icon name="brush-fill" color="white" margin="0,7" size="1.2em" @click="bindSize"></wxy-icon> -->
				<text style="color:white;" @click.stop.prevent="bindSize">{{ pensize }}</text>
				<view class="signature-btn-item menu size" :style="{ left, top, right }" v-if="sizeShow">
					<slider min="1" max="50" step="1" block-size="15" :value="pensize" show-value style="margin:1px 5px;width: 100%;" @change="sliderChange" />
				</view>
				<wxy-icon name="palette-fill" :color="pencolor" margin="0,7" size="1.2em" @click.stop.prevent="$refs.colorPicker.open()"></wxy-icon>
				<wxy-icon name="image-add-fill" :color="imageFlag ? 'blue' : 'white'" margin="0,7" size="1.2em" @click.stop.prevent="bindImage"></wxy-icon>
				<wxy-icon name="checkbox-blank-fill" :color="getBgColor" margin="0,7" size="1.2em" @click.stop.prevent="bindBackground"></wxy-icon>
				<view class="signature-btn-item menu back" :style="{ right, top }" v-if="backShow">
					<wxy-icon name="checkbox-blank-fill" color="white" size="1.2em" @click.stop.prevent="bindWhite"></wxy-icon>
					<wxy-icon name="checkbox-blank-fill" color="black" size="1.2em" @click.stop.prevent="bindBlack"></wxy-icon>
					<wxy-icon name="checkbox-blank-fill" color="gray" size="1.2em" @click.stop.prevent="bindTransparent"></wxy-icon>
				</view>
				<wxy-color-picker ref="colorPicker" :color="colorobj" @confirm="confirm"></wxy-color-picker>
			</view>
			<view class="signature-btn-item" v-if="pageFlag">
				<wxy-icon name="rewind-fill" color="white" size="1.2em" @click.stop.prevent="bindPrev"></wxy-icon>
				<wxy-icon name="subtract-line" color="white" size="1.2em" @click.stop.prevent="bindSub"></wxy-icon>
				<text style="color:white;font-weight: bold;">{{ page }}</text>
				<text style="color:white;font-weight: bold;">/</text>
				<text style="color:white;font-weight: bold;">{{ num }}</text>
				<wxy-icon name="add-line" color="white" size="1.2em" @click.stop.prevent="bindAdd"></wxy-icon>
				<wxy-icon name="speed-fill" color="white" size="1.2em" @click.stop.prevent="bindNext"></wxy-icon>
			</view>
			<view class="signature-btn-item">
				<wxy-icon name="reply-fill" color="white" margin="0,7" size="1.2em" @click.stop.prevent="back"></wxy-icon>
				<wxy-icon name="brush-2-fill" color="white" margin="0,7" size="1.2em" @click.stop.prevent="init" @longpress.stop.prevent="clearCache"></wxy-icon>
				<wxy-icon name="save-3-fill" color="white" margin="0,7" size="1.2em" @click.stop.prevent="bindsave" @longpress.stop.prevent="bindsaveall"></wxy-icon>
			</view>
		</view>
		<view class="signature-input" v-if="pentype === 'text' && inputFlag" :style="{ left: textleft + 'px', top: texttop + 'px' }">
			<input type="text" confirm-type="done" focus :adjust-position="false" @confirm="inputText" />
		</view>
		<view class="signature-sync" v-if="getSyncFlag">
			<text :class="{ 'sync-text': syncFlag }">{{ syncFlag ? '同步' : '未同步' }}</text>
		</view>
	</view>
</template>

<!-- 逻辑层 -->
<script>
/**
 * zwp-draw-pad 手写板
 * @property {Number} *width 组件宽度
 * @property {Number} *height 组件高度
 * @property {String} color stroke画笔的颜色
 * @property {Number} size stroke画笔的尺寸
 * @property {Boolean} disabled 是否禁用
 */

/**
 * 在父级页面中使用ref获取到组件实例，可调用的几个方法：
 * init 清空画板的当前内容
 * back 在当前画板内容中回退到上一笔
 * save 保存当前内容为图片
 * saveCache 保存当前内容到缓存
 * restoreCache 从缓存中恢复画板内容
 * clearCache 清空缓存（不会清空当前画板内容）
 * drawByData 一般是用不到，这是给其他几个方法用的。根据传入的点数据绘制图形，格式为三级数组
 * 		像这样：data = [ [ [x, y], [x, y] ], [ [x, y], [x, y] ] ]
 * 		data[i]表示第i笔， data[i][j]表示第i笔的第j个点
 */

/**
 *学习的知识
 * 1. 双感叹号判断值(https://blog.csdn.net/tantanit/article/details/52287700)
 * 2. 使用ES6新的数据类型map来存储值
 * 3. 大量使用扩展运算符
 * 4. 大量使用解构赋值const {...变量}=对象，尤其是对this的解构，支持变量和方法，非常巧妙!!!
 */

/**
 * 改进来源https://ext.dcloud.net.cn/plugin?id=4329
 * 1、绘制图形数据只保留了点，不能保留颜色，宽度等信息，明显不合适，现在改进为[{type:'none',color:'#000000',points:[[x,y]]}]
 * data[i]表示第i笔,它是对象,包含类型(如自由笔,矩形，三角形，圆形等),颜色color，尺寸size，points是二维数组，它就是该笔包含所有点
 * data[i].points[j]表示第第i笔的第j个点。为了保留颜色，在把数据画到canvas之前，要使用ctx.draw()清除画布，然后每笔都即时通过ctx.draw(true)叠加画到画布上。
 * 原版是在所有数据之后再统一调用ctx.stroke()和ctx.draw()画到画布，这种只适合单一颜色。
 * 2、功能按钮目前提供三种，默认是退回上一步，清除画布(长按清除所有缓存)和保存(长按保存所有缓存画布)
 * menu-flag:是菜单按钮，提供了画笔类型(曲线,直线,矩形,圆形,文本)、虚线、大小、颜色、插入图片和背景
 * page-flag:是分页按钮，提供了前后翻页，增加减少画布
 * 3、原版退回上一步若有大小，颜色，虚线等时，只有最后一次有效，经查手册可能完beginPath来隔离
 * 4、增加(强)方法
 *    saveAll 保存所有缓存中画布，调用方法同save
 *    增强draw和drawByData，支持更多类型的画笔
 * 5、要区别fill开头和stroke开头的方法，前者是填充，后者是描边。fill->stroke,fillRect->strokeRect,fillText->strokeText。输入文字应该是fillText而不是strokeText
 * 6、缓存保存画布背景和画布数据
 */

/**
 * 深拷贝
 * @param {Object | Array} data 要复制的内容
 */
function deepClone(data) {
	return JSON.parse(JSON.stringify(data));
}
/**
 *  判断是否为空
 * @param {any} value
 * @param {Boolean} flag 是否包含0,'0'或false
 * @return {Boolen} true是空,false是非空
 */
function empty(value, flag = true) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			if (flag && '0' === value) return true;
			break;
		case 'boolean':
			if (flag && !value) return true;
			break;
		case 'number':
			if (flag && (0 === value || isNaN(value))) return true;
			break;
		case 'object':
			if (null === value || value.length === 0) return true;
			// 排除{}
			for (let i in value) return false;
			return true;
	}
	return false;
}

/**
 * 按指定长度分割成数组
 * @param {String} str 要复制的内容
 * @param {Number} len 分割的长度
 * @return {Array}
 */
function strToArrByLen(str = '', len = 1000) {
	let res = new Array();
	res[0] = str.substr(0, len);
	if (str.length > len) {
		const total = Math.ceil(str.length / len);
		for (let i = 1; i < total; i++) {
			res[i] = str.substr(i * len, len);
		}
	}
	return res;
}

import { pathToBase64, base64ToPath } from '../../static/img.js';
let that;
let msg = { query: [] };
export default {
	props: {
		id: {
			type: String,
			default: 'canvas'
		},
		color: {
			type: String,
			default: '#000000'
		},
		size: {
			type: Number,
			default: 3
		},
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否有分页按钮组
		pageFlag: {
			type: Boolean,
			default: false
		},
		// 是否有菜单按钮缓组
		menuFlag: {
			type: Boolean,
			default: false
		},
		//自动保存类型,空则不自动保存，image是图片，data是数据
		autoMode:{
			type: String,
			default: ''
		},
		// goeasy同步域
		host: {
			type: String,
			default: ''
		},
		// goeasy同步appkey
		appkey: {
			type: String,
			default: ''
		},
		//goeasy同步channel
		channel: {
			type: String,
			default: ''
		}
	},
	computed: {
		getSize() {
			if (/(%|px|rpx|em|vw|vh|vmax|vmin|auto)$/.test(this.size)) return this.size;
			else return this.size + 'px';
		},
		getBgColor() {
			if (this.bgColor === 'transparent') return 'gray';
			else return this.bgColor;
		},
		getSyncFlag() {
			return !empty(this.host) && !empty(this.appkey) && !empty(this.channel);
		}
	},
	watch: {
		penShow(nVal) {
			if (nVal) {
				this.sizeShow = false;
				this.backShow = false;
			}
		},
		sizeShow(nVal) {
			if (nVal) {
				this.penShow = false;
				this.backShow = false;
			}
		},
		backShow(nVal) {
			if (nVal) {
				this.sizeShow = false;
				this.penShow = false;
			}
		}
	},
	data() {
		return {
			num: 1,
			page: 1,
			penShow: false, //画笔菜单显示
			sizeShow: false, //大小菜单显示
			backShow: false, //背景菜单显示
			// 弹出菜单定位
			right: '0px',
			top: '0px',
			left: '0px',
			// 颜色选择开始颜色
			colorobj: {
				r: 255,
				g: 0,
				b: 0,
				a: 1
			},
			textleft: 0,
			texttop: 0,
			inputFlag: false, //是否输入文本
			imageFlag: false, //是否插入图片
			// 画笔参数
			typeicon: 'pulse-line',
			pentype: 'none', //画笔的类型：none自由画笔,line直线,rect是矩形,triangle三角形,circle是圆形,image是图像,text是文本
			pensize: this.size, //大小
			pencolor: this.color, //颜色
			pendash: false, //是否虚线
			bgColor: 'white', //'white','black','transparent'
			// 是否同步和关闭
			syncFlag: false,
			// 插入图片base64
			imgbase64: [],
			isSyncImage: false
		};
	},
	mounted: function() {
		const { pencolor, pensize, id } = this;
		that = this;
		const ctx = uni.createCanvasContext(id, this);
		const ctxtemp = uni.createCanvasContext('temp-' + id, this);
		ctx.setStrokeStyle(pencolor);
		ctx.setLineWidth(pensize);
		ctx.setLineCap('round');
		ctx.setLineJoin('round');
		this.ctx = ctx;
		this.points = [];
		this.originData = [];
		this.data = [];
		this.cache = new Map();
		this.$nextTick(() => {
			// 计算宽度和高度
			uni.createSelectorQuery()
				.in(this)
				.select(`#${id}`)
				.boundingClientRect(data => {
					console.log(data);
					//单位是像素
					this.boardleft = data.left;
					this.boardtop = data.top;
					this.boardright = data.right;
					this.boardbottom = data.bottom;
					this.boardWidth = data.width;
					this.boardHeight = data.height;
					ctx.setFillStyle(this.bgColor);
					ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
					ctx.draw();
				})
				.exec();
			// 计算弹出参数
			uni.createSelectorQuery()
				.in(this)
				.select('.menus')
				.fields(
					{
						size: true
					},
					data => {
						if (data != null) {
							this.top = '-' + (data.height + 2) + 'px';
						}
					}
				)
				.exec();
		});
		// #ifdef H5
		this.goeasy &&
			this.goeasy.pubsub.subscribe({
				channel: 'wxy-' + that.channel,
				onMessage: function(message) {
					// console.log('Channel:' + message.channel + ' content:' + message.content);
					const content = JSON.parse(message.content);
					// 方法为空则直接返回
					if (empty(content.method)) return false;
					// 参数不是数组直接返回
					if (Object.prototype.toString.call(content.query).slice(8, -1) != 'Array') return false;
					// 方法目前有三种:原生uniapi(uni.开头)、页面的方法(that.开头)和设置数据(data.开头)
					if (content.method.startsWith('uni.') || content.method.startsWith('that.')) {
						// 没有参数则直接调用即可
						if (empty(content.query)) {
							eval(content.method + '()');
						} else {
							// 通过JSON.stringify转化为字符串，并通过...扩展运算符，支持对象、数组等
							eval(content.method + '(...' + JSON.stringify(content.query) + ')');
						}
					}
					if (content.method.startsWith('data.')) {
						content.query.forEach(item => {
							// 要求JSON.stringify转换的执行语句
							eval(item);
						});
					}
				},
				onSuccess: function() {
					console.log('Subscribe successfully.');
				},
				onFailed: function() {
					console.log('Subscribe Failed.');
				}
			});
		// #endif
	},
	beforeDestroy() {
		// APP和H5退出都会触发
		that.syncFlag = false;
	},
	methods: {
		handleTouchStart(e) {
			const { pageX: x, pageY: y } = e.changedTouches[0];
			let scale = [1, 1];
			this._handleTouchStart({
				x,
				y,
				scale
			});
		},
		handleTouchMove(e) {
			const { pageX: x, pageY: y } = e.changedTouches[0];
			let scale = [1, 1];
			this._handleTouchMove({
				x,
				y,
				scale
			});
		},
		handleTouchEnd(e) {
			const { pageX: x, pageY: y } = e.changedTouches[0];
			let scale = [1, 1];
			this._handleTouchEnd({
				x,
				y,
				scale
			});
		},
		_handleTouchStart(touch) {
			const { ctx, disabled, pentype, pencolor, pensize, pendash } = this;
			if (disabled) return;
			const { x, y, scale } = touch;
			let tempx = x,
				tempy = y;
			if (scale[0] == 1 && scale[1] == 1) {
				// 自身画布
				tempx = x;
				tempy = y;
			} else {
				// 同步画面需要缩放
				let tempscale = Math.min(scale[0], scale[1]);
				tempx = x * tempscale;
				tempy = y * tempscale;
			}
			that.points = [];
			if (pentype === 'image') {
				that.points.push([tempx, tempy]);
				// 保存画笔类型
				that.originData.push({
					type: 'image',
					points: [[tempx, tempy]]
				});
			}
			if (pentype === 'text') {
				that.inputFlag = true;
				that.textleft = tempx;
				that.texttop = tempy;
			}
			if (!(pentype === 'image' || pentype === 'text')) {
				that.points.push([tempx, tempy]);
				// 保存画笔类型
				that.originData.push({
					type: pentype,
					color: pencolor,
					size: pensize,
					dash: pendash,
					points: [[tempx, tempy]]
				});
			}
		},
		_handleTouchMove(touch) {
			const { disabled, draw, pentype } = this;
			if (disabled) return;
			const { x, y, scale } = touch;
			if (pentype === 'none') {
				if (scale[0] == 1 && scale[1] == 1) {
					// 自身画布
					this.points.push([x, y]);
					this.originData[this.originData.length - 1].points.push([x, y]);
					draw(true);
				} else {
					// 同步画面需要缩放
					let temppoint = JSON.parse(JSON.stringify(this.points)).pop();
					let tempscale = Math.min(scale[0], scale[1]);
					let tempx = x * tempscale;
					let tempy = y * tempscale;
					if (x < Math.max(tempx, temppoint[0]) && x > Math.min(tempx, temppoint[0]) && y < Math.max(tempy, temppoint[1]) && y > Math.min(tempy, temppoint[1])) {
						this.points.push([x, y]);
						this.originData[this.originData.length - 1].points.push([x, y]);
						draw(true);
					}
					this.points.push([tempx, tempy]);
					this.originData[this.originData.length - 1].points.push([tempx, tempy]);
					draw(true);
				}
			}
		},
		_handleTouchEnd(touch) {
			const { disabled, draw, pentype } = this;
			if (disabled) return;
			const { x, y, scale } = touch;
			if (pentype === 'none') this.points = [];
			if (pentype === 'image' && this.syncFlag && this.isSyncImage) {
				uni.showToast({
					title: '正在同步图片插入...',
					icon: 'none'
				});
			}
			if (pentype === 'line' || pentype === 'rect' || pentype === 'circle' || pentype === 'triangle' || pentype === 'image') {
				if (scale[0] == 1 && scale[1] == 1) {
					// 自身画布
					this.points.push([x, y]);
					this.originData[this.originData.length - 1].points.push([x, y]);
				} else {
					// 同步画面需要缩放
					let temppoint = JSON.parse(JSON.stringify(this.points)).pop();
					let tempscale = Math.min(scale[0], scale[1]);
					let tempx = x * tempscale;
					let tempy = y * tempscale;
					this.points.push([tempx, tempy]);
					this.originData[this.originData.length - 1].points.push([tempx, tempy]);
				}
				//若是图片则判断是否人工操作，自动操作则不
				// #ifdef H5
				console.log('autoFlag=>', touch?.autoFlag);
				if (pentype === 'image' && touch?.autoFlag) return false;
				// #endif
				draw(true);
			}
		},
		draw(flag = false) {
			const { ctx, points, originData, pencolor, pensize, pendash, drawByData, pentype, boardright, boardbottom, boardWidth, boardHeight } = this;
			if (points.length < 2) return;
			//任意曲线
			if (pentype === 'none') {
				ctx.moveTo(...points.shift());
				ctx.lineTo(...points[0]);
				ctx.setStrokeStyle(pencolor);
				ctx.setLineWidth(pensize);
				if (pendash) ctx.setLineDash([10]);
				else ctx.setLineDash([]);
				ctx.stroke();
			}
			// 直线
			if (pentype === 'line') {
				ctx.moveTo(...points.shift());
				ctx.lineTo(...points[0]);
				ctx.setStrokeStyle(pencolor);
				ctx.setLineWidth(pensize);
				if (pendash) ctx.setLineDash([10]);
				else ctx.setLineDash([]);
				ctx.stroke();
			}
			// 矩形
			if (pentype === 'rect') {
				ctx.setStrokeStyle(pencolor);
				ctx.setLineWidth(pensize);
				if (pendash) ctx.setLineDash([10]);
				else ctx.setLineDash([]);
				ctx.strokeRect(points[0][0], points[0][1], points[1][0] - points[0][0], points[1][1] - points[0][1]);
			}
			//圆形
			if (pentype === 'circle') {
				let cw = (points[1][0] - points[0][0]) / 2;
				let ch = (points[1][1] - points[0][1]) / 2;
				let cx = points[0][0] + cw;
				let cy = points[0][1] + ch;
				let cr = Math.sqrt(Math.pow(Math.abs(cw), 2) + Math.pow(Math.abs(ch), 2));
				ctx.arc(cx, cy, cr, 0, 2 * Math.PI);
				ctx.setStrokeStyle(pencolor);
				ctx.setLineWidth(pensize);
				if (pendash) ctx.setLineDash([10]);
				else ctx.setLineDash([]);
				ctx.stroke();
			}
			//图片
			if (pentype === 'image') {
				uni.chooseImage({
					count: 1,
					success: res => {
						// #ifdef APP-PLUS
						//APP操作要同步到H5
						that.syncFlag &&
							pathToBase64(res.tempFilePaths[0])
								.then(imgres => {
									// chrome的webrtc传输限制是260000即256kb
									that.imgbase64 = strToArrByLen(imgres, 50000);
								})
								.catch(err => console.log('imgerr=>', err));
						// #endif
						that.drawImageFun(res.tempFilePaths[0]);
					},
					fall: err => {
						console.log('fail', err);
					},
					complete: imageres => {
						// 返回信息errMsg
						// 成功 "chooseImage:ok"
						// 弹出选择相机或相册时取消 "chooseImage:fail cancel"
						// 相册未选择或相机未拍照就返回 "chooseImage:fail User cancelled"
						if (imageres.errMsg != 'chooseImage:ok') {
							that.originData.splice(that.originData.length - 1, 1);
						}
					}
				});
			}
			ctx.draw(flag);
		},
		//清空画布
		init() {
			// #ifdef APP
			msg.method = 'that.init';
			that.publish(msg);
			// #endif
			const { ctx, boardWidth: width, boardHheight: height, page, saveCache } = this;
			// 先保存一下，防止清空恢复
			this.saveCache(page);
			// 清空画布并修改当前画布数据
			ctx.clearRect(0, 0, width, height);
			// 背景色
			ctx.setFillStyle(this.bgColor);
			ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
			ctx.draw();
			this.originData = [];
		},
		//回退到上一笔
		back() {
			// #ifdef APP
			msg.method = 'that.back';
			that.publish(msg);
			// #endif
			const { originData, drawByData, cache, page, restoreCache } = this;
			// 若未清空画布，则返回上一步
			if (originData.length > 0) {
				originData.pop();
				drawByData(originData);
			}
			// 若是清空画布则缓存中恢复
			if (originData.length == 0 && cache.has(page)) restoreCache(page);
		},
		/**
		 * 根据传入的数据绘制
		 * @param {Array} data
		 */
		drawByData(data) {
			const { ctx, init, boardWidth: width, boardHeight: height } = this;
			//恢复画布背景
			ctx.setFillStyle(this.bgColor);
			ctx.fillRect(0, 0, width, height);
			if (!data || !data.length) return init();
			//恢复画布数据
			const tempData = deepClone(data);
			// ctx.draw(); //清除画布
			while (!!tempData.length) {
				const lineData = tempData.shift();
				//自由画笔
				if (lineData.type.toLowerCase() === 'none') {
					//必须要有beginPath，否则setFillStyle()、setStrokeStyle()、setLineWidth()将一直有效，可能完beginPath来隔离
					ctx.beginPath();
					ctx.moveTo(...lineData.points.shift());
					while (!!lineData.points.length) ctx.lineTo(...lineData.points.shift());
					ctx.setStrokeStyle(lineData.color);
					ctx.setLineWidth(lineData.size);
					if (lineData.dash) ctx.setLineDash([10]);
					else ctx.setLineDash([]);
					// ctx.closePath();
					ctx.stroke();
				}
				// 直线
				if (lineData.type.toLowerCase() === 'line') {
					ctx.beginPath();
					ctx.moveTo(...lineData.points[1]);
					ctx.lineTo(...lineData.points[0]);
					ctx.setStrokeStyle(lineData.color);
					ctx.setLineWidth(lineData.size);
					if (lineData.dash) ctx.setLineDash([10]);
					else ctx.setLineDash([]);
					ctx.stroke();
				}
				// 矩形
				if (lineData.type.toLowerCase() === 'rect') {
					ctx.beginPath();
					ctx.setStrokeStyle(lineData.color);
					ctx.setLineWidth(lineData.size);
					if (lineData.dash) ctx.setLineDash([10]);
					else ctx.setLineDash([]);
					ctx.strokeRect(lineData.points[0][0], lineData.points[0][1], lineData.points[1][0] - lineData.points[0][0], lineData.points[1][1] - lineData.points[0][1]);
				}
				// 圆形
				if (lineData.type.toLowerCase() === 'circle') {
					ctx.beginPath();
					let cw = (lineData.points[1][0] - lineData.points[0][0]) / 2;
					let ch = (lineData.points[1][1] - lineData.points[0][1]) / 2;
					let cx = lineData.points[0][0] + cw;
					let cy = lineData.points[0][1] + ch;
					let cr = Math.sqrt(Math.pow(Math.abs(cw), 2) + Math.pow(Math.abs(ch), 2));
					ctx.arc(cx, cy, cr, 0, 2 * Math.PI);
					ctx.setStrokeStyle(lineData.color);
					ctx.setLineWidth(lineData.size);
					if (lineData.dash) ctx.setLineDash([10]);
					else ctx.setLineDash([]);
					ctx.stroke();
				}
				// 图片
				if (lineData.type.toLowerCase() === 'image') ctx.drawImage(lineData.src, ...lineData.args);
				//文本
				if (lineData.type.toLowerCase() === 'text') {
					ctx.beginPath();
					ctx.setFillStyle(lineData.color);
					ctx.setFontSize(lineData.size);
					//fillText
					ctx.fillText(lineData.text, ...lineData.args);
				}
				// ctx.draw(true); //保留画面继续作画(可保留不同颜色的画笔)
			}
			ctx.draw();
		},
		drawImageFun(path) {
			const { ctx, points } = this;
			if (points.length < 2) return;
			uni.getImageInfo({
				src: path,
				success: image => {
					let imageInfo = that.originData[that.originData.length - 1];
					let tempwidth = Math.abs(points[1][0] - points[0][0]);
					let tempheight = Math.abs(points[1][1] - points[0][1]);
					if (image.width <= tempwidth && image.height <= tempheight) {
						//小于画框
						ctx.drawImage(path, points[0][0], points[0][1]);
						ctx.draw(true);
						imageInfo = Object.assign({}, imageInfo, {
							src: path,
							args: [points[0][0], points[0][1]]
						});
						that.originData[that.originData.length - 1] = imageInfo;
					} else {
						//大于画框
						let ratio = Math.max(image.width / tempwidth, image.height / tempheight);
						ctx.drawImage(path, points[0][0], points[0][1], image.width / ratio, image.height / ratio);
						ctx.draw(true);
						imageInfo = Object.assign({}, imageInfo, {
							src: path,
							args: [points[0][0], points[0][1], image.width / ratio, image.height / ratio]
						});
						that.originData[that.originData.length - 1] = imageInfo;
					}
				}
			});
		},
		/**
		 * 临时保存画布上的数据
		 * @param {Any} key 用于访问的key
		 */
		saveCache:function(key) {
			const { cache, originData, bgColor,save,saveData } = this;
			const temp = deepClone(originData);
			cache.set(key, { bgColor: bgColor, data: temp });
			
			//触发自动保存
			let mode=this.autoMode.toLowerCase();
			if(mode==='image' && !empty(temp)){
				save().then(res=>{
					this.$emit('autosave', {'page':key,'data':res.tempFilePath});
				});				
			}
			if(mode==='data' && !empty(temp)){
				let savedata=saveData(key);
				this.$emit('autosave', {'page':key,'data':savedata});
			}
		},
		/**
		 * 删除缓存中key画布
		 * @param {Any} key 用于访问的key
		 */
		delCache(key) {
			// 先删除该画布
			this.cache.delete(key);
			// 依次向前移位
			if (key < this.num) {
				let i = key;
				while (i < this.num) {
					this.cache.set(i, this.cache.get(i + 1));
					this.cache.delete(i + 1);
					i++;
				}
			}
		},
		/**
		 * 用缓存的key恢复画布
		 * @param {Any} key 用于访问的key
		 */
		restoreCache(key) {
			const { ctx, drawByData, cache, boardWidth: width, boardHeight: height } = this;
			const pageData = cache.get(key);
			//恢复画布背景
			this.bgColor = pageData.bgColor;
			//恢复画布数据
			this.originData = pageData.data;
			drawByData(this.originData);
		},
		//清空缓存数据
		clearCache() {
			// #ifdef APP
			msg.method = 'that.clearCache';
			that.publish(msg);
			// #endif
			uni.showModal({
				title: '警告提醒',
				content: '确认清除所有画布吗？清除后将无法恢复!!!',
				success: res => {
					if (res.confirm) {
						this.cache.clear();
						this.originData = [];
						// 清空数据后画布总数和页面均为1，并重新绘画
						this.num = 1;
						this.page = 1;
						this.init();
					}
					if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		},
		bindAdd() {
			// #ifdef APP
			msg.method = 'that.bindAdd';
			that.publish(msg);
			// #endif
			
			if (this.num <= 99) {
				let obj={};
				obj.action='add';
				obj.old=this.page;
				this.init();			
				this.num++;
			    this.page=this.num;				
				obj.new=this.page;				
				obj.total=this.num;
				this.$emit('page',obj);
			}
		},
		bindSub() {
			// #ifdef APP
			msg.method = 'that.bindSub';
			that.publish(msg);
			// #endif
			
			if (this.num > 1) {
				let obj={};
				obj.action='sub';
				obj.old=this.page;
				this.delCache(this.page);
				this.num--;
				//若是最后一页则相应改变
				this.page = Math.min(this.page, this.num);
				this.restoreCache(this.page);
				obj.new=this.page;
				obj.total=this.num;
				this.$emit('page',obj);
			}
		},
		bindPrev() {
			// #ifdef APP
			msg.method = 'that.bindPrev';
			that.publish(msg);
			// #endif
			
			if (this.page > 1) {
				let obj={};
				obj.action='prev';
				obj.old=this.page;
				this.saveCache(this.page);
				this.page--;
				this.restoreCache(this.page);
				obj.new=this.page;
				obj.total=this.num;
				this.$emit('page',obj);
			}
		},
		bindNext() {
			// #ifdef APP
			msg.method = 'that.bindNext';
			that.publish(msg);
			// #endif
			
			if (this.page < this.num) {
				let obj={};
				obj.action='next';
				obj.old=this.page;
				this.saveCache(this.page);
				this.page++;
				this.restoreCache(this.page);
				obj.new=this.page;
				obj.total=this.num;
				this.$emit('page',obj);
			}
		},
		bindPen() {
			// #ifdef APP
			msg.method = 'that.bindPen';
			that.publish(msg);
			// #endif
			
			if (this.imageFlag) {
				this.pentype = this.temptype || 'none';
				this.imageFlag = false;
			}
			this.penShow = !this.penShow;
		},
		bindPulse() {
			// #ifdef APP
			msg.method = 'that.bindPulse';
			that.publish(msg);
			// #endif
			
			this.pentype = 'none';
			this.typeicon = 'pulse-line';
			this.penShow = false;
		},
		bindPencil() {
			// #ifdef APP
			msg.method = 'that.bindPencil';
			that.publish(msg);
			// #endif
			this.pentype = 'line';
			this.typeicon = 'pencil-line';
			this.penShow = false;
		},
		bindDash() {
			// #ifdef APP
			msg.method = 'that.bindDash';
			that.publish(msg);
			// #endif
			this.pendash = !this.pendash;
		},
		bindRect() {
			// #ifdef APP
			msg.method = 'that.bindRect';
			that.publish(msg);
			// #endif
			this.pentype = 'rect';
			this.typeicon = 'checkbox-blank-line';
			this.penShow = false;
		},
		bindCircle() {
			// #ifdef APP
			msg.method = 'that.bindCircle';
			that.publish(msg);
			// #endif
			this.pentype = 'circle';
			this.typeicon = 'checkbox-blank-circle-line';
			this.penShow = false;
		},
		bindText() {
			// #ifdef APP
			msg.method = 'that.bindText';
			that.publish(msg);
			// #endif
			this.pentype = 'text';
			this.typeicon = 'text';
			this.penShow = false;
		},
		bindSize() {
			// #ifdef APP
			msg.method = 'that.bindSize';
			that.publish(msg);
			// #endif
			this.sizeShow = !this.sizeShow;
		},
		sliderChange(e) {
			// #ifdef APP
			msg.method = 'data.sliderChange';
			msg.query = ['that.pensize =' + e.detail.value, 'that.sizeShow = false'];
			that.publish(msg);
			// #endif
			that.pensize = e.detail.value;
			that.sizeShow = false;
		},
		// 加载图片
		bindImage() {
			// #ifdef APP
			msg.method = 'that.bindImage';
			that.publish(msg);
			// #endif
			if (!this.imageFlag) this.temptype = this.pentype;
			this.imageFlag = !this.imageFlag;
			if (this.imageFlag) this.pentype = 'image';
			else this.pentype = this.temptype;
		},
		bindBackground() {
			this.backShow = !this.backShow;
		},
		// 白板
		bindWhite() {
			// #ifdef APP
			msg.method = 'that.bindWhite';
			that.publish(msg);
			// #endif
			const { ctx, originData, drawByData, boardWidth: width, boardHeight: height } = this;
			this.bgColor = 'white';
			ctx.setFillStyle(this.bgColor);
			ctx.fillRect(0, 0, width, height);
			drawByData(originData);
			this.backShow = false;
		},
		// 黑板
		bindBlack() {
			// #ifdef APP
			msg.method = 'that.bindBlack';
			that.publish(msg);
			// #endif
			const { ctx, originData, drawByData, boardWidth: width, boardHeight: height } = this;
			this.bgColor = 'black';
			ctx.setFillStyle(this.bgColor);
			ctx.fillRect(0, 0, width, height);
			drawByData(originData);
			this.backShow = false;
		},
		//透明板
		bindTransparent() {
			// #ifdef APP
			msg.method = 'that.bindTransparent';
			that.publish(msg);
			// #endif
			const { ctx, originData, drawByData, boardWidth: width, boardHeight: height } = this;
			this.bgColor = 'transparent';
			ctx.setFillStyle(this.bgColor);
			ctx.fillRect(0, 0, width, height);
			drawByData(originData);
			this.backShow = false;
		},
		confirm(e) {
			// #ifdef APP
			msg.method = 'data.confirm';
			msg.query = ["that.pencolor ='" + e.hex + "'", "that.ctx.setStrokeStyle('" + e.hex + "')"];
			that.publish(msg);
			// #endif
			that.pencolor = e.hex;
			that.ctx.setStrokeStyle(e.hex);
		},		
		/**
		 * 保存当前画布到临时路径
		 * @param {Object} options canvasToTempFilePath的参数,具体可参考官方，用户自定义参数将合并
		 * 调用方式:this.$refs.signature.save().then(res=>{console.log(res)});
		 */
		save(options = {}) {
			return new Promise((success, fail) => {
				const { boardWidth: width, boardHheight: height, id } = this;
				// 合并参数
				options = Object.assign(
					{
						x: 0,
						y: 0,
						width: width,
						height: height
					},
					options
				);
				options.canvasId = id;
				options.success = success;
				options.fail = fail;
				uni.canvasToTempFilePath(options, this);
			});
		},
		/**
		 * 保存当前数据
		 */
		saveData:function(key){
			const {cache} = this;
			return cache.get(key);
		},
		// 保存所有画布，采用async...await写法(要注意调用方式，它仍然返回Promise)
		// 调用方式:this.$refs.signature.saveAll().then(res=>{console.log(res)});
		saveAll:async function(options = {}) {
			const { cache, page, saveCache, restoreCache, save } = this;
			let imagePath = [];
			// 先保存当前画布到缓存
			saveCache(page);
			// 保存当前页码
			this.temppage = page;
			// 开始循环保存
			uni.showLoading({
				title: '保存所有画布....'
			});
			for (let i = 1; i <= cache.size; i++) {
				this.page = i;
				restoreCache(i);
				let saveres = await save(options);
				imagePath.push(saveres.tempFilePath);
			}
			uni.hideLoading();
			// 保存完成后恢复页码
			this.page = this.temppage;
			return imagePath;
		},
		inputText(e) {
			// #ifdef APP
			msg.method = 'that.inputText';
			msg.query = [e];
			that.publish(msg);
			// #endif
			
			const { ctx, pencolor, pensize, textleft, texttop } = this;
			ctx.setFillStyle(pencolor);
			// 限制大小是11-30之间
			ctx.setFontSize(Math.min(pensize + 10, 30));
			ctx.fillText(e.detail.value, textleft, texttop);
			ctx.draw(true);
			this.originData.push({
				type: 'text',
				text: e.detail.value,
				color: pencolor,
				size: Math.min(pensize + 10, 30),
				args: [textleft, texttop]
			});
			this.inputFlag = false;
		},
		bindsave() {
			const {page,save}=this;
			save().then(res=>{
				this.$emit('save', {'page':page,'data':res.tempFilePath});
			});	
		},
		bindsaveall() {
			const {page,saveAll}=this;
			saveAll().then(res=>{
				this.$emit('saveall', {'page':page,'data':res});
			});	
		},
		receiveRender(options) {
			if (options.type.startsWith('data.')) {
				options.content.forEach(item => {
					// 要求JSON.stringify转换的执行语句
					eval(item);
				});
			}
		},
		insertDrawImage(opt) {
			// console.log('opt=>', opt);
			// #ifdef H5
			// 若是另一张图则清空数据,然后再添加
			that.imgbase64[opt.page] = opt.data;
			if (that.imgbase64.length == opt.total) {
				base64ToPath(that.imgbase64.join(''))
					.then(path => {
						// console.log('page=>',path);
						that.drawImageFun(path);
						// 接收完毕后清除标志和接收数据，准备下次接收
						that.isSyncImage = false;
						that.imgbase64 = new Array();
					})
					.catch(error => {
						console.error(error);
					});
			}
			// #endif
		},
		publish(msg) {
			this.goeasy &&
				this.syncFlag &&
				this.goeasy.pubsub.publish({
					channel: 'wxy-' + that.channel, //请确认与接收端一致
					message: JSON.stringify(msg), //app内onMessage收到的消息内容
					onSuccess: function() {
						console.log('Publish successfully.');
					},
					onFailed: function(error) {
						console.log('Failed to publish message, code:' + error.code + ' error:' + error.content);
					}
				});
		}
	}
};
</script>

<!-- 视图层 -->
<script module="signature" lang="renderjs">
	// webrtc需要的变量
	let peerConnection;
	let sendChannel;
	let receiveChannel;
	let msgContent={};
	let that;
/**
 *  判断是否为空
 * @param {any} value
 * @param {Boolean} flag 是否包含0,'0'或false
 * @return {Boolen} true是空,false是非空
 */
function empty(value, flag = true) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			if (flag && ('0' === value)) return true;
			break;
		case 'boolean':
			if (flag && !value) return true;
			break;
		case 'number':
			if (flag && (0 === value || isNaN(value))) return true;
			break;
		case 'object':
			if (null === value || value.length === 0) return true;
			// 排除{}
			for (let i in value) return false;
			return true;
	}
	return false;
}
export default {
	data() {
		return {
		};
	},
	// #ifdef H5
	watch:{
		isSyncImage(newValue,oldValue){
			if(!newValue && oldValue && this.goeasyFlag && this.syncFlag && sendChannel){
				console.log('插入完成=>',newValue,oldValue);
				sendChannel.send(JSON.stringify({type:"insertFlag",content:{type:'data.',content:['that.isSyncImage=false']}}));
			}
		},
		syncFlag(newValue,oldValue){
			if(!newValue && oldValue && !that.exitFlag) this.wait();
		}
	},
	// #endif
	mounted() {
		console.log('render mouted');
		// 获取子节点的绑定数据
		this.dataset=this.$ownerInstance.$el.children[0].dataset;
		this.goeasyFlag=false;
		if(!empty(this.dataset.host)&&!empty(this.dataset.appkey)&&!empty(this.dataset.channel)) this.goeasyFlag=true;
		//同步标志
		this.syncFlag=false;
		// 退出标志
		this.exitFlag=false;
		// 连接标志,防止连接中重新再连接
		this.joinFlag-false;
		// 经测试uni.getSystemInfoSync在APP或H5的renderjs中均可用
		const { windowWidth, windowHeight } = uni.getSystemInfoSync();
		this.windowWidth=windowWidth;
		this.windowHeight=windowHeight;
		// 同步使用缩放系数
		this.scale=[1,1];
		that=this;
		if(this.goeasyFlag){
			if(window.goEasy){
                that.createWebrtcConnect();
			} else {
            // 动态引入较大类库避免影响页面展示
			const script = document.createElement('script');
			// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算（若是uni_modules应该从./uni_modules开始）
			script.src = './uni_modules/wxy-signature/static/goeasy-2.0.13.min.js';
			//script标签的onload事件都是在外部js文件被加载完成并执行完成后才被触发的
			script.onload = ()=>{
			 window.goEasy= GoEasy.getInstance({
					host: that.dataset.host, //应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
					appkey: that.dataset.appkey, // common key可发送或接收，Subscribe key只能接收
					// host: 'hangzhou.goeasy.io', //应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
					// appkey: 'BC-72b4ef965516464badafb2a854558f4a', // common key可发送或接收，Subscribe key只能接收
					modules:['pubsub'],
				});
				//建立连接
				window.goEasy.connect({
					// id:"001", //pubsub选填，im必填
					// data:{"avatar":"/www/xxx.png","nickname":"Neo"}, //必须是一个对象，pubsub选填，im必填，用于上下线提醒和查询在线用户列表时，扩展更多的属性
					onSuccess: function () {  //连接成功
					  console.log("GoEasy connect successfully.") //连接成功
                      that.createWebrtcConnect();
					},
					onFailed: function (error) { //连接失败
					  console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
					},
					onProgress:function(attempts) { //连接或自动重连中
					  console.log("GoEasy is connecting", attempts);
					}
				});
				}
			document.head.appendChild(script);
			}
		}
	},
	beforeDestroy() {
		// 只有H5退出会触发
		if(that.syncFlag){
			let msg={};
			msg.type="closeFlag";
			msg.content={type:'data.',content:['that.syncFlag=false']};
			that.goeasyFlag&&sendChannel&&sendChannel.send(JSON.stringify(msg));
			that.exitFlag=true;
			that.closeDataChannels();
			that.syncFlag = false;
		}
	},
	methods: {
		// renderjs调用逻辑层方法
		rhandleTouchStart(e, ownerVm) {
			const {
				pageX: x,
				pageY: y
			} = e.changedTouches[0];
			let scale=[1,1];
			ownerVm.callMethod('_handleTouchStart', {
				x,
				y,
				scale
			});
			// #ifdef APP-PLUS
			let msg={};
			msg.type="start";
			msg.content={x,y};
			that.goeasyFlag&&that.syncFlag&&sendChannel&&sendChannel.send(JSON.stringify(msg));
			// #endif
		},
		rhandleTouchMove(e, ownerVm) {
			const {
				pageX: x,
				pageY: y
			} = e.changedTouches[0];
			let scale=[1,1];
			ownerVm.callMethod('_handleTouchMove', {
				x,
				y,
				scale
			});
			// #ifdef APP-PLUS
			let msg={};
			msg.type="move";
			msg.content={x,y};
			that.goeasyFlag&&that.syncFlag&&sendChannel&&sendChannel.send(JSON.stringify(msg));
			// #endif
		},
		rhandleTouchEnd(e, ownerVm) {
			const {
				pageX: x,
				pageY: y
			} = e.changedTouches[0];
			let scale=[1,1];
			ownerVm.callMethod('_handleTouchEnd', {
				x,
				y,
				scale
			});
			// #ifdef APP-PLUS
			let msg={};
			msg.type="end";
			msg.content={x,y};
			that.goeasyFlag&&that.syncFlag&&sendChannel&&sendChannel.send(JSON.stringify(msg));
			// #endif
		},
		insertImage(newValue, oldValue, ownerInstance, instance){
			// 通道的传送的数据大小确实有限制。经测试，在chrome浏览器中，最大发送字节为262144，即256kb，若是超过限制传输通道自动关闭
			// console.log("insertImage=>",newValue);
			// #ifdef APP-PLUS
			let msg={};
			msg.type="insertImage";
			// 对大数据进行拆分，依据是260000字节
			if(that.goeasyFlag&&that.syncFlag&&sendChannel && newValue.length>0 && newValue[0].startsWith('data:')){
				ownerInstance.callMethod('receiveRender',{type:'data.',content:['that.isSyncImage=true']});
				for(let k=0;k<newValue.length;k++){
					msg.content={"total":newValue.length,"page":k,"data":newValue[k]};
					sendChannel.send(JSON.stringify(msg));
				}
			}
			// #endif
		},
		// webrtc相关的方法
		wait(){
			    if(this.joinFlag) return true;
		        let servers = null;
				 peerConnection =new RTCPeerConnection(servers, null);
				 console.log('WebRTC Server is waiting');
				 sendChannel = peerConnection.createDataChannel('sendDataChannel',null);
				 console.log('Created send data channel');

				 peerConnection.onicecandidate = this.iceCallback;
				 peerConnection.ondatachannel = this.receiveChannelCallback;
				 sendChannel.onopen = this.onSendChannelStateChange;
				 sendChannel.onclose = this.onSendChannelStateChange;

                 this.joinFlag=true;
				 let msg={};
				 msg.type='info';
				 msg.content='服务器正在监听...';
			},
			connect(){
				if(this.joinFlag) return true;
		         let servers = null;
		         peerConnection =new RTCPeerConnection(servers, null);
		         console.log('Created Client is success');

		         sendChannel = peerConnection.createDataChannel('sendDataChannel',null);
		         console.log('Created send data channel');

		         peerConnection.onicecandidate = this.iceCallback;
				 peerConnection.ondatachannel = this.receiveChannelCallback;
		         sendChannel.onopen = this.onSendChannelStateChange;
		         sendChannel.onclose = this.onSendChannelStateChange;

		         peerConnection.createOffer().then(
		           that.gotDescription,
		           that.onCreateSessionDescriptionError
		         ).catch(err=>{console.log('createOffer=>',err)});

                 this.joinFlag=true;
				 let msg={};
				 msg.type='info';
				 msg.content='正在连接服务器...';
			},
			onCreateSessionDescriptionError(error) {
			  this.joinFlag=false;
			  console.log('Failed to create session description: ' + error.toString());
			},
			closeDataChannels() {
			  console.log('Closing data channels');
			  sendChannel.close();
			  console.log('Closed data channel with label: ' + sendChannel.label);
			  receiveChannel.close();
			  console.log('Closed data channel with label: ' + receiveChannel.label);
			  peerConnection.close();
			  peerConnection = null;
			  console.log('Closed peer connections');
			},
			gotDescription(desc) {
			// #ifdef APP-PLUS
			console.log('Offer is using \n' + desc.sdp);
			let channel=that.dataset.channel+'-webrtc-h5';
			// #endif
			// #ifdef H5
			console.log('Answer from remoteConnection \n' + desc.sdp);
			let channel=that.dataset.channel+'-webrtc-app';
			// #endif
			  peerConnection.setLocalDescription(desc);
			  msgContent.type="desc";
			  msgContent.content=desc;
			  window.goEasy.pubsub.publish({
			  	channel: channel, //替换为您自己的channel
			  	message: JSON.stringify(msgContent), //替换为您想要发送的消息内容
			  	onSuccess: function() {
			  		// console.log('publish', 'Channel:' + channel + ' content:' + content);
			  		console.log('同步消息发布成功。');
			  	},
			  	onFailed: function(error) {
			  		console.log('同步消息发布失败, 错误编码：' + error.code + ' 错误信息：' + error.content);
			  	}
			  });
			},
			iceCallback(event) {
			  // #ifdef APP-PLUS
			  console.log('Client ice callback');
			  let channel=that.dataset.channel+'-webrtc-h5';
			  // #endif
			  // #ifdef H5
			  console.log('Server ice callback');
			  let channel=that.dataset.channel+'-webrtc-app';
			  // #endif
			  if (event.candidate) {
				 msgContent.type="ice";
				 msgContent.content=event.candidate;
				 window.goEasy.pubsub.publish({
				 	channel: channel, //替换为您自己的channel
				 	message: JSON.stringify(msgContent), //替换为您想要发送的消息内容
				 	onSuccess: function() {
				 		// console.log('publish', 'Channel:' + channel + ' content:' + content);
				 		console.log('同步消息发布成功。');
				 	},
				 	onFailed: function(error) {
				 		console.log('同步消息发布失败, 错误编码：' + error.code + ' 错误信息：' + error.content);
				 	}
				 });
				 // #ifdef APP-PLUS
				console.log('Client ICE candidate: \n' + event.candidate.candidate);
				 // #endif
				 // #ifdef H5
				 console.log('Server ICE candidate: \n' + event.candidate.candidate);
				 // #endif
				 this.joinFlag=false;
			  }
			},
			onAddIceCandidateSuccess() {
			  console.log('AddIceCandidate success.');
			  this.syncFlag=true;
			  this.joinFlag=false;
			  this.$ownerInstance.callMethod('receiveRender',{type:'data.',content:['that.syncFlag=true']});
			},
			onAddIceCandidateError(error) {
			  console.log('Failed to add Ice Candidate: ' + error.toString());
			  this.syncFlag=false;
			  this.joinFlag=false;
			  this.$ownerInstance.callMethod('receiveRender',{type:'data.',content:['that.syncFlag=false']});
			},
			receiveChannelCallback(event) {
			  console.log('Receive Channel Callback');
			  receiveChannel = event.channel;
			  receiveChannel.onmessage = this.onReceiveMessageCallback;
			  receiveChannel.onopen = this.onReceiveChannelStateChange;
			  receiveChannel.onclose = this.onReceiveChannelStateChange;
			},
			onReceiveMessageCallback(event) {
			  // 通道的传送的数据大小确实有限制。经测试，在chrome浏览器中，最大发送字节为262144，即256kb。
			  console.log('Received Message data=>',event.data);
			  let msg=JSON.parse(event.data);
			  // #ifdef H5
			  if(msg.type=='size'){
				  this.scale=[this.windowWidth/msg.content.windowWidth,this.windowHeight/msg.content.windowHeight];
			  }
			  if(msg.type=='start'){
				 msg.content.scale=this.scale||[1,1];
				 msg.content.autoFlag=true;
				 this._handleTouchStart(msg.content);
				 // this.$ownerInstance.callMethod('_handleTouchStart',msg.content);
			  }
			  if(msg.type=='move'){
				  msg.content.scale=this.scale||[1,1];
				  msg.content.autoFlag=true;
				this._handleTouchMove(msg.content);
				// this.$ownerInstance.callMethod('_handleTouchMove',msg.content);
			  }
			  if(msg.type=='end'){
				  msg.content.scale=this.scale||[1,1];
				  msg.content.autoFlag=true;
				 this._handleTouchEnd(msg.content);
				 // this.$ownerInstance.callMethod('_handleTouchEnd',msg.content);
			  }
			  if(msg.type=='insertImage'){
				 this.isSyncImage=true;
				 this.insertDrawImage(msg.content);
				  // this.$ownerInstance.callMethod('insertDrawImage',msg.content);
			  }
			  // #endif
			  // #ifdef APP-PLUS
			  if(msg.type=='insertFlag'){
			  	this.$ownerInstance.callMethod('receiveRender',msg.content);
			  }
			  if(msg.type=='closeFlag'){
				this.closeDataChannels();
			  	this.$ownerInstance.callMethod('receiveRender',msg.content);
			  }
			  // #endif
			},
			onSendChannelStateChange() {
			  console.log('Send channel state is: ' + sendChannel.readyState);
			  if(sendChannel.readyState==='closed') that.syncFlag=false;
			  // #ifdef APP-PLUS
			  if(sendChannel.readyState=='open'){
				  let msg={};
				  msg.type="size";
				  msg.content={windowWidth:this.windowWidth,windowHeight:this.windowHeight};
				  that.goeasyFlag&&sendChannel&&sendChannel.send(JSON.stringify(msg));
			  }
			  // #endif
			},
			onReceiveChannelStateChange() {
			  console.log('Receive channel state is: ' + receiveChannel.readyState);
			  if(receiveChannel.readyState==='closed') that.syncFlag=false;
			},
			createWebrtcConnect(){
				// #ifdef H5
				//防止H5端后启动或下线后再上线连接APP端
				msgContent.type="mounted";
				window.goEasy.pubsub.publish({
					channel: that.dataset.channel+'-webrtc-app', //替换为您自己的channel
					message: JSON.stringify(msgContent), //替换为您想要发送的消息内容
					onSuccess: function() {
						console.log('同步消息发布成功。');
					},
					onFailed: function(error) {
						console.log('同步消息发布失败, 错误编码：' + error.code + ' 错误信息：' + error.content);
					}
				});
				//订阅APP端连接信息
				window.goEasy.pubsub.subscribe({
					channel: that.dataset.channel+'-webrtc-h5', //替换为您自己的channel
					onMessage: function(message) {
						// console.log('subscribe', 'Channel:' + message.channel + ' content:' + message.content);
						let msg=JSON.parse(message.content);
						if(msg.type=='desc'){
							peerConnection.setRemoteDescription(msg.content);
							peerConnection.createAnswer().then(
							  that.gotDescription,
							  that.onCreateSessionDescriptionError,
							).catch(err=>console.log('createAnswer=>',err));
						}
						if(msg.type=='ice'){
							peerConnection.addIceCandidate(msg.content).then(
							  that.onAddIceCandidateSuccess,
							  that.onAddIceCandidateError,
							).catch(err=>console.log('createAnswer=>',err));
						}
					},
					onSuccess: function() {
						console.log('同步订阅成功。');
						that.wait();
					},
					onFailed: function(error) {
						console.log('同步订阅失败, 错误编码：' + error.code + ' 错误信息：' + error.content);
					}
				});
				// #endif
				// #ifdef APP-PLUS
				// 订阅H5端的连接信息
				window.goEasy.pubsub.subscribe({
					channel: that.dataset.channel+'-webrtc-app', //替换为您自己的channel
					onMessage: function(message) {
						// console.log('subscribe', 'Channel:' + message.channel + ' content:' + message.content);
						let msg=JSON.parse(message.content);
						if(msg.type=='desc') peerConnection.setRemoteDescription(msg.content);
						if(msg.type=='ice'){
							peerConnection.addIceCandidate(msg.content).then(
							  that.onAddIceCandidateSuccess,
							  that.onAddIceCandidateError,
							).catch(err=>console.log('createAnswer=>',err));
						}
						if(msg.type=='mounted'){
							that.connect();
						}
					},
					onSuccess: function() {
						console.log('同步订阅成功。');
						that.connect();
					},
					onFailed: function(error) {
						console.log('同步订阅失败, 错误编码：' + error.code + ' 错误信息：' + error.content);
					}
				});
				// #endif
			}
	}
};
</script>

<style lang="scss" scoped>
.signature-container {
	width: 100%;
	height: 100%;
	background-color: transparent;
}

.wxy-signature {
	width: 100%;
	height: 100%;

	.canvas {
		width: 100%;
		height: 100%;
	}
}

.signature-btns {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 5px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;

	.signature-btn-item {
		position: relative;
		display: flex;
		align-items: center;
		padding: 2px 0;
		border-radius: 3px;
		background-color: #999;
		margin: 0 1px;

		.menu {
			position: absolute;
		}

		.size {
			background-color: initial;
		}
	}
}

.signature-input {
	position: fixed;
	border: 1px dashed gray;
	min-width: 5em;
	background-color: lightgray;

	input {
		width: 100%;
	}
}
.signature-sync {
	position: fixed;
	right: 3px;
	top: 3px;
	font-size: 14px;
	color: red;
	/* #ifdef H5 */
	font-size: 16px;
	/* #endif */
	.sync-text {
		color: green;
	}
}
</style>
