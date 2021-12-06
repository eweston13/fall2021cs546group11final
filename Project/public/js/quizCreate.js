(function($){
    // console.log("test")

    $('#mcAdd').on('click', function(event){
        event.preventDefault()

        let question = $(`
        
        <li>
            <h3><label for = 'question' >Type question here </h3>
                <textarea rows = '5' cols = '45' id = question></textarea>

                <h4>Answer Choices</h4>
                <div> <p> A)
                    <input type = 'text'> </p>
                </div>
                <div> <p> B)
                    <input type = 'text'> </p>
                </div>
                <div> <p> C)
                    <input type = 'text'> </p>
                </div>
                <div> <p> D)
                    <input type = 'text'>  </p>
                </div> 
            <h3><label for = 'correctAns' >Type correct Answer (Must be A,B,C,D) </h3>
            <input id = 'correctAns' type = 'text' >
        </li>
        `)

        $('#questionList').append(question)
        console.log($('#quizInit'))
        // $('#questionList').append('<li>Test</li>')
    })


    $('#quizInit').submit(function(event) {
        //ajax post to create quiz
        $.ajax({
            type: "POST",
            url: '/quiz',
            data: $('#quizInit')
        })

    })
    
         
  
})(window.jQuery)
  
  