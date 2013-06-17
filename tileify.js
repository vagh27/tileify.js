;(function($){		
	
	var defaults = {
		numCols: 5,
		numRows: 5,
		contHeight: 1500,
		autoAnimate: false,
		autoScrollSpeed: 10000,
		clickTrigger: '.tileifyTrigger'
	}

	$.fn.tileify = function(options){

		var config = $.extend({}, defaults, options),
			totalBlocks = config.numCols*config.numRows,
			blockHTML = "",
			a,b,c,x,
			i = 0,
			e = 0,
			posFromTop = 0,
			initialHeight = 0,
			$window = $(window),
			gatherHeights = [],
			sortHeights = [],
			blkWidth = $(document).width()/config.numCols,
			blkHeight = $(document).height()/config.numRows;


		//set up the container
		for(var t = 0; t <= totalBlocks; t++) { blockHTML += "<div class='tileifyBlock'></div>"; }
		$(this).html(blockHTML);
		var blocks = $(this).children('.tileifyBlock');

		blocks.css({width:blkWidth,height:blkHeight,lineHeight:blkHeight+"px"});

		$('body').css({height:(config.contHeight*config.numRows)+100});
		if(config.autoAnimate===true)$("html, body").animate({ scrollTop: $(document).height() }, config.autoScrollSpeed);

		for(e; e <= blocks.length; e+=config.numCols) {
			var col = 1;
			blocks.slice(e,e+config.numCols).each(function(){
				x  = Math.floor((Math.random()*((initialHeight+config.contHeight)-initialHeight))+initialHeight);
				gatherHeights.push(x);
				sortHeights.push(x);
				$(this).css({top:x,left:((col-1)*blkWidth)});
				col++;
			});
			initialHeight += config.contHeight;
		}

		sortHeights.sort(function(a,b){return a - b});

		//$.get('count.php', function(data) { 
			$window.bind('scroll',function(){
				var scrollHeight =  $window.scrollTop();
				if(i%config.numCols===0 && i!=0) { posFromTop = blkHeight*(i/config.numCols); }
				var pos = scrollHeight + posFromTop;
				if(pos>sortHeights[i]){
					var fixThis = $.inArray(sortHeights[i], gatherHeights);
					blocks.eq(fixThis).addClass('fixThis').css({top:posFromTop});
					//blocks.eq(fixThis).addClass('color');
					/*if (!blocks.eq(fixThis).hasClass('red')){
						//var whichPic = Math.floor(Math.random()*(picArray.length));
						//blocks.eq(fixThis).addClass('bgImage').css({background:'url('+picArray[whichPic]+') no-repeat center '+(blkHeight+1)+'px #dddddd'});
						blocks.eq(fixThis).addClass('color');
					}*/
					i++;
				}
			});
		//});
		
		$(config.clickTrigger).click(function(){ $("html, body").animate({ scrollTop: $(document).height() }, config.autoScrollSpeed); });

		return this;
	};

}(jQuery));