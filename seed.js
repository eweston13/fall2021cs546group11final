const quizzes = require('./data/quizzes');
const connection = require('./config/mongoConnection');

const main = async () => {

//---------------CREATE A QUIZ-------------------//

// try{
//       const quiz = await quizzes.createQuiz("Research","Marie Curie",["A","B"],["BC"]);
//       console.log(quiz);
//     }catch(e){
//       console.log (e);
//     }

//----------------GET QUIZ INFO--------------------//

    // try{
    //       const quizInfo = await quizzes.getQuizById("619ee26843607368e4ab1dbf");
    //       console.log(quizInfo);
    //     }catch(e){
    //       console.log (e);
    //     }

//--------------REMOVE QUIZ INFO BY ID-----------//

    // try{
    //       const quizInfo = await quizzes.removeQuiz("619ee2a5a4bea99aaa1ab66d");
    //       console.log(quizInfo);
    //     }catch(e){
    //       console.log (e);
    //     }

//------------UPDATE QUIZ--------------//

try{
    const quizInfo = await quizzes.updateQuiz("619ee2a5a4bea99aaa1ab66c","Research","122314",["A"],["A","B"]);
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