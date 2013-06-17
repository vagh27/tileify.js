#tileify.js
##a plugin that will have more practical uses in subsequent iterations

Here is a demo of the current plugin:
(http://tileify.johnvaghi.com)

Here is where we're looking to go with it once I plugin-ify everything:
(http://coffeeery.com)

Currently, here are the config options followed by their defaults:
	$('.tileThis').tileify({
		numCols: 5, //blocks per column
		numRows: 5, //blocks per row
		contHeight: 1500, //each row represents a height of by which that row is randomly assigned a location within - this is that height
		autoAnimate: false, //animate the scroll on pageload
		autoScrollSpeed: 10000, //animate on pageload scroll-speed
		clickTrigger: '.tileifyTrigger' //if you want to trigger the scroll on click, here's your chance
	});

We're looking to add:
	- ability to reverse the tiles if you scroll up
	- ability to customize block styles/content
	- match game
	- grab images from a directory and make them the bg images of the blocks

