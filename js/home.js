var app=angular.module('app',['ui.router']);

app.config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider){
	$urlRouterProvider.when('','/word');
	$urlRouterProvider.otherwise('');
	$stateProvider.state('word',{
		url:'/word',
		templateUrl:'html/word.html',
//		controller:'con'
	}).state('image',{
		url:'/image',
		templateUrl:'html/image.html',
//		controller:'con'
	}).state('music',{
		url:'/word#music',
		templateUrl:'html/word.html#music',
//		controller:'con'
	}).state('funny',{
		url:'/funny',
		templateUrl:'html/funny.html',
		controller:'con'
	}).state('movie',{
		url:'/movie',
		templateUrl:'html/movie.html',
//		controller:'con'
	});
}]);

app.service("$httpService",function($window,$document){
	this.jsonP=function(url,callback){
		//定义函数
		// $window[函数的名字]=function(){}
		$window["JSON_CALLBACK"]=callback;
		
		var scriptElement=$document[0].createElement("script");
		scriptElement.src=url;
		$document[0].body.appendChild(scriptElement);
	};
});

app.controller("con",["$scope","$interval","$http","$httpService",function($scope,$interval,$http,$httpService){
	//返回顶部
	$scope.goTop=function(){
		$('body').animate({'scroll-top':0},500);
	};
	//wait
	$scope.wait=function(){
		alert('敬请期待！');
	};
	//轮播
	$scope.flag={
		'num':0,
		'time':$interval(lunbo,5000),
		'state':true,
		'ulLunbo':$('.slider-main-ul'),
		'knob':$('.knob')
	};
	var current_w=(window.screen.width-1920);
	function lunbo(){
		switch($scope.flag.num){
			case 0:
				$scope.flag.ulLunbo.animate({'left':current_w/2+'px'},500);
				$scope.flag.knob.animate({'left':'304px'},500);
				$scope.flag.num=1;
				break;
			case 1:
				$scope.flag.ulLunbo.animate({'left':current_w+'px'},500);
				$scope.flag.knob.animate({'left':'614px'},500);
				$scope.flag.num=2;
				break;
			case 2:
				$scope.flag.ulLunbo.animate({'left':'0px'},500);
				$scope.flag.knob.animate({'left':'0px'},500);
				$scope.flag.num=0;
				break;
		}
	}
	$scope.goLeft=function(){
		if($scope.flag.state){
			$scope.flag.ulLunbo.animate({'left':current_w/2+'px'},500);
			$scope.flag.knob.animate({'left':'304px'},500);
			$scope.flag.state=false;
		}else{
			$scope.flag.ulLunbo.animate({'left':'0px'},500);
			$scope.flag.knob.animate({'left':'0px'},500);
			$scope.flag.state=true;
		}
	};
	$scope.goRight=function(){
		if($scope.flag.state){
			$scope.flag.ulLunbo.animate({'left':current_w/2+'px'},500);
			$scope.flag.knob.animate({'left':'304px'},500);
			$scope.flag.state=false;
		}else{
			$scope.flag.ulLunbo.animate({'left':current_w+'px'},500);
			$scope.flag.knob.animate({'left':'614px'},500);
			$scope.flag.state=true;
		}
	};
	//音乐
	$http.get('json/music.json')
		.success(function(data){
			$scope.data=data;
//			console.dir($scope.data);
		});
	$scope.play=function(i){
		var audio=$('audio');
		var play_pause=$('.circle>div').eq(i);
		var state=play_pause.hasClass('playSong');
		var round=$('.img-circle').eq(i);
		if(state){
			var bro=audio.eq(i).parent().siblings('div').find('audio');
			for(var j=0;j<bro.length;j++){
				bro[j].pause();
			}
			play_pause.parent().parent().siblings('div').find('div>div').removeClass('pauseSong').addClass('playSong');
			round.parent().siblings('div').find('img').removeClass('_round');
			
			audio[i].play();
			play_pause.removeClass('playSong').addClass('pauseSong');
			round.addClass('_round');
		}else{
			audio[i].pause();
			play_pause.removeClass('pauseSong').addClass('playSong');
			round.removeClass('_round');
		}
	};
	//趣事
	$http.get('json/funny.json')
		.success(function(funny){
			$scope.funny=funny;
//			console.dir($scope.funny);
		});
	$scope.enjoy=function(){
		if($scope.text1 && $scope.text2){
			alert('分享成功！');
			$scope.funny.push({
				id:$scope.funny.length+1,
				title:$scope.text1,
				content:$scope.text2,
				img:'img/bg.jpg'
			});
		}else{
			alert('标题或内容不能为空！');
		}
		$scope.text1='';
		$scope.text2='';
	}
	$scope.edit=function(i){
		var $h3T=$('.change').parent().siblings('h3').eq(i);
		var $divC=$('.change').siblings('div').eq(i);
		if($('.change').eq(i).text()=='修改'){
			$('.change').eq(i).text('保存');
			$h3T.attr('contenteditable',true);
			$divC.attr('contenteditable',true);
		}else{
			$('.change').eq(i).text('修改');
			$h3T.attr('contenteditable',false);
			$divC.attr('contenteditable',false);
		}
	}
	$scope.del=function(id){
		if(confirm('您确定要删除么？')){
			for(var i=0;i<$scope.funny.length;i++){
				if($scope.funny[i].id==id){
					$scope.funny.splice(i,1);
				}
			}
		}
	}
	//电影
	var urlTest="https://api.douban.com/v2/movie/top250?callback=JSON_CALLBACK";
	$httpService.jsonP(urlTest,function(data){
		//脏检查
		$scope.$apply(function(){
			$scope.arr=data.subjects;
		});
	});
	
}]);

