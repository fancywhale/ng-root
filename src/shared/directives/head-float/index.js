'use strict';

angular.module('app.shared')
  .directive('ngHeadFloat', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function ($scope, element, attrs, ngModel) {
        var clonePanel = null;
        var clonePanelHead = null;
        var freezeColumnNum = 2;
        var freezeWidth = null;
        var tabId = attrs.ngHeadFloat;
        $(element).scroll(function () {
          var sl = Math.max($(element).scrollLeft(), document.documentElement.scrollLeft);
          $('#table_float_table_head_copy_' + tabId).css('left', -sl + $(element).offset().left + 'px');
				
          if (!clonePanel) {
            var panel = $('#main_table_panel_body_' + tabId);
            var columnsWidth = 0;
            var columnsNumber = 0;
            $("#main_table_" + tabId).find("td:lt(2), th:lt(2)").each(
              function () {
                if (columnsNumber++ >= 2) return;
                columnsWidth += $(this).outerWidth(true);
              });
            columnsWidth += 2;//显示边线
					
            clonePanel = panel.clone().attr('id', 'main_table_panel_body_copy_' + tabId);
            clonePanel.find('.float_scroll_bar').remove();
            clonePanel.css({ 'position': 'absolute', 'width': columnsWidth, 'background-color': '#ffffff', 'top': panel.position().top });
            clonePanel.find('input')
              .attr('disabled', 'disabled')
              .attr('tabindex', -1);
            
            panel.after(clonePanel);
          }
          if (!clonePanelHead) {
            var panelHead = $('#table_float_table_head_div_' + tabId);
            var columnsWidth = 0;
            var columnsNumber = 0;
            $("#main_table_" + tabId).find("td:lt(2), th:lt(2)").each(
              function () {
                if (columnsNumber++ >= 2) return;
                columnsWidth += $(this).outerWidth(true);
              });
            columnsWidth += 2;//显示边线
					
            clonePanelHead = panelHead.clone().attr('id', 'table_float_table_head_div_copy_fix_' + tabId);//更改复制的表格id
            clonePanelHead.css({ 'position': 'absolute', 'width': columnsWidth, 'background-color': '#ffffff', 'top': panelHead.position().top, 'overflow': 'hidden' });
            panelHead.after(clonePanelHead);
          }
        });
			
        var $element = $(element);
        var scroll_header = null;
        var scroll_header_title = null; //表头上方标题行
        var scroll_fix_header = null;
        $(window).scroll(function () {
          var floatBarTop = $("#float_bar_top");
          var floatTopHeight = floatBarTop.height();
          var orgHeaderWidth = $('#table_float_table_head_div_' + tabId).width();
          var panel = $('#main_table_panel_' + tabId);
          var panelHeight = panel.height();
          var scroll_top = $('body').scrollTop() - $element.offset().top + floatTopHeight + $('#tbhead_' + tabId).height();//判断是否到达窗口顶部
          if (scroll_top > 0 && scroll_top < panelHeight) {
            if (scroll_header) return;
            if (scroll_header_title) return;
            var panelHead = $('#table_float_table_head_div_' + tabId);
            var columnsWidth = 0;
            var columnsNumber = 0;
            var table = $('#main_table_' + tabId);
            table.find("td:lt(" + freezeColumnNum + "), th:lt(" + freezeColumnNum + ")").each(
              function () {
                if (columnsNumber++ >= 2) return;
                columnsWidth += $(this).outerWidth(true);
              });
            columnsWidth += 2;//显示边线
            var headerTitle = $('#tbhead_' + tabId);
            scroll_header_title = headerTitle.clone().removeAttr('id');
            scroll_header_title.css({ 'position': 'fixed', 'top': floatTopHeight, 'width': orgHeaderWidth, 'z-index': 1 });

            var header = $('#table_float_table_head_' + tabId);
            scroll_header = header.clone().attr('id', 'table_float_table_head_copy_' + tabId);//更改复制的表格id
            scroll_header.css({ 'position': 'fixed', 'top': floatTopHeight + headerTitle.height(), 'width': orgHeaderWidth, 'border-bottom': '1px solid #efefef' });
	            	
            scroll_fix_header = $('<div></div>').css({ 'position': 'fixed', 'top': floatTopHeight + headerTitle.height(), 'width': columnsWidth, 'overflow': 'hidden', 'z-index': 1 });
            scroll_fix_header.append(header.clone().removeAttr('id').css({ 'width': header.width() }));
            var sl = Math.max($(element).scrollLeft(), $(document).scrollLeft());
            scroll_header.css('left', -sl + $(element).offset().left + 'px');
            $element.after(scroll_header_title);
            $element.after(scroll_header);
            $element.after(scroll_fix_header);
          } else {
            if (scroll_header_title) {
              scroll_header_title.remove();
              scroll_header_title = null;
            }
            if (scroll_header) {
              scroll_header.remove();
              scroll_header = null;
            }
            if (scroll_fix_header) {
              scroll_fix_header.remove();
              scroll_fix_header = null;
            }
          }
        });
      }
    }
  }]);
