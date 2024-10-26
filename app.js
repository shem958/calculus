document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    { question: "What is the integral of x^2?", answer: "x^3/3" },
    { question: "Evaluate the limit lim(x→0) sin(x)/x", answer: "1" },
    { question: "What is the derivative of cos(x)?", answer: "-sin(x)" },
    { question: "Find the integral of 1/x dx.", answer: "ln|x|" },
    {
      question: "Solve the differential equation dy/dx = 3x^2.",
      answer: "x^3 + C",
    },
  ];

  const quizSection = document.getElementById("quiz-section");
  const resultSection = document.getElementById("result-section");
  const improvementSection = document.getElementById("improvement-areas");
  const leaderboardList = document.getElementById("leaderboard-list");
  const submitBtn = document.getElementById("submit-btn");
  const canvas = document.getElementById("performance-chart");
  const correctAnswers = questions.map((q) => q.answer);

  function loadQuiz() {
    quizSection.innerHTML = "";
    questions.forEach((q, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.innerHTML = `
        <p>${q.question}</p>
        <input type="text" id="answer-${index}" class="answer-input">
      `;
      quizSection.appendChild(questionDiv);
    });
  }

  function gradeQuiz() {
    const userAnswers = [];
    let score = 0;

    questions.forEach((q, index) => {
      const userAnswer = document
        .getElementById(`answer-${index}`)
        .value.trim();
      userAnswers.push(userAnswer);
      if (userAnswer === q.answer) score++;
    });

    displayResults(score);
    updatePerformanceChart(score);
    provideFeedback(userAnswers);
    updateLeaderboard(score);
  }

  function displayResults(score) {
    resultSection.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
    resultSection.style.display = "block"; // Show the section
  }

  function updatePerformanceChart(score) {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(score);
    localStorage.setItem("scores", JSON.stringify(scores));

    const ctx = canvas.getContext("2d");
    canvas.style.display = "block"; // Ensure the chart is visible

    new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(
          { length: scores.length },
          (_, i) => `Attempt ${i + 1}`
        ),
        datasets: [
          {
            label: "Scores",
            data: scores,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: questions.length },
        },
      },
    });
  }

  function provideFeedback(userAnswers) {
    const weakAreas = userAnswers
      .map((answer, index) =>
        answer !== correctAnswers[index] ? questions[index].question : null
      )
      .filter(Boolean);

    improvementSection.innerHTML = weakAreas.length
      ? `<h3>Areas to Improve:</h3><ul>${weakAreas
          .map((area) => `<li>${area}</li>`)
          .join("")}</ul>`
      : `<p>Great job! No weak areas detected.</p>`;

    improvementSection.style.display = "block"; // Show feedback section
  }

  function updateLeaderboard(score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push(score);
    leaderboard = leaderboard.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    leaderboardList.innerHTML = leaderboard
      .map((score, index) => `<li>Rank ${index + 1}: ${score} points</li>`)
      .join("");

    document.getElementById("leaderboard").style.display = "block"; // Show leaderboard
  }

  submitBtn.addEventListener("click", gradeQuiz);
  loadQuiz();
});
