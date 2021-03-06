/** 
 * 常量命名空间 
 */
window.STATICS = {};
window.STATICS.keysMap = {
	ENTER: 13
} 

/** 
 * App-View
 * 页面级View, 请保持唯一, 且作为入口. 
 */
window.AppView = Backbone.View.extend({
	el: $('#J_app'),
	t: null,
	events: {
		'click #J_listEdit': 'listEdit',
		'click .J_listRemove': 'listDestroy',
		'click .sidebar-nav .nav-list a': 'listSelect',
		'click #J_globalAlert .close': 'closeGlobalNotice'
	},
	/** 
	 * 初始化
	 * 选择第一条list作为激活的list 
	 */
	initialize: function(){
		var _id = $(this.el).find('.sidebar-nav li:first').attr('data-id');
		if (window.STATICS) {window.STATICS.currentList = _id;}

		var _notice = $('.global-notice').text().trim();
		if (_notice) {
			this.initGlobalNotice(_notice);
		}
	},
	/** 
	 * 进入/退出list编辑状态 
	 */
	listEdit: function(e){
		var _stat = $(e.target).attr('data-state');
		if (_stat === 'hide') {
			$('.sidebar-nav .nav-list i').removeClass('fn-hide');
			$(e.target).attr('data-state','show');
			$(e.target).text('back');
		}
		if (_stat === 'show') {
			$('.sidebar-nav .nav-list i').addClass('fn-hide');
			$(e.target).attr('data-state','hide');
			$(e.target).text('edit');
		}
	},
	/** 
	 * 销毁list 
	 */
	listDestroy: function(e){
		var _target = $(e.target),
			_id = _target.parents('.nav-item').attr('data-id'),
			_actionUrl = '/list/'+_id;
		$('#J_listDestroy').attr('action',_actionUrl);
		$('#J_listDestroy')[0].submit();
		e.preventDefault();
		e.stopPropagation();
	},
	/** 
	 * 选中一个list 
	 */
	listSelect: function(e){
		var _target = $(e.target),
			_id = _target.parents('.nav-item').attr('data-id');
		if (_id != window.STATICS.currentList) {
			window.STATICS.currentList = _id;
			/** 
			 * 清除tasksView的事件代理, 然后移除tasksView, 否则会有重复绑定问题. 
			 */
			window.tasksView.undelegateEvents();
			window.tasksView = new window.TasksView();
			_target.parents('.nav-item').addClass('active').siblings().removeClass('active');
		}
		e.preventDefault();
		e.stopPropagation();
	},
	initGlobalNotice: function(notice){
		$('#J_globalAlert').append($('<span>'+notice+'</span>'));
		$('#J_globalAlert').removeClass('fn-hide');
		this.t = setTimeout(function(){
			$('#J_globalAlert').fadeOut('slow');
		},5000);
	},
	closeGlobalNotice: function(e){
		$('#J_globalAlert').addClass('fn-hide');
		clearTimeout(this.t);
	}
})

window.appView = new window.AppView();

