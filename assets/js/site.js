$(document).ready(function() {
    // Time limit for displaying the "New" badge (24 hours in milliseconds)
    const badgeVisibleDuration = 24 * 60 * 60 * 1000; // 24 hours
    //const badgeVisibleDuration = 10 * 60 * 1000; // 10 minutes
    
    // Load tasks and check if "New" badge should be displayed
    function loadTasks() {
        $('#todo-list li.lesson').each(function(index, element) {
            const isChecked = localStorage.getItem('task-'+index);
            const firstSeenTimestamp = localStorage.getItem('task-seen-' + index);

            // Check task completion status
            if (isChecked === 'true') {
                $(this).find('input[type="checkbox"]').prop('checked', true);
                $(this).addClass('completed');
            }

            // Handle "New" badge visibility
            if (!firstSeenTimestamp) {
                // If there's no timestamp, store the current time as the first seen time
                const now = Date.now();
                localStorage.setItem('task-seen-' + index, now);
            } else {
                const timeElapsed = Date.now() - parseInt(firstSeenTimestamp, 10);
                if (timeElapsed > badgeVisibleDuration) {
                  // Not doing this 1-day reveal anymore
                }
            }
        });
    }

    // Save the completion state of the task to localStorage
    function saveTaskState(index, isChecked) {
        localStorage.setItem('task-' + index, isChecked);
    }
    
    // Scroll to the next lesson
    function scrollToNextLesson(){
      var firstIncomplete = $('li.lesson').not('.completed').not('.intro').first();
      var countCompleteLessons = $('#todo-list .lesson.completed').not('.intro').length;
      var container = $('#todo-list');
      if (firstIncomplete.length) {
        if (countCompleteLessons > 0) {
          var thislesson = $(firstIncomplete[0]);
          var containerWidth = container.width();
          var elementOffset = thislesson.position();
          var elementWidth = thislesson.outerWidth();
          var scrollPosition = elementOffset.left - (containerWidth / 2) + (elementWidth / 2);
          var viewportoffset = $(window).width() * 0.05;
          container.animate({scrollLeft:(scrollPosition - viewportoffset)}, 10);
        }
      } else {
        container.scrollLeft(0);
      }
    }
    
    // Load YouTube videos only when asked
    function loadYouTubeEmbed(element) {
        var videoId = $(element).attr("data-video-id");
        if (!videoId) { return; }
        var iframe = $("<iframe>", {
            src: "https://www.youtube.com/embed/" + videoId + "?autoplay=0",
            frameborder: 0,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: true,
            css: {
              width: "100%",
              height: "100%"
            }
        });
        $(element).html(iframe);
    }
    function checkLazyVideos() {
        $(".embed").each(function () {
          loadYouTubeEmbed(this);
        });
    }
        
    // Daily prompts
    function showDailyPrompt(){
      var countTotalLessons = $('#todo-list .lesson').not('.intro').length;
      var countCompleteLessons = $('#todo-list .lesson.completed').not('.intro').length;
      if(countTotalLessons === countCompleteLessons){
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let savedDate = localStorage.getItem("startDate");
        if(!savedDate){
          localStorage.setItem("startDate", today);
          savedDate = today;
          
          fathom.trackEvent('course_complete');
          
        } else { 
          savedDate = new Date(savedDate);
          savedDate.setHours(0, 0, 0, 0);
        }
        const diffInDays = Math.floor((today - savedDate) / (1000 * 60 * 60 * 24))+1;
        const formattedDiffInDays = diffInDays.toString().padStart(2, "0");

        // Load Content
        const promptFile = 'daily/prompt-' + formattedDiffInDays + '.md';
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
    
    // Use the tap indicator to jump to the next lesson
    $('#bump').click(function(){ scrollToNextLesson(); });
    
    // Parse the contents
		$('.fetchmd').each(function() {
      
      const markdownFilePath = $(this).attr('data-src');
      // Start
      fetch(markdownFilePath).then(response => response.text()).then(markdownContent => {
          const renderer = new marked.Renderer();
    			renderer.blockquote = function(text) {
    				return '<blockquote>' + text.text+ '<button class="gpt">Try</button></blockquote>';
    			};

    			marked.use({ renderer });
    			$(this).html(marked.parse(markdownContent));
      })
      .catch(error => console.error("Error fetching lesson:", error));
      // End
      
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
            fathom.trackEvent('lesson_complete');
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
        checkLazyVideos();
        
        if(element[0]['id'] !== "lesson-0"){
          history.pushState(null, null, '#' + element[0]['id']);
          fathom.trackEvent('lesson_open');
        } else {
          fathom.trackEvent('intro_open');
        }
      }
    }

    $('.expander').click(function(){
      openTask(this);
    });
    
    $('#donate').click(function(e){
      e.preventDefault();
      $('#about').addClass('open');
      $('#prompt-background').show();
    });
    
    $('.dismiss').click(function(e){
      e.preventDefault();
      $('#prompt-background').hide();
      $('#daily,#about').removeClass('open');
      
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
        
    $('body').on('click','button.gpt',function(){
      var textToCopy = $(this).parent().text();
      textToCopy = textToCopy.slice(0, -3);
      var tempTextarea = $('<textarea>');
      $('body').append(tempTextarea);
      tempTextarea.val(textToCopy).select();
      document.execCommand('copy');
      tempTextarea.remove();
      $(this).addClass('done');
      
      const chatgptAppUrl = 'chatgpt://chat?q=' + encodeURIComponent(textToCopy);
      const chatgptWebUrl = 'https://chat.openai.com/?q=' + encodeURIComponent(textToCopy);
      const startTime = Date.now();
      const newWindow = window.open(chatgptAppUrl);
      setTimeout(function() {
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime < 1500) {
              window.open(chatgptWebUrl, '_blank');
          }
      }, 1200);
      
      fathom.trackEvent('gpt shortcut');
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
        checkLazyVideos();
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
        checkLazyVideos();
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

