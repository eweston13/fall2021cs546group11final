const quizzes = require('./data/quizzes');
const connection = require('./config/mongoConnection');

const main = async () => {

//---------------CREATE A QUIZ-------------------//

// try{
//       const quiz = await quizzes.createQuiz("Cup Competition","3253434",[{"question":"Host of 2010 FIFA World Cup","options": ["Brazil","South Africa","Russia"],"correctAnswer":"South Africa"},{"question":"Host of 2019 Cricket World Cup","options": ["Australia","England","India"],"correctAnswer":"England"}]);
//       console.log(quiz);
//     }catch(e){
//       console.log (e);
//     }

//----------------GET QUIZ INFO BY ID (FOR INSTRUCTORS)---------------------//

    // try{
    //       const quizInfo = await quizzes.getQuizById("61a02a24dc47b5a992b37fec");
    //       console.log(quizInfo);
    //     }catch(e){
    //       console.log (e);
    //     }

//-------------------REMOVE QUIZ INFO BY ID-----------------//

    // try{
    //       const quizInfo = await quizzes.removeQuiz("61a02a24dc47b5a992b37fec");
    //       console.log(quizInfo);
    //     }catch(e){
    //       console.log (e);
    //     }

//-------------------UPDATE QUIZ----------------------//

// try{
//     const quizInfo = await quizzes.updateQuiz("61a02d55a6c6f9841a381543","Capital","shdg3khr43jt34",[{"question": "capital of Australia","options": ["Melbourne","Adelaide","Canberra"],"correctAnswer": "Canberra"},{"question":"capital of Italy","options": ["Rome","Milan"],"correctAnswer":"Rome"}]);
//     console.log(quizInfo);
//   }catch(e){
//     console.log (e);
//   }

//-------------------GET QUIZ INFO BY SEARCH TERM (FOR STUDENTS)----------------//

try{
    const quizInfo = await quizzes.getQuizByName("tion");
    console.log(quizInfo);
  }catch(e){
    console.log (e);
  }
    const db = await connection.connectToDb();
    await connection.closeConnection();
    console.log('Done!');
};



main().catch((error) => {
    console.log(error);
});