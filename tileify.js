/*
 *  Project: tileify.js
 *  Description: a plugin that will have more practical uses in subsequent iterations
 *  Author: John Vaghi
 *  License: 
 */

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
		fixedBlockStyles: { 
            'background-position':'center center',
        },
		onEnd: function(){  }
	}

	$.fn.tileify = function(options){

		var config = $.extend({}, defaults, options),
			totalBlocks = config.numCols*config.numRows,
			blockHTML = "",
			a,b,c,x,
			i = 0,
			e = 0,
			screenHeight = $(document).height();
			posFromTop = 0,
			initialHeight = 0,
			gatherHeights = [],
			sortHeights = [],
			blkWidth = $(document).width()/config.numCols,
			blkHeight = screenHeight/config.numRows,
			imageWall = [],
            that = this;
        
        //load images first
        if(config.photoFile != null){
			$.ajax({
				url: 'count.php',
				data: {
			    	path: config.photoFile
			    },
				success: function(data){
					buildImageWall(data);  	
				},
				error: function(e){ 
					console.log(e);
					alert('there seems to be a problem with your photoFile path') 
				}
			});
		}
		else{ setUpContainer(null); }
        
        //if images, put image path in array
        function buildImageWall(data){
			//remove last comma
			data = data.substring(0, data.length - 1);
			var imageWall = data.split(",");
			setUpContainer(imageWall);
		}
    
        //build html and add it to selector
        function setUpContainer(imageWall){
            //set up the container
            for(var t = 0; t < totalBlocks; t++) { 
                var styles = "";
                if(imageWall){
                    var whichPic = Math.floor(Math.random()*(imageWall.length));
                    styles += " background:url(" + imageWall[whichPic] + ") no-repeat center -999px #dddddd;";
                }
                blockHTML += "<div style='" + styles + "' class='tileifyBlock'></div>"; 
            }
            
            $(that).html(blockHTML);

            var blocks = $(that).children('.tileifyBlock');
     
            //custom user styles followed by styles we just gotta override to make this thing work
            blocks.css(config.scrollBlockStyles).css({width:blkWidth,height:blkHeight,'position':'absolute'});
    
            //est height of the page
            $('body').css({height:(config.contHeight*config.numRows)+50+config.contHeight});
            
            //abs position blocks / push heights into arrays
            for(e; e <= blocks.length; e+=config.numCols) {
                var col = 1;
                blocks.slice(e,e+config.numCols).each(function(){
                    x  = Math.floor((Math.random()*((initialHeight+config.contHeight)-initialHeight))+initialHeight+screenHeight);
                    gatherHeights.push(x);
                    sortHeights.push(x);
                    $(this).css({top:x,left:((col-1)*blkWidth)});
                    col++;
                });
                initialHeight += config.contHeight;
            }
    
            sortHeights.sort(function(a,b){return a - b});
     
            doScroll(blocks);
        }
        
        //bind scroll function and trigger scroll or bind click function to scroll
		function doScroll(blocks){
            
			$(window).bind('scroll',function(){
				var scrollHeight =  $(window).scrollTop();
				if(i%config.numCols===0 && i!=0) { posFromTop = blkHeight*(i/config.numCols); }
				var pos = scrollHeight + posFromTop;
				if(pos>sortHeights[i]){
                    //fix block to bottom of previous row
					var fixThis = $.inArray(sortHeights[i], gatherHeights);
					blocks.eq(fixThis).css(config.fixedBlockStyles).css({top:posFromTop,'position':'fixed'}).addClass('tileifyBlockFixed');
					i++;

					//trigger onEnd function
					if(i==(sortHeights.length-1)) config.onEnd();
				}
			});	
            
            //scroll automatically
		    if(config.autoAnimate===true)$("html, body").animate({ scrollTop: $(document).height() }, config.autoScrollSpeed);
            
            //scroll onclick
            else $(config.clickTrigger).click(function(){ $("html, body").animate({ scrollTop: $(document).height() }, config.autoScrollSpeed); });
        }    

		return this;
	};

}(jQuery));