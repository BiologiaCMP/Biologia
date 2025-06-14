
document.addEventListener('DOMContentLoaded', () => {
  // Menu toggle
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav').querySelector('ul');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // Scroll reveal animations
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Quiz interactivity
  const quizData = [
    {
      question: "¿Qué proceso construye moléculas complejas usando energía?",
      answers: ["Catabolismo", "Anabolismo", "Fermentación", "Fotosíntesis"],
      correct: 1
    },
    {
      question: "¿Cuál es la molécula principal que almacena energía en la célula?",
      answers: ["ADN", "ATP", "Glucosa", "ARN"],
      correct: 1
    },
    {
      question: "¿Dónde ocurre la glucólisis?",
      answers: ["Mitocondria", "Núcleo", "Citosol", "Cloroplasto"],
      correct: 2
    },
    {
      question: "¿Qué proceso libera energía al romper moléculas complejas?",
      answers: ["Catabolismo", "Anabolismo", "Fotosíntesis", "Transcripción"],
      correct: 0
    }
  ];

  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const nextBtn = document.getElementById('next-btn');
  const resultEl = document.getElementById('result');

  let currentQuestion = 0;
  let selectedAnswer = null;
  let score = 0;

  function loadQuestion() {
    nextBtn.disabled = true;
    selectedAnswer = null;
    resultEl.textContent = '';
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    answersEl.innerHTML = '';

    q.answers.forEach((answer, index) => {
      const li = document.createElement('li');
      li.textContent = answer;
      li.tabIndex = 0;
      li.addEventListener('click', () => selectAnswer(index, li));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectAnswer(index, li);
        }
      });
      answersEl.appendChild(li);
    });
  }

  function selectAnswer(index, element) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;
    [...answersEl.children].forEach(li => li.classList.remove('selected'));
    element.classList.add('selected');
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener('click', () => {
    if (selectedAnswer === quizData[currentQuestion].correct) {
      score++;
    }
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    questionEl.textContent = '';
    answersEl.innerHTML = '';
    nextBtn.style.display = 'none';
    resultEl.textContent = `Quiz terminado! Tu puntaje: ${score} / ${quizData.length}`;
  }

  loadQuestion();
});
