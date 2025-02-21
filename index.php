<?php
	define('version','?version=2.1.5');
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
	<meta name="robots" content="index,follow,archive"/>
	<meta name="Description" content="A beginner-friendly guide for AI newcomers — and a power-up for enthusiasts!" />
	<meta name="Keywords" content="AI online learning easy beginner 2-weeks basics bootcamp" />
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
  <meta name="description" content="“A beginner-friendly guide for AI newcomers — and a power-up for enthusiasts!”">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/images/appicon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="stylesheet" href="assets/css/main.css<?=version?>" type="text/css" />
	<link rel="stylesheet" href="assets/css/dark.css<?=version?>" type="text/css" media="(prefers-color-scheme: dark)" />
  <meta property="og:url" content="https://2weeks.ai/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="2 Weeks AI">
  <meta property="og:description" content="“A beginner-friendly guide for AI newcomers — and a power-up for enthusiasts!”">
  <meta property="og:image" content="https://2weeks.ai/assets/images/cover.png">
	<script src="https://cdn.usefathom.com/script.js" data-spa="auto" data-site="QGGXGFCW" defer></script>
</head>

<body>

	<div id="loader" class="loader"><div class="logo"></div><div class="shadow"></div></div>
	<ul class="training" id="todo-list">
    
    <!-- Intro -->
    <li class="lesson intro">
      <h1><span>2 Weeks</span> AI</h1>
			<div id="bump" class="swipe"><i></i></div>
			<div class="credit"><a href="javascript://" id="donate">Credit</a></div>
    </li>
	 
    <!-- Lessons -->
	 <?php
	 	foreach ($markdownFiles as $filename => $content):
			
			$lessonNumber = substr(str_replace(array("day","-",".md"), " ", $filename), 0, -1);
			$lessonNumber = (int)$lessonNumber;
			$title = "Day ".$lessonNumber;
			if($lessonNumber == 0) { $title = "Welcome"; }
			
			$latest = 15;
			
			echo "
	  
				<li class='lesson' id='lesson-".$lessonNumber."'>
					<a href='javascript://' draggable='false' class='expander'>&#215;</a>
					<div class='header'>
						<h5>".$title."</h5>
					</div>
					<textarea class='markdown-file'>".htmlspecialchars($content)."</textarea>
					<div class='contents overflow'></div>
					<label>
						<input type='checkbox' class='complete-task'>
						<span>Mark as complete</span>
					</label>
				</li>
			";

	  endforeach;
	?>
		<li class="blank">&nbsp;</li>
	</ul>

	<div class="prompt" id="daily">
		<a href='javascript://' class='dismiss'><em>&#215;</em></a>
		<span class='locked-badge'>&#8470; <em id="prompt-number"></em></span>
		<div class='contents' id="daily-file">Er...</div>
	</div>
	
	<div class="prompt" id="about">
		<a href='javascript://' class='dismiss'><em>&#215;</em></a>
		<span class='locked-badge'>About</span>
		<div class='contents'>
			<p><strong>2 Weeks AI</strong> was created and written by Buzz Usborne. Originally designed as a private course for his dad&rsquo;s 75th birthday, it quickly gained traction as more people asked for access. Turns out, making AI fun, non-technical, and grounded in real-world use benefits everyone &mdash; from students to retirees, the AI curious to self-proclaimed AI natives.</p>
			
			<blockquote>If you found this course useful, please consider donating a coffee to help keep it online!<a href="https://buymeacoffee.com/buzz/" target="_blank" title="Donate a coffee" class="button">Donate a coffee!</a></blockquote>
			
			<p><a href="https://buzzusborne.com/" target="_blank" title="Buzz Usborne">Buzz</a> is a coach, startup advisor and software designer, giving him a unique perspective on AI &mdash; seeing it from the lens of the companies building it, the designers shaping it, and the everyday people using it.</p>
			
			<p>One thing has become clear: most AI guides are written for those already deep in the space, leaving behind people with curiosity but no clear starting point.</p>
			
			<p>If you&rsquo;ve heard about AI but never used it, this course is for you. If you&rsquo;ve dabbled in AI but feel like you&rsquo;ve only scratched the surface, <strong>this course is for you</strong>!</p>
		</div>
	</div>
	
	<div class="prompt-background" id="prompt-background">&nbsp;</div>
	
	<script src="//cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
	<script src="//cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
	<script src="//cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js" async=""></script>
	<script src="assets/js/site.js<?=version?>"></script>
	<script src="assets/js/lazysizes.min.js" async=""></script>
	<script src="assets/js/ls.unveilhooks.min.js" async=""></script>
</body>
</html>