<?php
	define('version','?version=6.3');
	function getMarkdownFilesContent($directory) {
	    $files = glob($directory . '/*.md');
	    $contentArray = [];

	    foreach ($files as $file) {
	        $filename = basename($file);
	        $content = file_get_contents($file);
	        $contentArray[$filename] = $content;
	    }

	    return $contentArray;
	}
	$markdownFiles = getMarkdownFilesContent('content');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>2 Weeks AI</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta http-equiv="Content-Type" content="text/html" charset="utf-8"/>
  <link rel="preconnect" href="//fonts.googleapis.com">
  <link rel="preconnect" href="//fonts.gstatic.com" crossorigin>
  <link href="//fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
  <meta name="msapplication-TileColor" content="#8e2de2">
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale = 1.0, initial-scale=1.0, user-scalable = no" />
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="2 Weeks AI">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/images/aindre.png">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/images/aindre.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/images/aindre.png">
  <link rel="stylesheet" href="assets/css/main.css<?=version?>" type="text/css" />
  <meta property="og:url" content="https://2weeks.ai/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="2 Weeks AI">
  <meta property="og:description" content="A 2 week AI bootcamp, from novice to AI proficient">
  <meta property="og:image" content="https://ai.buzzusborne.com/assets/images/cover.png">
</head>

<body>

	<div id="loader" class="loader"><div class="logo"></div></div>
	<ul class="training modal" id="todo-list">
    
    <!-- Intro -->
    <li class="lesson intro completed">
      <h1><span>2</span> Weeks AI</h1>
    </li>
	 
    <!-- Lessons -->
	 <li class='lesson expose' id='lesson-1'>		
		<?php
		
		$allLessons = NULL;
		
		foreach ($markdownFiles as $filename => $content):
			$allLessons .= "\n\n***\n\n".$content;
		endforeach;
			
		?>
			<textarea class='markdown-file'><?=htmlspecialchars($allLessons)?></textarea>
			<div class='contents overflow'></div>
		</li>
		<li class="blank">&nbsp;</li>
	</ul>

	<div class="prompt" id="daily">
		<a href='javascript://' class='dismiss'><em>&#215;</em></a>
		<span class='locked-badge'>Daily Prompt &#8470; <em id="prompt-number"></em></span>
		<div class='contents' id="daily-file">Er...</div>
	</div>
	<div class="prompt-background" id="prompt-background">&nbsp;</div>
	
	<script src="//cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
	<script src="//cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
	<script src="//cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js"></script>
	<script src="assets/js/site.js<?=version?>"></script>
	<script src="assets/js/daily.js<?=version?>"></script>
</body>
</html>