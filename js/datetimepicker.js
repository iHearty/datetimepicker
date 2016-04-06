(function() {
   var format = function(fmt) {
      var o = {
         "M+": this.getMonth() + 1, //月份
         "d+": this.getDate(), //日
         "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
         "H+": this.getHours(), //小时
         "m+": this.getMinutes(), //分
         "s+": this.getSeconds(), //秒
         "q+": Math.floor((this.getMonth() + 3) / 3), //季度
         "S": this.getMilliseconds() //毫秒
      };
      var week = {
         "0": "\u65e5",
         "1": "\u4e00",
         "2": "\u4e8c",
         "3": "\u4e09",
         "4": "\u56db",
         "5": "\u4e94",
         "6": "\u516d"
      };

      if(/(y+)/.test(fmt)) {
         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }

      if(/(E+)/.test(fmt)) {
         fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
      }

      for(var k in o) {
         if(new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
         }
      }

      return fmt;
   };

   var isLeapYear = function() {
      // summary:
      //    Determines if the year of the date is a leap year
      // description:
      //    Leap years are years with an additional day YYYY-02-29, where the
      //    year number is a multiple of four with the following exception: If
      //    a year is a multiple of 100, then it is only a leap year if it is
      //    also a multiple of 400. For example, 1900 was not a leap year, but
      //    2000 is one.

      var year = this.getFullYear();
      return !(year % 400) || (!(year % 4) && !!(year % 100)); // Boolean
   };

   var getMonthDays = function() {
      // summary:
      //    返回当前日期当月的天数
      var month = this.getMonth();
      var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if(month == 1 && this.isLeapYear()) {
         return 29;
      }

      return days[month];
   };

   var add = function(field, amount) {
      switch(field) {
         case "y":
            this.setFullYear(this.getFullYear() + amount);
            break;
         case "m":
            this.setMonth(this.getMonth() + amount);
            break;
         case "d":
            this.setDate(this.getDate() + amount);
            break;
         case "h":
            this.setHours(this.getHours() + amount);
            break;
         case "mi":
            this.setMinutes(this.getMinutes() + amount);
            break;
         case "s":
            this.setSeconds(this.getSeconds() + amount);
            break;
         case "ms":
            this.setMilliseconds(this.getMilliseconds() + amount);
            break;
      }
   }

   Date.prototype.format = format;
   Date.prototype.isLeapYear = isLeapYear;
   Date.prototype.getMonthDays = getMonthDays;
   Date.prototype.add = add;
})();

