# wxy-signature 介绍

## 组件来源

项目中要使用白板上课,在插件市场中搜索了不少,开始接触的是陌上华年大神的[写字板](https://ext.dcloud.net.cn/plugin?id=4354)，不过在使用过程中发现没有案例，更大问题是回退时发现闪屏，这样体验非常不好，最后找到不错另款[手写板、签字板](https://ext.dcloud.net.cn/plugin?id=4329)，本插件正是基于它改进而来，这里非常感谢原作者，本插件目标是

- [√]开箱即用的白板，如画笔类型、大小、颜色、虚线、背景色、插入图片、插入文本，可分页，可回退、清空和保存
- [√]可通过属性控制菜单按钮
- [×]曲线优化为贝塞尔曲线,参考陌上年华的写字板中代码进行优化
- [×]支持模拟压感
- [×]APP与H5画笔同步,目前方案是基于webrtc实现,webrtc建立是通过goeasy,可更换为其它websocket方案

虽然本插件是基于原作者插件，但改动比较大，主要有以下几个方面

- 缓存数据格式：原作者是三维数组，只能保存点信息，而白板即要保存背景色，还要保存每种画笔类型等信息，所以对缓存数据格式进行了改进
 1. 一级成员是对象,两个成员bgColor和data，前者是背景色，后者是当前画布数据
 2. 二级成员即是一级data,数组类型，每个成员还是对象，包括当前画面中每次画笔信息，如类型(type)、类型相关参数和点数据(points)
 3. 三级成员就是二级points，它每个成员是数组，即x,y坐标值
- 重写了各API，支持各种画笔类型,修复了原API不合理部分 

## 基本使用

```html
<template>
	<view class="container">
		<wxy-signature ref="signature" menu-flag page-flag @save="save" @saveall="saveall"></wxy-signature>	
	</view>
</template>
<script>
export default {
	methods: {
		save() {
			// 保存当前画布
			this.$refs.signature.save().then(res => {
				console.log(res.tempFilePath);
			});
		},
		saveall() {
			// 保存所有画布
			this.$refs.signature.saveAll().then(res => {
				console.log(res);
			});
		}
	}
};
</script>
```

## 同步示例

```html
<template>
	<view class="container">
		<wxy-signature ref="signature" menu-flag page-flag host="hangzhou.goeasy.io" appkey="BC-72b4ef965516464badafb2a854558f4a" channel="usr2021070615423" @save="save" @saveall="saveall"></wxy-signature>
	</view>
</template>
<script>
export default {
	methods: {
		save() {
			// 保存当前画布
			this.$refs.signature.save().then(res => {
				console.log(res.tempFilePath);
			});
		},
		saveall() {
			// 保存所有画布
			this.$refs.signature.saveAll().then(res => {
				console.log(res);
			});
		}
	}
};
</script>
```

## 操作说明
1. 画笔可选曲线,直线,矩形,圆形和文本,曲线即自由画笔，而直线、矩形、圆形需要起始点和终点,使用是相同，只是根据选择画笔类型绘画相应的形状
2. 文本时，点击即可输入文本，未确认前，可通过再次点击调整位置，确认后将无法改变位置
3. 虚线是画笔的状态，默认是实线，若是选择虚线，则直线、矩形、圆形将以虚线呈现，曲线也可虚线，但要掌握一定的技巧
4. 大小和颜色就是画笔的粗细和颜色
5. 插入图片时，先要按矩形方式选择范围，然后将图片插入相应范围内,图片将按最大一边进行缩放
6. 背景色可选白色、黑色和透明
7. 页码组可向前翻页，向后翻页，加减页
8. 清空操作时，单击是清除当前画布，长按则清除所有缓存数据并重置为1页
9. 保存操作时，单击是保存当前画布，长按则保存所有缓存中画布

## 基本属性

| 名称        | 类型   |  默认值  | 描述 |
| --------   | -----:  | :----:  | :----:  |
| id | String   |   canvas  |canvasID,多个时一定不能相同|
| color| String |  #000 |画笔颜色|
| size | Number |  3 |画笔粗细|
| disabled | Boolean |  false  |是否禁用|
| page-flag | Boolean |  false  |是否有分页组按钮|
| menu-flag | Boolean |  false  |是否有常用功能按钮|
| auto-mode | String |    |可选image,data,image是自动保存为图片,data是数据，可动态再绘画到画布|

## 事件

|事件名	|返回值							|说明									|
|-------|-------------------------------|---------------------------------------|
|save	|图片临时地址	|点击保存事件|
|saveall	|所有图片临时地址	|长按保存事件|
|page	|行为、切换前后的页码、总页数	|页码切换事件|
|autosave	|image时返回图片临时地址,data时返回原始页面数据	|自动保存事件|


## API

在父级页面中使用ref获取到组件实例，可调用的几个方法

- init 保存当前画板到缓存,清空画板,可通过回退恢复
- back 回退上一步:若是清除画布则从缓存中恢复，若是当前画布有则退回上一步
- save 保存当前内容为图片,Promise调用方式
- saveData 返回指定页画面原始数据
- saveCache 保存当前画布背景和内容到缓存
- restoreCache 从缓存中恢复画板背景和内容
- clearCache 清空缓存中所有数据,需要通过用户确认，若是清空则页码为1
- saveAll 保存所有缓存的画布,要注意此时是同步操作,保存是依次恢复画面，时间可能比较长，推荐save单画布保存

## ** 注意事项 **
1. `save`方法的参数是options对象: 详情参考uniapp官方文档   
   ```js
	const options = {
		x,
		y,
		width,
		height,
		destWidth,
		destHeight,
		fileType,
		quality
	} // 就这几个属性，其他的不要传；这些属性都有默认值，所以一般不用传options参数,直接调save()就可以了
	this.$refs.signature.save(options).then(res => {
		console.log('保存图片的地址', res.tempFilePath)
	})
	```
2. `saveCache`方法的第一个参数为key，之后需要恢复画布内容就会用到对应的key；方法使用ES6的Map来实现，所以key的类型可以随便定义无所谓；第二个参数为保存后是否清空画布，默认为true
    ```js
	const globalKey = Symbol('画布第一页的内容')
	this.$refs.signature.saveCache(globalKey)
	```
3. `restoreCache`方法使用key来恢复画布内容   
   ```js
	this.$refs.signature.restoreCache(globalKey) // globalKey是上一步保存用的key
	```