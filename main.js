// Select Elements
let countSpan = document.querySelector(".count span");

let theBulletsTimer = document.querySelector(".bullets-and-timer");

let spansContianer = document.querySelector(".bullets-and-timer .spans");

let qeustionArea = document.querySelector(".quiz-area");

let answersArea = document.querySelector(".answers-area");

let submitButtom = document.querySelector(".submit-buttom");

let countDown = document.querySelector(".countDown");

let theResultMassage = document.querySelector(".results");

// Set System
let currntIndex = 0;

let rightAnswers = 0;

let countDownInterval;

// Function Get Question Response
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // Transformation Response To Object
      let questionObject = JSON.parse(this.responseText);

      let countq = questionObject.length;

      //Create Bullets + Set Count Question
      createBullets(countq);

      // Create The Question Data
      getQuestionData(questionObject[currntIndex], countq);

      // Start Timer
      countDownTimer(30, countq);

      // Add Event On Click Buttom
      submitButtom.onclick = () => {
        // Get Right Answer
        let rightAnswer = questionObject[currntIndex].right_answer;

        // Increase Index
        currntIndex++;

        // Check The Answer
        checkAnswer(rightAnswer);

        // Remove Previous Question
        answersArea.innerHTML = "";
        qeustionArea.children[0].remove();

        // Create The Question Data
        getQuestionData(questionObject[currntIndex], countq);

        // Handle Bullets Class
        handleBullets();

        // Create Massage Results
        showMassageResult(countq);

        // Start Timer
        clearInterval(countDownInterval);
        countDownTimer(30, countq);
      };
    }
  };

  myRequest.open("get", "questions.json", true);

  myRequest.send();
}

getQuestions();

// Function Create Bullets
function createBullets(num) {
  countSpan.innerHTML = num;

  //Create bullets
  for (let i = 0; i < num; i++) {
    //Create bullet
    let bullet = document.createElement("span");

    //Check If The First Bullet
    if (i === 0) {
      bullet.className = "on";
    }

    // Append The bullet To The Main Bullets Container
    spansContianer.appendChild(bullet);
  }
}

function getQuestionData(obj, count) {
  if (currntIndex < count) {
    // Create the question Title
    let quesTitle = document.createElement("h2");

    // Create The Question Text
    let quesText = document.createTextNode(obj[`title`]);

    // Append The Text to question Text
    quesTitle.appendChild(quesText);

    // Append The h2 To Quiz Area
    qeustionArea.insertBefore(quesTitle, answersArea);

    // Create All Answers
    for (let i = 1; i <= 4; i++) {
      // Create main div Answer
      let divAnswer = document.createElement("div");

      // Add Class to div Answer
      divAnswer.className = `answer`;

      // Create The Input Radio
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Set
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label Answer
      let labAnswer = document.createElement("label");

      // Set For to Label
      labAnswer.htmlFor = `answer_${i}`;

      // Create Text On The label
      let textllab = document.createTextNode(obj[`answer_${i}`]);

      // Append The Text to Label
      labAnswer.appendChild(textllab);

      // Appned The Radio To Div Answer
      divAnswer.appendChild(radioInput);

      // Appned The Label To Div Answer
      divAnswer.appendChild(labAnswer);

      // Append The Div Answer To Answers Area
      answersArea.appendChild(divAnswer);
    }
  }
}

function checkAnswer(rAnswer) {
  // Get The Checked Answer
  let chooseAnswer = document.getElementsByName("question");
  let currntChoose;

  chooseAnswer.forEach((answer) => {
    if (answer.checked) {
      currntChoose = answer.dataset.answer;
    }
  });

  if (rAnswer === currntChoose) {
    rightAnswers++;
  }
}

// Function Handle Bullets Class
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".spans span");

  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (currntIndex === index) {
      span.className = "on";
    }
  });
}

// Create Funvtion Show Massage Results
function showMassageResult(count) {
  let theResult;

  if (currntIndex === count) {
    // Remove Data Info + Submit Buttom
    qeustionArea.remove();
    submitButtom.remove();
    theBulletsTimer.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class ="good">Good</span>, You Answered ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class ="perfect">Perfect</span>, You Answered ${rightAnswers} From ${count}`;
    } else {
      theResult = `<span class ="bad">Bad</span>, You Answered ${rightAnswers} From ${count}`;
    }

    theResultMassage.innerHTML = theResult;
    theResultMassage.style.padding = "15px";
  }
}

function countDownTimer(duration, count) {
  if (currntIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDown.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownTimer);
        submitButtom.click();
      }
    }, 1000);
  }
}
