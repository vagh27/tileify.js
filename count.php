<?php
	$path = $_REQUEST['path'];
	$count = glob($path.'*.*');
	foreach($count as $filename) {
    	echo $filename . ",";
 	}
?>