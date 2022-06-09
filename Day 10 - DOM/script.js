const question = document.getElementById('question');
const answer = document.getElementById('answer');
const timer = document.getElementById('timer');
const result = document.getElementById('result');
let userAnswer = "";
let Limit = 30;
const questionBank = [
    "Genius is one percent inspiration and ninety-nine percent perspiration",
    "You can observe a lot just by watching."
]
question.innerHTML = questionBank[0];

let interval = setInterval(() => {
    Limit--;
    timer.innerHTML = Limit;
    if (Limit == 0) {
        clearInterval(interval);
        answer.setAttribute('disabled', 'disabled');
        checkAnswer();
    }
}
    , 1000);

    answer.addEventListener('keyup', (e) => {
        userAnswer = e.target.value;
    })


    function checkAnswer(){
        const answer_len = userAnswer.length;
        const question_len = questionBank[0].length;
        const percent = (answer_len / question_len) * 100;
        result.innerHTML = `You got ${parseFloat(percent).toFixed(2)}%`;

    }

