// https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgain = document.getElementById('play-again');
const _result = document.getElementById('result');


let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

// Event listeners

function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgain.addEventListener('click', newGame);
};

document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    loadQuestion();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    //console.log(data.results[0]);
    _result.innerHTML = "";
    showQuestion(data.results[0]);
};

// Display question and options
function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    //console.log(correctAnswer);
    let incorrectAnswer = data.incorrect_answers;
    //console.log(incorrectAnswer);
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer); // Inserting correct answers in random position in the option list
    
    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li>${index + 1}.<span> ${option}</span></li>
        `).join(' ')}
    `;

    selectOption();
};


// Options selection
function selectOption() {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected')
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });

    console.log(correctAnswer);
};

// Answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p> <i class="bi bi-check-circle"></i>Correct Answer! </p>`;
        } else {
            _result.innerHTML = `<p> <i class="bi bi-x-circle"></i>Incorrect Answer!</p> <p><small><b>Correct Answer: </b> ${correctAnswer}</small></p>`;
        }
        checkCount();
    }
};

// to convert html entities into normal text of corrent answer if there is any
function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
};

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        _result.innerHTML += `<p> Your score is ${correctScore}. </p>`;
        _playAgain.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
};

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
};

function newGame() {
    window.location.reload();
};

