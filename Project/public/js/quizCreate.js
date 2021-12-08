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
       $('#error').find('p').remove()
       
       var questionArr = []


        for(var i = 1; i < questionCounter; i++){
            questionArr.push({
                quizTitle: $('#quizTitle').val(),
                questionId: i, 
                question: $(`#question${i}`).val(), 
                correctAns: $(`#correctAns${i}`).val(),
                A: $(`#${i}A`).val(), 
                B: $(`#${i}B`).val(),
                C: $(`#${i}C`).val(),
                D: $(`#${i}D`).val()})
        }
        
        //Shift is to remove the initial empty list element when first pressing to add a question
//        questionArr.shift()
        // questionArr.unshift({quiztitle: $('#quizTitle').val()})

        var error = false
        for(const obj of questionArr){
            if(!obj.quizTitle || obj.quizTitle == ' '.repeat(obj.quizTitle.length)){
                $('#error').append('<p>Cannot have empty quiz title</p>')
                error = true
                return
            }
            //PUSH THIS
            if(!obj.question || obj.question == ' '.repeat(obj.question.length)){
                $('#error').append('<p>Cannot have any empty fields or just spaces for question</p>')
                error = true
                return
            }
            if(!obj.correctAns || obj.correctAns == ' '.repeat(obj.correctAns.length)){
                $('#error').append('<p>Cannot have any empty fields or just spaces for the correct answer</p>')
                error = true
                return
            }else if( !['A', 'B', 'C', 'D'].includes(obj.correctAns) ){
                $('#error').append('<p>Correct Answer must be A, B, C, or D</p>')
                return 
            }   
            if(!obj.A || obj.A == ' '.repeat(obj.A.length)){
                $('#error').append('<p>Cannot have any empty fields or just spaces for option</p>')
                error = true
                return
            }
            if(!obj.B || obj.B == ' '.repeat(obj.B.length)){
                $('#error').append('<p>Cannot have any empty fields or just spaces for option</p>')
                error = true
                return
            }
            if(!obj.C || obj.C == ' '.repeat(obj.C.length)){
                $('#error').append('<p>Cannot have any empty fields or just spaces for option</p>')
                error = true
                return
            }
            if(!obj.D || obj.D == ' '.repeat(obj.D.length)){
                $('#error').append('<p>Cannot have any empty fields or just spaces for option</p>')
                error = true
                return
            }
        }

        error = false 

        console.log(questionArr)

        if(!error){
            $.ajax({
                method: "POST",
                contentType: 'application/json',
                url: '/quiz',
                data: JSON.stringify(questionArr)
            })

           window.location = '/home'

        }

    })
    
         
  
})(window.jQuery)
  
  