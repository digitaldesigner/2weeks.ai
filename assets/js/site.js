$(document).ready(function() {
    // Time limit for displaying the "New" badge (24 hours in milliseconds)
    const badgeVisibleDuration = 24 * 60 * 60 * 1000; // 24 hours
    //const badgeVisibleDuration = 10 * 60 * 1000; // 10 minutes
    
    // Load tasks and check if "New" badge should be displayed
    function loadTasks() {
        $('#todo-list li.lesson').each(function(index, element) {
            const isChecked = localStorage.getItem(`task-${index}`);
            const firstSeenTimestamp = localStorage.getItem(`task-seen-${index}`);

            // Check task completion status
            if (isChecked === 'true') {
                $(this).find('input[type="checkbox"]').prop('checked', true);
                $(this).addClass('completed');
            }

            // Handle "New" badge visibility
            if (!firstSeenTimestamp) {
                // If there's no timestamp, store the current time as the first seen time
                const now = Date.now();
                localStorage.setItem(`task-seen-${index}`, now);
            } else {
                const timeElapsed = Date.now() - parseInt(firstSeenTimestamp, 10);
                if (timeElapsed > badgeVisibleDuration) {
                    $(this).find('.new-badge').remove();
                }
            }
        });
    }

    // Save the completion state of the task to localStorage
    function saveTaskState(index, isChecked) {
        localStorage.setItem(`task-${index}`, isChecked);
    }
    
    // Scroll to the next lesson
    function scrollToNextLesson(){
      var firstIncomplete = $('li.lesson').not('.completed').first();
      var container = $('#todo-list');
      if (firstIncomplete.length) { 
        var thislesson = $(firstIncomplete[0]);
        var containerWidth = container.width();
        var elementOffset = thislesson.position();
        var elementWidth = thislesson.outerWidth();
        var scrollPosition = elementOffset.left - (containerWidth / 2) + (elementWidth / 2);
        var viewportoffset = $(window).width() * 0.05;
        container.animate({scrollLeft:(scrollPosition - viewportoffset)}, 500);
      } else {
        container.scrollLeft(container.prop("scrollWidth"));
      }
    }
    
    // Daily prompts
    function showDailyPrompt(){
      var countTotalLessons = $('#todo-list .lesson').not('.intro').length;
      var countCompleteLessons = $('#todo-list .lesson.completed').not('.intro').length;
      console.log(countCompleteLessons+' completed of '+countTotalLessons+' total.');
      if(countTotalLessons === countCompleteLessons){
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let savedDate = localStorage.getItem("startDate");
        if(!savedDate){
          localStorage.setItem("startDate", today);
          savedDate = today;
        } else { 
          savedDate = new Date(savedDate);
          savedDate.setHours(0, 0, 0, 0);
        }
        const diffInDays = Math.floor((today - savedDate) / (1000 * 60 * 60 * 24))+1;
        const formattedDiffInDays = diffInDays.toString().padStart(2, "0");

        // Load Content
        const promptFile = `daily/prompt-${formattedDiffInDays}.md`;
        $.get(promptFile).done(function(markdownContent) {
          $('#prompt-number').html(diffInDays)
          var openLesson = $('li.expose');
          if (!openLesson.length) {
            const renderer = new marked.Renderer();
            renderer.blockquote = function(text) {
              return '<blockquote>' + text.text+ '<button>Try</button></blockquote>';
            };
            marked.use({ renderer });
            $('#daily-file').html(marked.parse(markdownContent));
            $('#daily').removeClass('open').addClass('open');
            $('#prompt-background').show();
          }
        }).fail(function() {
          console.log('Fresh out of daily prompts');
        });
      }
    }
    
    // Parse the contents
		$('.markdown-file').each(function() {
			var markdownContent = $(this).val();
			const renderer = new marked.Renderer();

			renderer.blockquote = function(text) {
				return '<blockquote>' + text.text+ '<button>Try</button></blockquote>';
			};

			marked.use({ renderer });
			$(this).parent().find('.contents').hide().html(marked.parse(markdownContent)).delay(200).fadeIn(200);
			$(this).fadeOut(200,function(){
				$(this).remove();
			});
		});

    // Mark item as completed on checkbox click
    $('#todo-list').on('change', '.complete-task', function(e) {
        const index = $(this).closest('li').index();
        const isChecked = $(this).is(':checked');
        e.preventDefault();
        
        if (isChecked) {
            $(this).closest('li.lesson').addClass('completed');
            
            const defaults = {
              spread: 360,
              ticks: 50,
              gravity: 0,
              decay: 0.94,
              startVelocity: 30,
              shapes: ["star"],
              colors: ["47C47D"],
            };

            function shoot() {
              confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ["star"],
              });

              confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ["circle"],
              });
            }

            setTimeout(shoot, 0);
            setTimeout(shoot, 100);
            setTimeout(shoot, 200);
            
            var element = $(this).closest('li.lesson');
            element.removeClass('expose').find('.contents').scrollTop(0);
            $('body').removeClass('expose');
            $('#todo-list').toggleClass('modal');
            element[0].scrollIntoView({block:'center',inline:'center'});
            history.replaceState(null, null, window.location.pathname);
            showDailyPrompt();
            
        } else {
            $(this).closest('li').removeClass('completed');
        }

        saveTaskState(index, isChecked);
    });

    // Initially load any saved task states and handle "New" badge
    loadTasks();

    function openTask(e){
      var element = $(e).parent();
      if(element.hasClass('expose')){
        // Is open, close
        $(element).removeClass('expose');
        $('#todo-list').removeClass('modal');
        $('body').removeClass('expose');
        element[0].scrollIntoView({block:'center',inline:'center'});
        $(element).find('.contents').scrollTop(0);
        history.replaceState(null, null, window.location.pathname);
      } else {
        // Open it
        var offset = element.offset();
        var x = offset.left - window.scrollX;
        var y = offset.top - window.scrollY;
        var width = element.width();
        var height = element.height();
        $(element).css({'position':'fixed','left':x,'top':y,'width':width,'height':height});
        $(element).find('.contents').scrollTop(0);
        $(element).find('.contents').fadeTo(0,0);
        $('#todo-list').toggleClass('modal');
        $(element).removeAttr('style').toggleClass('expose');
        $(element).find('.contents').stop().delay(300).fadeTo(400,1);
        
        if(element[0]['id'] !== "lesson-0"){
          history.pushState(null, null, '#' + element[0]['id']);
        }
        
      }
    }

    $('.expander').click(function(){
      openTask(this);
    });
    
    $('.dismiss').click(function(e){
      e.preventDefault();
      $('#prompt-background').hide();
      $('#daily').removeClass('open');
      
      const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["FFE258"],
      };

      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ["star"],
        });

        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ["circle"],
        });
      }

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      
    });
        
    $('body').on('click','blockquote button',function(){
      var textToCopy = $(this).parent().text();
      textToCopy = textToCopy.slice(0, -3);
      var tempTextarea = $('<textarea>');
      $('body').append(tempTextarea);
      tempTextarea.val(textToCopy).select();
      document.execCommand('copy');
      tempTextarea.remove();
      $(this).addClass('done');
      window.open('chatgpt://');
    });
    
    // Click tip to copy quotes
    $('body').on('click','pre',function(){
      const codeElement = $(this).find('code');
      const fullText = codeElement.text().trim();
      const match = fullText.match(/"([^"]*)"/);

      if (match) {
        const extractedText = match[1];
        var tempTextarea = $('<textarea>');
        $('body').append(tempTextarea);
        tempTextarea.val(extractedText).select();
        document.execCommand('copy');
        tempTextarea.remove();
        $(this).addClass('done');
        $(codeElement).select();
        window.open('chatgpt://');
      }     

    });
        
    scrollToNextLesson();
    
    if(window.location.hash) {
      var targetHash = window.location.hash;
      if ($(targetHash).length) {
        $('li.expose').removeClass('expose');
        $('li'+targetHash).addClass('expose');
        $('#todo-list').addClass('modal');
        $('body').addClass('expose');
      }      
    }
    
    $('a[href^="#"]').on('click', function(e) {
      e.preventDefault();
      var targetHash = $(this).attr('href');
      if ($(targetHash).length) {
        history.pushState(null, null, ' ');
        $('li.expose').removeClass('expose');
        $('li'+targetHash).addClass('expose');
        $('#todo-list').addClass('modal');
        $('body').addClass('expose');
      }
    });
    
    showDailyPrompt();
        
    document.querySelectorAll('.expander').forEach((element) => {
      let startX = 0, startY = 0;

      element.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      });

      element.addEventListener('touchend', (event) => {
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;

        const diffY = startY - endY; // positive if it's an upward swipe
        const diffX = Math.abs(startX - endX);

        // Check if the swipe is mostly vertical:
        // - Vertical movement must be more than 100 pixels.
        // - Horizontal movement must be less than 20% of the vertical movement.
        if (diffY > 100 && diffX < (diffY * 0.2)) {
          $(element).trigger('click');
        }
      });
    });
    
    $('#loader').addClass('ready');
    
});

$(window).on('hashchange', function() {
  var targetHash = window.location.hash;
  if ($(targetHash).length) {
    $('li.expose').removeClass('expose');
    $('li'+targetHash).addClass('expose');
    $('#todo-list').addClass('modal');
    $('body').addClass('expose');
  }      
});

$(document).keydown(function(keyPressed) {
	// Press ESC to close modals
	if(keyPressed.keyCode == 27) {
    var openLesson = $('li.expose');
    var dailyPrompt = $('#daily');
    if (dailyPrompt.length && dailyPrompt.hasClass('open')) { 
      $('#prompt-background').hide();
      $('#daily').removeClass('open');
    } else if (openLesson.length) { 
      history.replaceState(null, null, window.location.pathname);
      $(openLesson).removeClass('expose');
      $('#todo-list').removeClass('modal');
      $('body').removeClass('expose');
      openLesson[0].scrollIntoView({block:'center',inline:'center'});
      $(openLesson).find('.contents').scrollTop(0);
    }
	}
});

