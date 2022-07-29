var quiz = document.getElementById("quiz");
var instructions = document.getElementById("instructions");
var startBtn = document.getElementById("start-quiz");
var score = document.getElementById("score");
var result = document.getElementById("result");
var number = document.getElementById("number");
var resultContainer = document.querySelector(".result-container");
var restart = document.getElementById("restart");
var interval;
let correctAnswer;
let points = 0;
let count = 0;

function getRadioValue(radioName) {
    var radios = document.getElementsByName(radioName);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i];
        }
    }
}

function startQuiz() {
    var oneMinutes = 15 * 1,
        display = document.querySelector("#time");
    startTimer(oneMinutes, display);
}

function checkAnswer() {
    var q1 = getRadioValue("q1");

    if (q1 === undefined) {
        quiz.reset();
        fetchData();
        clearInterval(interval);
        startQuiz();
        return;
    }
    var q1Answer = q1.nextElementSibling.innerHTML;
    if (q1Answer === correctAnswer) {
        points += 5;
        quiz.reset();
        fetchData();
        clearInterval(interval);
        startQuiz();
    } else {
        quiz.reset();
        fetchData();
        clearInterval(interval);
        startQuiz();
    }
}

quiz.addEventListener("submit", function (event) {
    event.preventDefault();
    checkAnswer();
    score.innerHTML = points;
    if (count === 10) {
        quiz.style.display = "none";
        resultContainer.style.display = "block";
        clearInterval(interval);
        result.style.display = "block";
        result.innerHTML = "Your score is: " + points;
    }
    count++;
    number.innerHTML = "Question " + count + " of 10";
});

function startTimer(duration, display) {
    var timer = duration,
        minutes,
        seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
            timeOut();
        }
    }, 1000);
}

function timeOut() {
    checkAnswer();
    score.innerHTML = points;
    if (count === 10) {
        quiz.style.display = "none";
        resultContainer.style.display = "block";
        clearInterval(interval);
        result.style.display = "block";
        result.innerHTML = "Your score is: " + points;
    }
    count++;
    number.innerHTML = "Question " + count + " of 10";
}

// on click of restart button, save result in local storage and reload page
restart.addEventListener("click", function () {
    localStorage.setItem("score", points);
    location.reload();
});

startBtn.addEventListener("click", function () {
    quiz.style.display = "block";
    instructions.style.display = "none";
    count++;
    fetchData();
    startQuiz();

    number.innerHTML = "Question " + count + " of 10";
    previousScore = localStorage.getItem("score");
    if (previousScore) {
        document.getElementById("previous").innerHTML =
            "Previous Score: " + previousScore;
    }
});

function fetchData() {
    var answers = [];
    score.innerHTML = points;
    fetch(
        "https://protected-cove-56113.herokuapp.com/https://officeapi.dev/api/quotes/random"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("quote").innerHTML = data.data.content;
            answers.push(
                data.data.character.firstname + " " + data.data.character.lastname
            );
            correctAnswer = answers[0];

            fetch(
                "https://protected-cove-56113.herokuapp.com/https://officeapi.dev/api/characters"
            )
                .then(function (response) {
                    return response.json();
                })
                .then(async function (data) {
                    var char = data.data;

                    await char.sort(function () {
                        return 0.5 - Math.random();
                    });
                    for (var i = 0; i < char.length; i++) {
                        if (char[i].firstname + " " + char[i].lastname == answers[0]) {
                            char.splice(i, 1);
                        }
                    }
                    for (var i = 0; i < 3; i++) {
                        answers.push(char[i].firstname + " " + char[i].lastname);
                    }
                    await answers.sort(function () {
                        return 0.5 - Math.random();
                    });
                    document.getElementById("o1").innerHTML = answers[0];
                    document.getElementById("o2").innerHTML = answers[1];
                    document.getElementById("o3").innerHTML = answers[2];
                    document.getElementById("o4").innerHTML = answers[3];
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        });
}