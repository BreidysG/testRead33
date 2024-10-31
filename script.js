document.addEventListener('DOMContentLoaded', function() {
    const titleInit = document.getElementById("titleInit");
    const paragraphInit = document.getElementById("paragraphInit");
    const startButton = document.getElementById('startButton');
    const textContainer = document.getElementById('textContainer');
    const finishButton = document.getElementById('finishButton');
    const questionnaire = document.getElementById('questionnaire');
    const quizForm = document.getElementById('quizForm');
    const results = document.getElementById('results');
    const timerValue = document.getElementById('timerValue');
    let time = [];

    let wordCount = 0;
    let startTime, endTime;
    let quizCompleted = false;
    let timerInterval;

    // Texto para las preguntas del cuestionario
    const questions = [
        {
            question: "¿Quién es Charles Dickens?",
            answers: [
                "Autor de la novela",
                "El protagonista",
                "El protector de Pip",
                "El esposo de Estella"
            ],
            correctAnswer: "Autor de la novela"
        },
        {
            question: "¿Quién es Estella?",
            answers: [
                "La dueña de la mansión",
                "La hija adoptiva de la señorita Havisham",
                "La hermana de Pip",
                "La esposa del señor Jaggers"
            ],
            correctAnswer: "La hija adoptiva de la señorita Havisham"
        },
        {
            question: "¿Cuáles eran los sueños de Pip?",
            answers: [
                "Ser millonario y comprar una mansión",
                "Viajar a Londres y ser un abogado",
                "Convertirse en caballero y casarse con Estella",
                "Ser muy rico y viajar por el mundo"
            ],
            correctAnswer: "Convertirse en caballero y casarse con Estella"
        },
        {
            question: "¿Cuál es el título de la novela?",
            answers: [
                "El gran Pip",
                "Grandes Esperanzas",
                "Pip y Estella",
                "La mansión encantada"
            ],
            correctAnswer: "Grandes Esperanzas"
        },
        {
            question: "¿Finalmente, quién es el benefactor de Pip?",
            answers: [
                "La señorita Havisham",
                "Su hermana y su cuñado",
                "Su hermana y su cuñado",
                "El sr. Jaggers"
            ],
            correctAnswer: "La señorita Havisham"
        }
    ];
    
    
    // Función para contar las palabras en el texto
    function countWords(text) {
        return text.split(/\s+/).length;
    }

    // Función para calcular la velocidad de lectura (palabras por minuto)
    function calculateReadingSpeed(startTime, endTime, wordCount) {
        const minutes = (endTime - startTime) / 60000; // Convertir a minutos
        return Math.round(wordCount / minutes);
    }

    // Función para calcular el tiempo por palabra en milisegundos
    function calculateTimePerWord(ppm) {
        return Math.round(60000 / ppm); // ms por palabra
    }

    // Función para mostrar las preguntas del cuestionario
    function displayQuestions() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p>${question.question}</p>
                <div class="question-options">
                    ${question.answers.map((answer, i) => `
                        <label>
                            <input type="radio" name="answer${index}" value="${answer}">
                            ${answer}
                        </label>
                    `).join('')}
                </div>
            `;
            questionList.appendChild(listItem);
        });
    }

    // Evento para comenzar el test al hacer clic en "Empezar"
    startButton.addEventListener('click', function() {
        textContainer.classList.remove('hidden');
        paragraphInit.classList.add("hidden");
        startButton.classList.add('hidden');
        startTime = Date.now();
        // Iniciar el contador
        timerInterval = setInterval(updateTimer, 1000);
    });

    // Función para actualizar el contador de tiempo
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
        timerValue.textContent = currentTime;
        time.push(currentTime);
    }

    // Evento para finalizar el test al hacer clic en "Terminar Test"
    finishButton.addEventListener('click', function() {
        clearInterval(timerInterval); // Detener el contador
        titleInit.classList.add("hidden");
        textContainer.classList.add('hidden');
        finishButton.classList.add('hidden');
        endTime = Date.now();
        wordCount = countWords(document.getElementById('textToRead').textContent);
        const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount);
        questionnaire.classList.remove('hidden');
        displayQuestions();
    });

    // Evento para enviar el cuestionario
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!quizCompleted) {
            let anyAnswerSelected = true;

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (!selectedAnswer) {
                    anyAnswerSelected = false;
                    return;
                }
            });

            if (!anyAnswerSelected) {
                alert("Debes seleccionar una opción para cada pregunta antes de terminar.");
                return;
            }

            let correctAnswers = 0;
            let totalQuestions = questions.length;

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                    correctAnswers++;
                }
            });

            let comprehensionPercentage = (correctAnswers / totalQuestions) * 100;
            let timeResult = time[time.length-1];

            const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount); // Usar la velocidad de lectura real
            const timePerWordInMs = calculateTimePerWord(readingSpeed); // Ajustar el tiempo por palabra basado en la velocidad de lectura real
            
            quizCompleted = true;
            results.classList.remove('hidden');
            questionnaire.classList.add('hidden');
            document.getElementById('wordCountValue').textContent = wordCount;
            document.getElementById('readingSpeedValue').textContent = `${readingSpeed} palabras por minuto`;
            document.getElementById('comprehensionValue').textContent = `${comprehensionPercentage}`;
            document.getElementById('timeResultValue').textContent = `${timeResult} segundos`;

            // Mostrar tiempo por palabra ajustado
            document.getElementById('results').innerHTML += `
                <p class="lastParagrah">Toma nota de tu velocidad de lectura para poder realizar ajustes en los próximos ejercicios.</p>
                <p class="finalMessage">Puedes salir y pasar a la siguiente clase.</p>
                <p>Ajusta esta velocidad en tus ejercicios: ${timePerWordInMs} milisegundos por palabra</p>
            `;
        }
    });
});

