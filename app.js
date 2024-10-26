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
  const submitBtn = document.getElementById("submit-btn");
  let userAnswers = [];
  const correctAnswers = questions.map((q) => q.answer);

  function loadQuiz() {
    quizSection.innerHTML = "";
    questions.forEach((q, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.innerHTML = `
              <p>${q.question}</p>
              <input type="text" id="answer-${index}">
          `;
      quizSection.appendChild(questionDiv);
    });
  }

  function gradeQuiz() {
    let score = 0;
    userAnswers = [];
    questions.forEach((q, index) => {
      const userAnswer = document
        .getElementById(`answer-${index}`)
        .value.trim();
      userAnswers.push(userAnswer);
      if (userAnswer === q.answer) {
        score++;
      }
    });
    displayResults(score);
    updatePerformanceChart(score);
    provideFeedback();
  }

  function displayResults(score) {
    resultSection.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
  }

  function updatePerformanceChart(score) {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(score);
    localStorage.setItem("scores", JSON.stringify(scores));
    const ctx = document.getElementById("performance-chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: scores.length }, (_, i) => i + 1),
        datasets: [
          {
            label: "Score Over Time",
            data: scores,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: questions.length,
          },
        },
      },
    });
  }

  function provideFeedback() {
    const weakAreas = userAnswers
      .map((answer, index) =>
        answer !== correctAnswers[index]
          ? `Question ${index + 1}: ${questions[index].question}`
          : null
      )
      .filter((area) => area !== null);

    improvementSection.innerHTML =
      weakAreas.length > 0
        ? `<h3>Areas to Improve:</h3><ul>${weakAreas
            .map((area) => `<li>${area}</li>`)
            .join("")}</ul>`
        : `<p>Great job! No weak areas detected.</p>`;
  }

  submitBtn.addEventListener("click", gradeQuiz);
  loadQuiz();
});
