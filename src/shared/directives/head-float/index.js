'use strict';

angular.module('app.shared')
  .directive('ngHeadFloat', ['$timeout', '$parse', '$compile', '$templateCache', ($timeout, $parse, $compile, $templateCache) => {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        let freezeColumnNum = 2; // freeze cols, subject to move to attribute
        let columnsWidth = 0; // col width of freeze columns

        /**
         * below is a bunch of dom element cache that would be read frequently
         */
        let clonePanel = null;
        let clonePanelHead = null;
        let freezeWidth = null;
        let tabId = attrs.ngHeadFloat;
        let floatBarTop = null;
        let orgHeader = null;
        let panel = null;
        let domBody = $('body')[0];
        let tabHead = null;
        let table = null;
        let panelHead = null;
        let headerTitle = null;
        let scroll_header_title = null;
        let scroll_header = null;
        let scroll_fix_header = null;
        let floatTableHead = null;
        let floatTableHeadClone = null;
        let panelBody = null;

        /**
         * update size when resize
         */
        $(window).on('resize', $.debounce(() => {
          getColWidth(true);
          updateView();
          updateElementView();
        }, 300));


        /**
         * to init styles
         */
        $timeout(() => {
          floatBarTop = floatBarTop || $("#float_bar_top");
          orgHeader = orgHeader || $('#table_float_table_head_div_' + tabId);
          panel = panel || $('#main_table_panel_' + tabId);
          tabHead = tabHead || $('#tbhead_' + tabId);
          panelHead = panelHead || $('#table_float_table_head_div_' + tabId);
          headerTitle = headerTitle || $('#tbhead_' + tabId);
          table = table || $("#main_table_" + tabId);
        }, 1000);
        
        /**
         * bind events
         */
        element.scroll(onElementScroll);
        $(window).scroll(onWindowScroll);

        /**
         * horizontal scroll
         */
        function onElementScroll() {
          var sl = Math.max(element[0].scrollLeft, document.documentElement.scrollLeft);
          scroll_header
            && scroll_header.length
            // && (scroll_header[0].style.left = element[0].getClientRects()[0].left + 'px');
            && (scroll_header[0].style.left = -sl + element.offset().left + 'px');
          table = table || $("#main_table_" + tabId);
				
          if (!clonePanel) {
            panelBody = panelBody || $('#main_table_panel_body_' + tabId);
            clonePanel = panelBody.clone().attr('id', 'main_table_panel_body_copy_' + tabId);
            clonePanel.find('.float_scroll_bar').remove();
            clonePanel.css({ 'position': 'absolute', 'width': getColWidth(), 'background-color': '#ffffff', 'top': panelBody.position().top });
            clonePanel.find('input')
              .attr('disabled', 'disabled')
              .attr('tabindex', -1);
            
            panelHead = panelHead || $('#table_float_table_head_div_' + tabId);
					
            clonePanelHead = panelHead.clone().attr('id', 'table_float_table_head_div_copy_fix_' + tabId);//更改复制的表格id
            clonePanelHead.css({
              'position': 'absolute',
              'width': getColWidth(),
              'background-color': '#ffffff',
              'top': panelHead.position().top,
              'overflow': 'hidden',
            });
            panelHead.after(clonePanelHead);
            panelBody.after(clonePanel);
            updateElementView();
          }
        }

        /**
         * vertical scroll
         */
        function onWindowScroll() {
          floatBarTop = floatBarTop || $("#float_bar_top");
          orgHeader = orgHeader || $('#table_float_table_head_div_' + tabId);
          panel = panel || $('#main_table_panel_' + tabId);
          tabHead = tabHead || $('#tbhead_' + tabId);
          table = table || $('#main_table_' + tabId);
          panelHead = panelHead || $('#table_float_table_head_div_' + tabId);
          headerTitle = headerTitle || $('#tbhead_' + tabId);
          
          
          var panelHeight = panel.height();
          var floatTopHeight = floatBarTop.height();
          var scroll_top = domBody.scrollTop - element.offset().top + floatTopHeight + tabHead.height();//判断是否到达窗口顶部
          if (scroll_top > 0 && scroll_top < panelHeight) {
            if (scroll_header_title && scroll_header_title._isVisiable) return;

            /**
             * create everything when there is nothing.
             */
            if (!scroll_header_title) {
              scroll_header_title = $($templateCache.get('app/fx/components/tab-head/tab-head.html'))
                .removeAttr('id')
                .removeAttr('ng-if')
                .removeAttr('ng-style');
              
              floatTableHead = $('#table_float_table_head_' + tabId);
              floatTableHeadClone = floatTableHead
                .clone()
                .removeAttr('id')
                .css({
                  'width': floatTableHead.width()
                });

              scroll_header = floatTableHead
                .clone()
                .attr('id', 'table_float_table_head_copy_' + tabId)//更改复制的表格id
                .css({ zIndex: 2 });
              scroll_fix_header = scroll_fix_header || $('<div></div>');
              scroll_fix_header.append(floatTableHeadClone);
              
              $compile(scroll_header_title)($scope);
              
              element.after(scroll_header_title);
              element.after(scroll_header);
              element.after(scroll_fix_header);
              $scope.$apply();
            } else {
              /**
               * update visible state
               */
              scroll_header_title.show();
              scroll_header_title._isVisiable = true;

              scroll_header.show();
              scroll_header._isVisiable = true;

              scroll_fix_header.show();
              scroll_fix_header._isVisiable = true;
            }

            /**
             * update styles anyway
             */
            updateView();
          } else {
             /**
             * update visible state
             */
            if (scroll_header_title) {
              scroll_header_title.hide();
              scroll_header_title._isVisiable = false;
            }
            if (scroll_header) {
              scroll_header.hide();
              scroll_header._isVisiable = false;
            }
            if (scroll_fix_header) {
              scroll_fix_header.hide();
              scroll_fix_header._isVisiable = false;
            }
          }
        }

        function updateView() {
          if (!scroll_header_title) return;
          var orgHeaderWidth = orgHeader.width();
          var floatTopHeight = floatBarTop.height();
          floatTableHeadClone.width(floatTableHead.width());
          scroll_header_title.css({ 'position': 'fixed', 'top': floatTopHeight, 'width': orgHeaderWidth, 'z-index': 3 });
          scroll_header.css({ 'position': 'fixed', 'top': floatTopHeight + headerTitle.height(), 'width': orgHeaderWidth, 'border-bottom': '1px solid #efefef' });
          scroll_fix_header.css({ 'position': 'fixed', 'top': floatTopHeight + headerTitle.height(), 'width': getColWidth(), 'overflow': 'hidden', 'z-index': 3 });
          var sl = Math.max(element.scrollLeft(), $(document).scrollLeft());
          scroll_header.css('left', -sl + $(element).offset().left + 'px');
        }

        /**
         * update styles
         */
        function updateElementView() {
          if (!clonePanel) return;
          clonePanel.css({ 'width': getColWidth() });
          clonePanelHead.css({ 'width': getColWidth() });
        }

        /**
         * update colWith or just return it.
         * @param {boolean} flag update flag
         */
        function getColWidth(flag) {
          if (!table) return;
          if (columnsWidth > 0 && !flag) return columnsWidth;
          columnsWidth = 0;
          var columnsNumber = 0;
          table
            .find("td:lt(" + freezeColumnNum + "), th:lt(" + freezeColumnNum + ")")
            .each((index, ele) => {
              if (columnsNumber++ >= 2) return;
              columnsWidth += $(ele).outerWidth(true);
            });
          columnsWidth += 2;//显示边线
          console.log(columnsWidth);
          return columnsWidth;
        }

        $scope.$on('$destroy', () => {
          

          element.unbind(onElementScroll);
          window.unbind(onWindowScroll);

          clonePanel || clonePanel.remove();
          clonePanelHead || clonePanelHead.remove();
          orgHeader || orgHeader.remove();
          panel || panel.remove();
          headerTitle || headerTitle.remove();
          scroll_header_title || scroll_header_title.remove();
          scroll_header || scroll_header.remove();
          scroll_fix_header || scroll_fix_header.remove();
          floatTableHead || floatTableHead.remove();

          freezeColumnNum = null;
          columnsWidth = null;
          clonePanel = null;
          clonePanelHead = null;
          freezeWidth = null;
          tabId = null;
          floatBarTop = null;
          orgHeader = null;
          panel = null;
          domBody = null;
          tabHead = null;
          table = null;
          panelHead = null;
          headerTitle = null;
          scroll_header_title = null;
          scroll_header = null;
          scroll_fix_header = null;
          floatTableHead = null;
        });
      }
    }
  }]);
