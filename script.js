window.addEventListener("DOMContentLoaded", () => {
  // Elementos comuns
  const practiceBtn       = document.getElementById("practice-btn");
  const challengeBtn      = document.getElementById("challenge-btn");
  const homeScreen        = document.querySelector(".home-screen");
  const chooseTableScreen = document.querySelector(".choose-table-screen");
  const practiceScreen    = document.querySelector(".practice-screen");

  // Elementos Practice Mode
  const tableNumEl    = document.getElementById("table-num");
  const multiplierEl  = document.getElementById("multiplier");
  const optionButtons = Array.from(document.querySelectorAll(".practice-screen .option-btn"));
  const nextBtn       = document.getElementById("next-btn");

  let selectedTable;
  let currentMultiplier;
  const maxMultiplier = 10;

  // Navegação pra Choose Table
  practiceBtn.addEventListener("click", () => {
    homeScreen.classList.add("hidden");
    chooseTableScreen.classList.remove("hidden");
  });

  // Seleção da tabuada e início do Practice
  document.querySelectorAll(".table-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedTable = parseInt(btn.textContent);
      startPractice();
    });
  });

  function startPractice() {
    chooseTableScreen.classList.add("hidden");
    practiceScreen.classList.remove("hidden");
    currentMultiplier = 1;
    loadQuestion();
  }

  function loadQuestion() {
    tableNumEl.textContent   = selectedTable;
    multiplierEl.textContent = currentMultiplier;
    const correctAnswer = selectedTable * currentMultiplier;

    // Gera alternativas
    const answers = new Set([correctAnswer]);
    while (answers.size < 4) {
      let wrong;
      do {
        const offset = Math.floor(Math.random() * 5) + 1;
        wrong = Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
      } while (wrong <= 0 || answers.has(wrong));
      answers.add(wrong);
    }
    const shuffled = Array.from(answers).sort(() => Math.random() - 0.5);

    optionButtons.forEach((btn, i) => {
      btn.textContent           = shuffled[i];
      btn.disabled              = false;
      btn.classList.remove("correct", "wrong");
      btn.onclick = () => checkAnswer(btn, correctAnswer);
    });

    nextBtn.classList.add("hidden");
  }

  function checkAnswer(button, correct) {
    const val = parseInt(button.textContent);
    optionButtons.forEach(b => b.disabled = true);

    if (val === correct) {
      button.classList.add("correct");
    } else {
      button.classList.add("wrong");
      optionButtons
        .find(b => parseInt(b.textContent) === correct)
        .classList.add("correct");
    }

    nextBtn.classList.remove("hidden");
  }

  nextBtn.addEventListener("click", () => {
    currentMultiplier++;
    if (currentMultiplier <= maxMultiplier) {
      loadQuestion();
    } else {
      alert("Well done! You’ve completed the practice.");
      window.location.reload();
    }
  });

  // Challenge Mode
  const challengeSC    = document.querySelector(".challenge-screen");
  const countdownEl    = document.getElementById("countdown");
  const chContent      = document.querySelector(".challenge-content");
  const chTableNum     = document.getElementById("ch-table-num");
  const chMultiplier   = document.getElementById("ch-multiplier");
  const chOptionBtns   = Array.from(document.querySelectorAll(".challenge-screen .option-btn"));
  const timerEl        = document.getElementById("timer");

  let chQuestions, chCurrent, chCorrectCount, chStartTime, chTimerInterval;
  const CH_TOTAL = 10;

  challengeBtn.addEventListener("click", () => {
    homeScreen.classList.add("hidden");
    challengeSC.classList.remove("hidden");
    startCountdown();
  });

  function startCountdown() {
    let count = 3;
    countdownEl.textContent = count;
    countdownEl.classList.remove("hidden");
    chContent.classList.add("hidden");

    const cdInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
      } else {
        clearInterval(cdInterval);
        countdownEl.classList.add("hidden");
        startChallenge();
      }
    }, 1000);
  }

  function startChallenge() {
    chQuestions   = [];
    for (let i = 0; i < CH_TOTAL; i++) {
      const table = Math.floor(Math.random() * 8) + 2;
      const mult  = Math.floor(Math.random() * 10) + 1;
      chQuestions.push({ table, mult });
    }
    chCurrent      = 0;
    chCorrectCount = 0;
    chStartTime    = Date.now();
    timerEl.textContent = "0";
    chTimerInterval    = setInterval(updateTimer, 1000);

    chContent.classList.remove("hidden");
    loadChQuestion();
  }

  function updateTimer() {
    const sec = Math.floor((Date.now() - chStartTime) / 1000);
    timerEl.textContent = sec;
  }

  function loadChQuestion() {
    const { table, mult } = chQuestions[chCurrent];
    const correct = table * mult;

    chTableNum.textContent   = table;
    chMultiplier.textContent = mult;

    // Gera alternativas
    const answers = new Set([correct]);
    while (answers.size < 4) {
      let wrong;
      do {
        const offset = Math.floor(Math.random() * 5) + 1;
        wrong = Math.random() < 0.5 ? correct + offset : correct - offset;
      } while (wrong <= 0 || answers.has(wrong));
      answers.add(wrong);
    }
    const shuffled = Array.from(answers).sort(() => Math.random() - 0.5);

    chOptionBtns.forEach((btn, i) => {
      btn.textContent           = shuffled[i];
      btn.disabled              = false;
      btn.classList.remove("correct", "wrong");
      btn.onclick = () => checkChAnswer(btn, correct);
    });
  }

  function checkChAnswer(btn, correct) {
    const val = parseInt(btn.textContent);
    chOptionBtns.forEach(b => b.disabled = true);

    if (val === correct) {
      chCorrectCount++;
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
      chOptionBtns
        .find(b => parseInt(b.textContent) === correct)
        .classList.add("correct");
    }

    setTimeout(() => {
      chCurrent++;
      if (chCurrent < CH_TOTAL) {
        loadChQuestion();
      } else {
        endChallenge();
      }
    }, 800);
  }

  function endChallenge() {
    clearInterval(chTimerInterval);
    const timeTaken = Math.floor((Date.now() - chStartTime) / 1000);

    chContent.innerHTML = `
      <h3>Well done!</h3>
      <p>You got <strong>${chCorrectCount}/${CH_TOTAL}</strong> correct.</p>
      <p>Your time: <strong>${timeTaken}s</strong></p>
      <button id="restart-ch">Try Again</button>
      <button id="to-home">Home</button>
    `;

    document.getElementById("restart-ch")
            .addEventListener("click", ()   => location.reload());
    document.getElementById("to-home")
            .addEventListener("click", ()   => location.reload());
  }

});