(function() {
   var baseTmpl = ''
      + '<div class="datetimepicker" tabindex="0" style="display: none;">'
      +    '<div class="dtp-header">'
      +       '<div class="dtp-time">12:54:30</div>'
      +       '<div class="dtp-date">2016年3月15日, 星期二</div>'
      +    '</div>'
      +    '<div class="dtp-body">'
      +       '<div class="dtp-handler-container">'
      +           '<span class="dtp-date">2016年3月</span>'
      +           '<div class="dtp-handler">'
      +              '<span class="dtp-up-handler">上</span>'
      +              '<span class="dtp-down-handler">下</span>'
      +           '</div>'
      +       '</div>'
      +       '<div class="dtp-datetime-container"></div>'
      +    '</div>'
      +    '<div class="dtp-footer">'
      +       '<span>返回今天</span>'
      +    '</div>'
      + '</div>';

   var monTmpl = '<table cellpadding="0" cellspacing="0" class="mon" style="display: none">'
      +    '<thead>'
      +       '<tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr>'
      +    '</thead>'
      +    '<tbody>'
      +       '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +       '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +       '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +       '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +       '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +       '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +    '</tbody>'
      + '</table>';

   var yearTmpl = '<table class="year" style="display: none">'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      + '</table>';

   var decadeTmpl = '<table class="decade" style="display: none">'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      + '</table>';

   var weekConvertor = {0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6};
   var modes = ["decade", "year", "month"];
   var holders = ["$dHolder", "$yHolder", "$mHolder"];

   var handleView = function(date, updown) {
      var _this = this;
      var idx = modes.indexOf(this.mode + "") + updown;

      if(idx < 0 || idx > modes.length - 1) {
         return;
      }

      _this.mode = modes[idx];
      // this[holders[idx - updown]].hide();
      if(updown < 0) {
         this[holders[idx - updown]].addClass("animated zoomOut").one("animationend", function() {
            $(this).hide()
               .removeClass("animated zoomOut");
            toDatetime.apply(_this, [date]);
         });
      }
      else {
         this[holders[idx - updown]].fadeOut(50, function() {
            toDatetime.apply(_this, [date]);
         });
      }
   }

   var toDatetime = function(date) {
      var _this = this;
      date = new Date(date.getTime());

      var updateHandleDisplay = function(date, text) {
         _this.$handleDatetimeDisplay.data("date", new Date(date.getTime())).html(text);
      }

      if(this.mode == "month") {
         updateHandleDisplay(date, date.format("yyyy年M月"));

         if(!this.$mHolder) {
            this.$mHolder = $(monTmpl).appendTo(this.$datetimeContainer)
               .delegate("tbody td", "click", function() {
                  var $this = $(this);

                  if($this.hasClass("disabled")) {
                     return;
                  }

                  var dd = $this.data("date");

                  // if($this.hasClass("dtp-tobefore") || $this.hasClass("dtp-toafter")) {
                  //    toDatetime.apply(_this, [dd]);
                  // }

                  var evt = $.Event("datetime");
                  evt.datetime = new Date(dd.getTime());
                  evt.datetimeText = dd.format(_this.format);
                  _this.$element.trigger(evt);
                  _this.date = evt.datetime;

                  if(_this.autoClose) {
                     _this.toggle(false);
                  }

                  _this.$mHolder.find("tbody td").removeClass("selected");
                  $this.addClass("selected");
               });
         }

         date.setDate(1);
         var days = date.getMonthDays();
         var week = weekConvertor[date.getDay()];
         var offset = week - 1;

         if(offset == 0) {
            offset += 7;
         }

         date.setDate(date.getDate() - offset);

         $.each(this.$mHolder.find("tbody td"), function(idx, td) {
            var $td = $(td);
            var dd = new Date(date.getTime());
            $td.data("date", dd)
               .html(date.getDate())
               .removeClass("dtp-tobefore dtp-toafter disabled selected");;

            if(_this.date.format("yyyy-MM-dd") == date.format("yyyy-MM-dd")) {
               $td.addClass("selected");
            }

            if(idx < offset) {
               $td.addClass("dtp-tobefore");
            }
            else if(idx > offset + days - 1) {
               $td.addClass("dtp-toafter");
            }

            if(_this.max && dd > _this.max) {
               $td.addClass("disabled");
            }

            if(_this.min && dd < _this.min) {
               $td.addClass("disabled");
            }

            date.add("d", 1);
         });

         this.$mHolder.fadeIn(100);
      }
      else if(this.mode == "year") {
         updateHandleDisplay(date, date.format("yyyy年"));

         if(!this.$yHolder) {
            this.$yHolder = $(yearTmpl).appendTo(this.$datetimeContainer)
               .delegate("td", "click", function() {
                  var $this = $(this);
                  var dd = $this.data("date");

                  if(_this.init.mode != _this.mode) {
                     // toDatetime.apply(_this, [dd]);
                     handleView.apply(_this, [dd, 1]);
                  }
                  else {
                     if($this.hasClass("disabled")) {
                        return;
                     }

                     var evt = $.Event("datetime");
                     evt.datetime = new Date(dd.getTime());
                     evt.datetimeText = dd.format(_this.format);
                     _this.$element.trigger(evt);
                     _this.date = evt.datetime;

                     if(_this.autoClose) {
                        _this.toggle(false);
                     }
                  }

                  // if($this.hasClass("dtp-tobefore") || $this.hasClass("dtp-toafter")) {
                  //    toDatetime.apply(_this, [dd]);
                  // }
               });
         }

         date.setMonth(-2);

         $.each(this.$yHolder.find("td"), function(idx, td) {
            var $td = $(td);
            var dd = new Date(date.getTime());
            $td.data("date", dd)
               .html(date.getMonth() + 1 + "月")
               .removeClass("dtp-tobefore dtp-toafter disabled selected");

            if(_this.date.format("yyyy-MM") == date.format("yyyy-MM")) {
               $td.addClass("selected");
            }

            if(idx < 2) {
               $td.addClass("dtp-tobefore");
            }
            else if(idx > 13) {
               $td.addClass("dtp-toafter");
            }

            if(_this.max && dd > _this.max) {
               $td.addClass("disabled");
            }

            if(_this.min && dd < _this.min) {
               $td.addClass("disabled");
            }

            date.add("m", 1);
         });

         this.$yHolder.fadeIn(100);
      }
      else if(this.mode == "decade") {
         var dd = new Date(date.getTime());
         dd.setFullYear(dd.getFullYear() + (10 - 1));
         updateHandleDisplay(date, date.format("yyyy年") + " - " + dd.format("yyyy年"));

         if(!this.$dHolder) {
            this.$dHolder = $(decadeTmpl).appendTo(this.$datetimeContainer)
               .delegate("td", "click", function() {
                  var $this = $(this);
                  var dd = $this.data("date");

                  if(_this.init.mode != _this.mode) {
                     // toDatetime.apply(_this, [dd]);
                     handleView.apply(_this, [dd, 1]);
                  }
                  else {
                     var evt = $.Event("datetime");
                     evt.datetime = new Date(dd.getTime());
                     evt.datetimeText = dd.format(_this.format);
                     _this.$element.trigger(evt);
                     _this.date = evt.datetime;

                     if(_this.autoClose) {
                        _this.toggle(false);
                     }
                  }

                  // if($this.hasClass("dtp-tobefore") || $this.hasClass("dtp-toafter")) {
                  //    toDatetime.apply(_this, [dd]);
                  // }
               });;
         }

         date.setFullYear(date.getFullYear() - 2);

         $.each(this.$dHolder.find("td"), function(idx, td) {
            var $td = $(td);
            var dd = new Date(date.getTime());
            $td.data("date", dd)
               .html(date.getFullYear())
               .removeClass("dtp-tobefore dtp-toafter disabled selected");

            if(_this.date.getFullYear() == date.getFullYear()) {
               $td.addClass("selected");
            }

            if(idx < 2) {
               $td.addClass("dtp-tobefore");
            }
            else if(idx > 11) {
               $td.addClass("dtp-toafter");
            }

            if(_this.max && dd > _this.max) {
               $td.addClass("disabled");
            }

            if(_this.min && dd < _this.min) {
               $td.addClass("disabled");
            }

            date.add("y", 1);
         });

         this.$dHolder.fadeIn(100);
      }
   }

   var initHandle = function() {
      var _this = this;

      var updownHandler = function(updown) {
         var date = _this.$handleDatetimeDisplay.data("date");
         var animate = updown < 0 ? "slideOutDown" : "slideOutUp";

         if(_this.mode == "month") {
            date.setMonth(date.getMonth() + updown);
         }
         else if(_this.mode == "year") {
            date.setFullYear(date.getFullYear() + updown);
         }
         else if(_this.mode == "decade") {
            date.setFullYear(date.getFullYear() + updown * 10);
         }

         var idx = modes.indexOf(_this.mode);
         var $holder = holders[idx];

         _this[$holder].fadeOut(50, function() {
            toDatetime.apply(_this, [date]);
         });
      }

      this.$upHandler.on("click", function() {
         updownHandler(-1);
      });

      this.$downHandler.on("click", function() {
         updownHandler(1);
      });

      this.$handleDatetimeDisplay.on("click", function() {
         handleView.apply(_this, [$(this).data("date"), -1]);
      });

      this.$toToday.on("click", function() {
         var idx = modes.indexOf(_this.init.mode);
         var nidx = modes.indexOf(_this.mode);
         var dd = new Date();
         dd.setHours(0, 0, 0, 0);
         handleView.apply(_this, [dd, idx - nidx]);

         if(_this.autoClose) {
            var evt = $.Event("datetime");
            evt.datetime = new Date(dd.getTime());
            evt.datetimeText = dd.format(_this.format);
            _this.$element.trigger(evt);
            _this.date = evt.datetime;
            _this.toggle(false);
         }
      });

      this.$element.on("focus", function() {
         _this.toggle(true);
      });

      // this.$element.on("blur", function() {
      //    _this.toggle(false);
      // });

      $(document).on("click", function(evt) {
         if($(evt.target).closest(_this.$element).length) {
            return;
         }

         if($(evt.target).closest('.datetimepicker').length === 0) {
            _this.toggle(false);
         }
      });
   }

   var Datetimepicker = function(element, options) {
      var _this = this;
      this.mode = options.mode || "month";
      this.max = options.max || new Date('2016-03-20 00:00:00');
      this.min = options.min || new Date('2016-02-01 00:00:00');

      Object.defineProperty(this, "date", {
         get: function() {
            return this._date;
         },
         set: function(d) {
            if($.type(d) != "date") {
               throw new Error("Type error.");
            }

            if(this.max && this.max < d) {
               this._date = this.max;
            }
            else if(this.min && this.min > d) {
               this._date = this.m;
            }
            else {
               this._date = d;
            }
         }
      });

      this.id = options.id || "";
      this.date = options.date || new Date();
      this.format = options.format || "yyyy-MM-dd HH:mm";
      this.container = options.container || "body";
      this.autoClose = options.autoClose || true;
      this.$element = $(element);
      this.keepDisplay = this.$element.is("div");
      this.$baseNode = $(baseTmpl).appendTo(this.container);
      this.$timeDisplay = this.$baseNode.find(".dtp-header .dtp-time");
      this.$dateDisplay = this.$baseNode.find(".dtp-header .dtp-date");
      this.$handleDatetimeDisplay = this.$baseNode.find(".dtp-body .dtp-handler-container .dtp-date");
      this.$upHandler = this.$baseNode.find(".dtp-body .dtp-handler-container .dtp-handler .dtp-up-handler");
      this.$downHandler = this.$baseNode.find(".dtp-body .dtp-handler-container .dtp-handler .dtp-down-handler");
      this.$datetimeContainer = this.$baseNode.find(".dtp-body .dtp-datetime-container");
      this.$toToday = this.$baseNode.find(".dtp-footer span");
      this.init = {
         mode: this.mode
      };

      this.date.setHours(0, 0, 0, 0);

      if(this.mode == "year") {
         this.date.setDate(0);
      }
      else if(this.mode == "decade") {
         this.setMonth(0, 0);
      }

      initHandle.apply(this);
      toDatetime.apply(this, [this.date]);

      var updateDatetime = function() {
         var dd = new Date();
         _this.$timeDisplay.html(dd.format("HH:mm:ss"));
         _this.$dateDisplay.html(dd.format("yyyy年M月d日, EEE"));
      }

      updateDatetime();
      setInterval(updateDatetime, 1000);

      this.isVisible = false;
      this.toggle = function(display) {
         if(display === true || this.$baseNode.css("display") == "none" && display !== false) {
            if(this.isVisible) {
               return;
            }

            this.$baseNode.fadeIn(300, function() {
               // $(this).focus();
            });

            this.isVisible = true;
         }
         else {
            if(this.keepDisplay) {
               return;
            }

            this.$baseNode.fadeOut(100);
            this.isVisible = false;
         }
      }
   }

   $.fn.datetimepicker = function(options) {
      this.each(function() {
         var $this = $(this);
         var datetimepicker = $this.data("datetimepicker");

         if(!datetimepicker) {
            datetimepicker = new Datetimepicker(this, $.extend({}, options));
            $this.data("datetimepicker", datetimepicker);
         }

         if(datetimepicker.keepDisplay) {
            datetimepicker.toggle(true);
         }
      });

      return this;
   }
})();