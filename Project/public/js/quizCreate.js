(function($){
    // console.log("test")
    var questionCounter = 1
    // var questionArr = []
    $('#mcAdd').on('click', function(event){
        event.preventDefault()

        let question = $(`
        
        <li>
            <h3><label for = 'question${questionCounter}' >Type question here </h3>
                <textarea rows = '5' cols = '45' name = 'question' id = 'question${questionCounter}'></textarea>

                <h4>Answer Choices</h4>
                <div> <p> A)
                    <input name = 'A' type = 'text' id = '${questionCounter}A' /> </p>
                </div>
                <div> <p> B)
                    <input name = 'B' type = 'text' id = '${questionCounter}B' /> </p>
                </div>
                <div> <p> C)
                    <input name = 'C' type = 'text' id = '${questionCounter}C' /> </p>
                </div>
                <div> <p> D)
                    <input name = 'D' type = 'text' id = '${questionCounter}D' />  </p>
                </div> 
            <h3><label for = 'correctAns${questionCounter}' >Type correct Answer (Must be A,B,C,D) </h3>
            <input name = 'correctAns' id = 'correctAns${questionCounter}' type = 'text' />
        </li>
        `)

        $('#questionList').append(question)


        questionCounter++
        //console.log('test: ', $('#quizInit'))
        // $('#questionList').append('<li>Test</li>')
    })


    $('#quizInit').submit(function(event) {
        //ajax post to create quiz
       // console.log($('#quizInit').serialize())
       event.preventDefault()

       var questionArr = []

        for(var i = 0; i < questionCounter; i++){
            questionArr.push({
                questionId: i, 
                question: $(`#question${i}`).val(), 
                correctAns: $(`#correctAns${i}`).val(),
                A: $(`#${i}A`).val(), 
                B: $(`#${i}B`).val(),
                C: $(`#${i}C`).val(),
                D: $(`#${i}D`).val()})
        }
        
        //Shift is to remove the initial empty list element when first pressing to add a question
        questionArr.shift()
        questionArr.unshift({quiztitle: $('#quizTitle').val()})
        console.log(questionArr)


        // $('#questionList').children().each((i, e) => {
        //     console.log($(e).find(`#question${i+1}`).val())
        //     console.log($(e).find(`#${i+1}A`).val())
        //     console.log($(e).find(`#${i+1}B`).val())
        //     console.log($(e).find(`#${i+1}C`).val())
        //     console.log($(e).find(`#${i+1}D`).val())
        // })

        // $.ajax({
        //     type: "POST",
        //     url: '/quiz',
        //     data: questionArr
        // })

    })
    
         
  
})(window.jQuery)
  
  