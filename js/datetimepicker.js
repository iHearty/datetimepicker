(function($) {
   var format = function(date, fmt) {
      var o = {
         "M+": date.getMonth() + 1, //月份
         "d+": date.getDate(), //日
         "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
         "H+": date.getHours(), //小时
         "m+": date.getMinutes(), //分
         "s+": date.getSeconds(), //秒
         "q+": Math.floor((date.getMonth() + 3) / 3), //季度
         "S": date.getMilliseconds() //毫秒
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
         fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }

      if(/(E+)/.test(fmt)) {
         fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
      }

      for(var k in o) {
         if(new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
         }
      }

      return fmt;
   };

   var isLeapYear = function(date) {
      // summary:
      //    Determines if the year of the date is a leap year
      // description:
      //    Leap years are years with an additional day YYYY-02-29, where the
      //    year number is a multiple of four with the following exception: If
      //    a year is a multiple of 100, then it is only a leap year if it is
      //    also a multiple of 400. For example, 1900 was not a leap year, but
      //    2000 is one.

      var year = date.getFullYear();
      return !(year % 400) || (!(year % 4) && !!(year % 100)); // Boolean
   };

   var getMonthDays = function(date) {
      // summary:
      //    返回当前日期当月的天数
      var month = date.getMonth();
      var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if(month == 1 && isLeapYear(date)) {
         return 29;
      }

      return days[month];
   };

   var baseTmpl = ''
      + '<div class="datetimepicker" tabindex="1" onselectstart="return false;" style="display: none;">'
      +    '<div class="dtp-header">'
      +       '<div class="dtp-time" style="display: none;"><span class="dtp-hour"></span>:<span class="dtp-min"></span>:<span class="dtp-sec"></span></div>'
      +       '<div class="dtp-date"></div>'
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
      +    '</div>'
      + '</div>';

   var mnTmpl = ''
      + '<div class="table-wrapper" style="display: none">'
      +    '<table cellpadding="0" cellspacing="0">'
      +       '<thead>'
      +          '<tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr>'
      +       '</thead>'
      +    '</table>'
      +    '<div class="mn-body">'
      +       '<table cellpadding="0" cellspacing="0">'
      +          '<tbody>'
      +             '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +             '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +             '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +             '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +             '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +             '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
      +          '</tbody>'
      +       '</table>'
      +    '</div>'
      + '</div>';

   var yeTmpl = ''
      + '<table class="year" style="display: none">'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      + '</table>';

   var deTmpl = ''
      + '<table class="decade" style="display: none">'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      +    '<tr><td></td><td></td><td></td><td></td></tr>'
      + '</table>';

   var mnView = 1;
   var yeView = 2;
   var deView = 3;

   var dtClear = function() {
      if(this.initialize.dtpView == mnView) {
         this.dtpViewDate.setHours(0, 0, 0, 0);

         if(this.max) {
            this.max.setHours(0, 0, 0, 0);
         }

         if(this.min) {
            this.min.setHours(0, 0, 0, 0);
         }
      }
      else if(this.initialize.dtpView == yeView) {
         this.dtpViewDate.setDate(1);
         this.dtpViewDate.setHours(0, 0, 0, 0);

         if(this.max) {
            this.max.setDate(1);
            this.max.setHours(0, 0, 0, 0);
         }

         if(this.min) {
            this.min.setDate(1);
            this.min.setHours(0, 0, 0, 0);
         }
      }
      else if(this.initialize.dtpView == deView) {
         this.dtpViewDate.setMonth(0);
         this.dtpViewDate.setDate(1);
         this.dtpViewDate.setHours(0, 0, 0, 0);

         if(this.max) {
            this.max.setMonth(0);
            this.max.setDate(1);
            this.max.setHours(0, 0, 0, 0);
         }

         if(this.min) {
            this.min.setMonth(0);
            this.min.setDate(1);
            this.min.setHours(0, 0, 0, 0);
         }
      }
   }

   var init = function() {
      var _this = this;

      _this.$dateDisplay.html(format(new Date(), "yyyy年M月d日, EEE"));

      this.$baseNode.on('blur', function(evt) {
      });

      if(this.useTime) {
         this.$timeDisplay.toggle(true);
         this._hour = format(this.date, 'HH');
         this._min = format(this.date, 'mm');
         this._sec = format(this.date, 'ss');
         this.$hourDisplay.attr('tabindex', 2).html(this._hour);
         this.$minDisplay.attr('tabindex', 2).html(this._min);
         this.$secDisplay.attr('tabindex', 2).html(this._sec);

         this.$hourDisplay.on('keydown mousewheel', function(evt) {
            var $this = $(this);

            if(evt.type == 'mousewheel' || evt.keyCode == 38 || evt.keyCode == 40) {
               var offset = 0;

               if(evt.type == 'mousewheel') {
                  var oe = evt.originalEvent;
                  offset = oe.wheelDelta > 0 ? 1 : -1;
               }
               else {
                  offset = evt.keyCode == 38 ? 1 : -1;
               }

               var hour = (Number($this.html()) + offset);

               if(hour < 0) {
                  hour = 23;
               }

               if(hour > 23) {
                  hour = 0;
               }

               if(hour < 10) {
                  hour = '0' + hour;
               }

               _this._hour = hour;
               $this.html(hour);
            }
            else if(evt.keyCode == 37) {
               _this.$secDisplay.focus();
            }
            else if(evt.keyCode == 39) {
               _this.$minDisplay.focus();
            }
         });

         this.$minDisplay.on('keydown mousewheel', function(evt) {
            var $this = $(this);

            if(evt.type == 'mousewheel' || evt.keyCode == 38 || evt.keyCode == 40) {
               var offset = 0;

               if(evt.type == 'mousewheel') {
                  var oe = evt.originalEvent;
                  offset = oe.wheelDelta > 0 ? 1 : -1;
               }
               else {
                  offset = evt.keyCode == 38 ? 1 : -1;
               }

               var min = (Number($this.html()) + offset);

               if(min < 0) {
                  min = 59;
               }

               if(min > 59) {
                  min = 0;
               }

               if(min < 10) {
                  min = '0' + min;
               }

               _this._min = min;
               $this.html(min);
            }
            else if(evt.keyCode == 37) {
               _this.$hourDisplay.focus();
            }
            else if(evt.keyCode == 39) {
               _this.$secDisplay.focus();
            }
         });

         this.$secDisplay.on('keydown mousewheel', function(evt) {
            var $this = $(this);

            if(evt.type == 'mousewheel' || evt.keyCode == 38 || evt.keyCode == 40) {
               var offset = 0;

               if(evt.type == 'mousewheel') {
                  var oe = evt.originalEvent;
                  offset = oe.wheelDelta > 0 ? 1 : -1;
               }
               else {
                  offset = evt.keyCode == 38 ? 1 : -1;
               }

               var sec = (Number($this.html()) + offset);

               if(sec < 0) {
                  sec = 59;
               }

               if(sec > 59) {
                  sec = 0;
               }

               if(sec < 10) {
                  sec = '0' + sec;
               }

               _this._sec = sec;
               $this.html(sec);
            }
            else if(evt.keyCode == 37) {
               _this.$minDisplay.focus();
            }
            else if(evt.keyCode == 39) {
               _this.$hourDisplay.focus();
            }
         });
      }


      this.$dateDisplay.on('click', function() {
         if(_this.dtpView == yeView) {
            _this.$yeView.hide();
         }
         else if(_this.dtpView == deView) {
            _this.$deView.hide();
         }

         _this.dtpView = _this.initialize.dtpView;
         _this.dtpViewDate = new Date();
         _this.dtClear();
         _this.formatRender();
         _this.dtpViewRender();
      });

      this.$handleDatetimeDisplay.on("click", function() {
         var $handleView = null;

         if(_this.dtpView == mnView) {
            _this.dtpView = yeView;
            $handleView = _this.$mnView;
         }
         else if(_this.dtpView == yeView) {
            _this.dtpView = deView;
            $handleView = _this.$yeView;
         }

         _this.formatRender();

         if($handleView) {
            $handleView.addClass("animated zoomOut").one("animationend", function() {
               $(this).hide().removeClass("animated zoomOut");
               _this.dtpViewRender();
            });
         }
      });

      var updownHandler = function(dir) {
         var $handler = null;

         if(_this.dtpView == mnView) {
            _this.dtpViewDate.setMonth(_this.dtpViewDate.getMonth() + dir);
            $handler = _this.$mnView.find('.mn-body');
         }
         else if(_this.dtpView == yeView) {
            _this.dtpViewDate.setFullYear(_this.dtpViewDate.getFullYear() + dir);
            $handler = _this.$yeView;
         }
         else if(_this.dtpView == deView) {
            _this.dtpViewDate.setFullYear(_this.dtpViewDate.getFullYear() + dir * 10);
            $handler = _this.$deView;
         }

         _this.formatRender();
         $handler.fadeOut(50, function() {
            _this.dtpViewRender();
         });
      }

      this.$upHandler.on("click", function() {
         updownHandler(-1);
      });

      this.$downHandler.on("click", function() {
         updownHandler(1);
      });

      this.$element.on("focus", function() {
         _this.toggle(true);
      });

      $(document).on("click", function(evt) {
         if(!_this.autoClose) {
            return;
         }

         if($(evt.target).closest(_this.$element).length) {
            return;
         }

         if($(evt.target).closest('.datetimepicker').length === 0) {
            _this.toggle(false);
         }
      });
   }

   var formatRender = function() {
      var dt = '';

      if(this.dtpView == mnView) {
         dt = format(this.dtpViewDate, 'yyyy年M月');
      }
      else if(this.dtpView == yeView) {
         dt = this.dtpViewDate.getFullYear() + '年';
      }
      else if(this.dtpView == deView) {
         var year = this.dtpViewDate.getFullYear();
            dt = year + '~' + (year + 10 - 1);
      }

      this.$handleDatetimeDisplay.html(dt);
   }

   var dtpViewRender = function(force) {
      if(force) {
         this.dtClear();
      }

      this.formatRender();
      var _this = this;

      if(this.dtpView == mnView) {
         if(!this.$mnView) {
            this.$mnView = $(mnTmpl).appendTo(this.$datetimeContainer)
               .delegate('tbody td', 'click', function() {
                  var $this = $(this);

                  if(!$this.hasClass('disabled') && _this.dtpView == _this.initialize.dtpView) {
                     var d = new Date(Number($this.attr('date')));

                     if(_this.useTime) {
                        d.setHours(Number(_this._hour), Number(_this._min), Number(_this._sec));
                     }

                     if(_this.autoClose) {
                        _this.toggle(false);
                     }

                     _this.$mnView.find('td.selected').removeClass('selected');
                     $this.addClass('selected');
                     _this.date = d;

                     var evt = $.Event("datetime");
                     evt.datetime = _this.date;
                     _this.$element.trigger(evt);
                  }
               });
         }

         var n = new Date(this.dtpViewDate.getTime());
         n.setDate(1);
         var d = n.getDay();
         var offset = d == 0 ? 6 : d - 1;

         if(offset == 0) {
            offset = 7;
         }

         n.setDate(n.getDate() - offset);
         var days = getMonthDays(this.dtpViewDate);
         var f = 'yyyy-MM-dd';
         var formated = format(this.date, f);

         this.$mnView.find('.mn-body').find('tbody td').each(function(idx, td) {
            var $td = $(td).html(n.getDate())
               .attr('date', n.getTime())
               .toggleClass('selected', formated == format(n, f))
               .toggleClass('dtp-tobefore', idx < offset)
               .toggleClass('dtp-toafter', idx >= offset + days)
               .toggleClass('disabled', !!(_this.max && n > _this.max || _this.min && n < _this.min));

            n.setDate(n.getDate() + 1);
         });

         if(this.$mnView.css('display') == 'none') {
            this.$mnView.fadeIn(100);
         }
         else {
            this.$mnView.find('.mn-body').fadeIn(100);
         }
      }
      else if(this.dtpView == yeView) {
         if(!this.$yeView) {
            var _this = this;
            this.$yeView = $(yeTmpl).appendTo(this.$datetimeContainer)
               .delegate('td', 'click', function() {
                  var $this = $(this);
                  var month = Number($this.attr('month'));

                  if(_this.dtpView != _this.initialize.dtpView) {
                     _this.dtpView = mnView;
                     _this.dtpViewDate.setMonth(month);
                     _this.$handleDatetimeDisplay.html(format(_this.dtpViewDate, 'yyyy年M月'));
                     _this.$yeView.addClass("animated zoomIn")
                        .one("animationend", function() {
                           $(this).hide().removeClass("animated zoomIn");
                           _this.dtpViewRender();
                        });
                  }
                  else if(!$this.hasClass('disabled') && _this.dtpView == _this.initialize.dtpView) {
                     if(_this.autoClose) {
                        _this.toggle(false);
                     }

                     _this.$yeView.find('td.selected').removeClass('selected');
                     $this.addClass('selected');
                     _this.date = new Date(Number($this.attr('date')));

                     var evt = $.Event("datetime");
                     evt.datetime = _this.date;
                     _this.$element.trigger(evt);
                  }
               });
         }

         var n = new Date(this.dtpViewDate.getTime());
         n.setFullYear(n.getFullYear() - 1);
         n.setMonth(10);
         var f = 'yyyy-MM';
         var formated = format(this.date, f);

         this.$yeView.find('td').each(function(idx, td) {
            var $td = $(td).html(n.getMonth() + 1 + '月')
               .attr('date', n.getTime())
               .attr('month', n.getMonth())
               .toggleClass('selected', formated == format(n, f))
               .toggleClass('dtp-tobefore', idx < 2)
               .toggleClass('dtp-toafter', idx >= 14)
               .toggleClass('disabled', !!(_this.max && n > _this.max || _this.min && n < _this.min));;

            n.setMonth(n.getMonth() + 1);
         });
         this.$yeView.fadeIn(100);
      }
      else if(this.dtpView == deView) {
         if(!this.$deView) {
            var _this = this;
            this.$deView = $(yeTmpl).appendTo(this.$datetimeContainer)
               .delegate('td', 'click', function() {
                  var $this = $(this);
                  var year = Number($this.attr('year'));

                  if(_this.dtpView != _this.initialize.dtpView) {
                     _this.$handleDatetimeDisplay.html(year + '年');
                     _this.dtpView = yeView;
                     _this.dtpViewDate.setFullYear(year);
                     _this.$deView.addClass("animated zoomIn")
                        .one("animationend", function() {
                           $(this).hide().removeClass("animated zoomIn");
                           _this.dtpViewRender();
                        });
                  }
                  else if(!$this.hasClass('disabled') && _this.dtpView == _this.initialize.dtpView) {
                     if(_this.autoClose) {
                        _this.toggle(false);
                     }

                     _this.$deView.find('td.selected').removeClass('selected');
                     $this.addClass('selected');
                     _this.date = new Date(Number($this.attr('date')));

                     var evt = $.Event("datetime");
                     evt.datetime = _this.date;
                     _this.$element.trigger(evt);
                  }
               });
         }

         var n = new Date(this.dtpViewDate.getTime());
         n.setFullYear(n.getFullYear() - 4);
         var year = this.date.getFullYear();

         this.$deView.find('td').each(function(idx, td) {
            var $td = $(td).html(n.getFullYear())
               .attr('date', n.getTime())
               .attr('year', n.getFullYear())
               .toggleClass('selected', n.getFullYear() == year)
               .toggleClass('dtp-tobefore', idx < 4)
               .toggleClass('dtp-toafter', idx >= 14)
               .toggleClass('disabled', !!(_this.max && n > _this.max || _this.min && n < _this.min));;

            n.setFullYear(n.getFullYear() + 1);
         });
         this.$deView.fadeIn(100);
      }
   }

   var toggle = function(display) {
      var _this = this;
      var isVis = this.$baseNode.css('display') != 'none';

      if(display) {
         if(isVis) {
            return;
         }

         this.$baseNode.fadeIn(300, function() {
            if(_this.useTime) {
               _this.$hourDisplay.focus();
            }
         });
      }
      else {
         if(!isVis) {
            return;
         }

         this.$baseNode.fadeOut(300);
      }
   }

   var layout = function(top, left) {
      var el = this.$element.offset();
      var elWidth = this.$element.outerWidth();
      var elHeight = this.$element.outerHeight();
      var dtWidth = this.$baseNode.outerWidth();
      var dtHeight = this.$baseNode.outerHeight();
      var docW = $(document).width();
      var docH = $(document).height();

      if(!top && !left) {
         // 默认在下方显示，如果下方空间不够Datetimepicker的高度，先尝试右边，再上边，最后左边。
         top = el.top + elHeight + 3
         left = el.left;

         if(docH - top - elHeight > dtHeight) {
            top = top;
            left = el.left;
         }
         else if(docW - el.left - elWidth > dtWidth) {
            top = Math.min(el.top, docH - dtHeight - 10);
            left = el.left + elWidth + 3;
         }
         else if(el.top > dtHeight + 3) {
            top = el.top - dtHeight - 3;
            left = el.left;
         }
         else if(el.left > dtWidth + 3) {
            top = Math.min(el.top, docH - dtHeight - 10);
            left = el.left - dtWidth - 3;
         }
      }

      this.$baseNode.css({
         top: top,
         left: left
      });
   }

   var Datetimepicker = function(element, options) {
      this.id = options.id || "";
      var _max = options.max;

      Object.defineProperty(this, 'max', {
         get: function() {
            return _max;
         },
         set: function(__max) {
            _max = __max;
            this.dtpViewRender(true);
         }
      });

      var _min = options.min;

      Object.defineProperty(this, 'min', {
         get: function() {
            return _min;
         },
         set: function(__min) {
            _min = __min;
            this.dtpViewRender(true);
         }
      });

      var _date = options.date || new Date();

      Object.defineProperty(this, 'date', {
         get: function() {
            return _date;
         },
         set: function(__date) {
            _date = __date;
            var _this = this;
            setTimeout(function() {
               _this.dtpViewDate = new Date(_date.getTime());
               _this.dtpViewRender(true);
            });
         }
      });

      this.container = options.container || "body";
      this.autoClose = options.autoClose === undefined ? true : options.autoClose;
      this.useTime = options.useTime || false;
      this.dtpView = options.dtpView || 1;
      this.$element = $(element);
      this.keepDisplay = this.$element.is("div");
      this.$baseNode = $(baseTmpl).appendTo(this.container);
      this.$timeDisplay = this.$baseNode.find(".dtp-header .dtp-time");
      this.$dateDisplay = this.$baseNode.find(".dtp-header .dtp-date");
      this.$hourDisplay = this.$baseNode.find(".dtp-header .dtp-hour");
      this.$minDisplay = this.$baseNode.find(".dtp-header .dtp-min");
      this.$secDisplay = this.$baseNode.find(".dtp-header .dtp-sec");
      this.$handleDatetimeDisplay = this.$baseNode.find(".dtp-body .dtp-handler-container .dtp-date");
      this.$upHandler = this.$baseNode.find(".dtp-body .dtp-handler-container .dtp-handler .dtp-up-handler");
      this.$downHandler = this.$baseNode.find(".dtp-body .dtp-handler-container .dtp-handler .dtp-down-handler");
      this.$datetimeContainer = this.$baseNode.find(".dtp-body .dtp-datetime-container");

      this.initialize = {
         date: this.date,
         dtpView: this.dtpView
      }

      this.dtpViewDate = new Date(this.date.getTime());
      this.dtClear();

      this.init();
      this.layout();
      this.dtpViewRender();
   }

   Datetimepicker.prototype.dtpViewRender = dtpViewRender;
   Datetimepicker.prototype.init = init;
   Datetimepicker.prototype.formatRender = formatRender;
   Datetimepicker.prototype.dtClear = dtClear;
   Datetimepicker.prototype.toggle = toggle;
   Datetimepicker.prototype.layout = layout;

   $.fn.datetimepicker = function(options) {
      this.each(function() {
         var $this = $(this);
         var datetimepicker = $this.data("datetimepicker");

         if(!datetimepicker) {
            datetimepicker = new Datetimepicker(this, $.extend({}, options));
            $this.data("datetimepicker", datetimepicker);
         }
      });

      return this;
   }
})(jQuery);