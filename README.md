#Datetimepicker
一款形似Win10日历风格的日期时间选择器，基于jQuery插件实现，使用简单，灵活，支持多种参数设置。
Github地址： https://github.com/iHearty/datetimepicker
具体介绍如下：

######支持三种视图模式
  * 月视图<br />
    ![Datetimepicker-1.png](http://upload-images.jianshu.io/upload_images/2597444-9e7fae338d8bd9af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  * 年视图<br />
![Datetimepicker-2.png](http://upload-images.jianshu.io/upload_images/2597444-d2b4b4b3c739145d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  * 十年视图<br />
![Datetimepicker-3.png](http://upload-images.jianshu.io/upload_images/2597444-1ce93e6c1fd424f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

######如何使用？
  * 基础用法
        html代码
        <div class="input-wrapper">
            <input class="datetime" type="text" placeholder="请选择时间日期">
        </div>

        Javascript代码
        $(".datetime").datetimepicker();
  * 使用参数
        html代码
        <div class="input-wrapper">
            <input class="datetime" type="text" placeholder="请选择时间日期">
        </div>

        Javascript代码
        $(".datetime").datetimepicker({
           date: new Date('2016/05/30 12:00:00'),
           useTime: true,
           dtpView: 1,
           min: new Date('2016/03/01 00:00:00'),
           max: new Date('2016/11/01 00:00:00'),
           autoClose: false
        });

        ******
        参数说明：
        date: [Date] 初始时间日期，默认: new Date()
        useTime: [Boolean] 是否显示时间选择器，默认: false
        dtpView: [1, 2, 3] 初始视图类型，默认: 1。解释：1-月视图，2-年视图，3-十年视图
        min: 初始最小可选日期(此值可选)， 默认: 无
        min: 初始最大可选日期(此值可选)， 默认: 无
        autoClose: [Boolean] 是否再选择日期后自动关闭，默认: true

* 事件监听
  只有一个监听事件: datetime
      $(".datetime").datetimepicker().on("datetime", function(evt) {
         $(this).val(evt.datetime);
      });

* 动态修改参数
      $(".datetime").datetimepicker({
         useTime: true,
         autoClose: false
      }).on("datetime", function(evt) {
         $(this).val(evt.datetime);
         // 获取当前Datetimepicker对象
         var dtp = $(this).data('datetimepicker');
         dtp.min = evt.datetime;
         dtp.dtpViewRender(true);
         dtp.toggle(false);
      });
* 使用手册
    1. 时间选择： 鼠标悬放在时间上之后，滚动鼠标滚轮，选择时间。或是，点击获取焦点后，使用键盘上下键选择时间，左右方向键切换时、分、秒。
    2. 点击时间下方的日期，可快速返回到今天。
    3. 点击‘上’，‘下’切换上/下一月/年/十年。
    4. 点击‘上’之前的日期，可切换显示的视图，顺序为月视图->年视图->十年视图。