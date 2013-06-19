;(function($){		
	
	var defaults = {
		numCols: 5,
		numRows: 5,
		contHeight: 1500,
		autoAnimate: true,
		autoScrollSpeed: 10000,
		clickTrigger: '.tileifyTrigger',
		photoFile: null,
		scrollBlockStyles: { 
			'background-color':'#ccc',
			'opacity':'0.5',
			'border' : '1px solid #fff'
		},
		fixedBlockStyles: { },
		onEnd: function(){  }
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
			gatherHeights = [],
			sortHeights = [],
			blkWidth = $(document).width()/config.numCols,
			blkHeight = $(document).height()/config.numRows,
			imageWall = [];


		//set up the container
		for(var t = 0; t <= totalBlocks; t++) { blockHTML += "<div class='tileifyBlock'></div>"; }
		$(this).html(blockHTML);
		var blocks = $(this).children('.tileifyBlock');

		//custom user styles followed by styles we just gotta override to make this thing work
		blocks.css(config.scrollBlockStyles).css({width:blkWidth,height:blkHeight,'position':'absolute'});

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

		if(config.photoFile != null){
			$.ajax({
				url: config.photoFile,
				success: function(data){
					buildImageWall(data);  	
				},
				error: function(e){ alert('there seems to be a problem with your photoFile path') }
			});
		}
		else{ doScroll(null); }
		

		function buildImageWall(data){
			$(data).find("a:contains(.jpg)").each(function(){
				var images = $(this).attr("href");
				imageWall.push(images);
			});
			doScroll(imageWall);
		}
		
		function doScroll(imageWall){
			$(window).bind('scroll',function(){
				var scrollHeight =  $(window).scrollTop();
				if(i%config.numCols===0 && i!=0) { posFromTop = blkHeight*(i/config.numCols); }
				var pos = scrollHeight + posFromTop;
				if(pos>sortHeights[i]){
					var fixThis = $.inArray(sortHeights[i], gatherHeights);
					blocks.eq(fixThis).css(config.fixedBlockStyles).css({top:posFromTop,'position':'fixed'}).addClass('tileifyBlockFixed');

					//add background image from imageWall array
					if(imageWall!=null){
						var whichPic = Math.floor(Math.random()*(imageWall.length));
						blocks.eq(fixThis).css({background:'url('+config.photoFile + "/" + imageWall[whichPic]+') no-repeat center center #dddddd'});
						//if you want the image hidden on load blocks.eq(fixThis).css({background:'url('+config.photoFile + "/" + imageWall[whichPic]+') no-repeat center '+(blkHeight+1)+'px #dddddd'});
					}
					i++;

					//trigger onEnd function
					if(i==(sortHeights.length-1)) config.onEnd();
				}
			});	
		}

		//trigger scroll onclick
		$(config.clickTrigger).click(function(){ $("html, body").animate({ scrollTop: $(document).height() }, config.autoScrollSpeed); });

		return this;
	};

}(jQuery));