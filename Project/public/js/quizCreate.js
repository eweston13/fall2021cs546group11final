(function($){
    // console.log("test")
    $.ajax('/quizEditPost/quizCreate').then(function(stuff){
        console.log(stuff)
        $('#mcAdd').on('click', function(event){
            event.preventDefault()
            $('#questionList').append('<li>Test</li>')
            createQuestion()

        })
    })
    
         
  
})(window.jQuery)
  
  