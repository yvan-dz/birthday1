// Animation GSAP pour l'entête
gsap.from("#header h1", { duration: 1, y: -50, opacity: 0, ease: "bounce" });

// Configuration du compte à rebours pour le jour de l'anniversaire
const targetDate = new Date("Dec 31, 2024 00:00:00").getTime();
const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = `
    <div class="time-box">${days}<span>Jours</span></div>
    <div class="time-box">${hours}<span>Heures</span></div>
    <div class="time-box">${minutes}<span>Minutes</span></div>
    <div class="time-box">${seconds}<span>Secondes</span></div>
    `;

    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("timer").innerHTML = "C'est le grand jour ! 🎉";
    }
}, 1000);

// Configuration du bouton PayPal
paypal.Buttons({
    createOrder: (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: { value: '5.00' }  // montant test, à ajuster si besoin
            }]
        });
    },
    onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
            alert(`Merci ${details.payer.name.given_name} pour votre contribution !`);
        });
    }
}).render('#paypal-button-container');

// Liste des questions et réponses
const quizQuestions = [
    { question: "Dans quelle ville Yvan est-il né ?", answers: ["Paris", "Lyon", "Marseille"], correct: "Lyon" },
    { question: "Quel est le sport préféré d'Yvan ?", answers: ["Football", "Tennis", "Basketball"], correct: "Tennis" },
    { question: "Quel est le groupe de musique favori d'Yvan ?", answers: ["Coldplay", "U2", "Imagine Dragons"], correct: "Coldplay" },
    { question: "Quelle est la couleur préférée d'Yvan ?", answers: ["Rouge", "Bleu", "Vert"], correct: "Bleu" },
    { question: "Quel est son plat préféré ?", answers: ["Pizza", "Sushi", "Pâtes"], correct: "Sushi" },
    { question: "Quel est son passe-temps favori ?", answers: ["Lecture", "Football", "Jeux vidéo"], correct: "Lecture" },
    { question: "Quel pays rêve-t-il de visiter ?", answers: ["Japon", "Brésil", "Canada"], correct: "Japon" },
    { question: "Quel est son film préféré ?", answers: ["Inception", "Le Roi Lion", "Matrix"], correct: "Inception" }
];

let correctAnswers = localStorage.getItem('correctAnswers') ? parseInt(localStorage.getItem('correctAnswers')) : 0; // Compteur de bonnes réponses
let answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions')) || []; // Liste des questions répondues

document.addEventListener('DOMContentLoaded', function () {
    const quizCarouselElement = document.querySelector('#quiz-carousel');
    const quizCarousel = new bootstrap.Carousel(quizCarouselElement, {
        interval: 5000,
        wrap: true
    });

    quizQuestions.forEach((q, index) => {
        const isAnswered = answeredQuestions.find(item => item.questionIndex === index);
        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
        carouselItem.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
                <div class="quiz-content">
                    <h3>${q.question}</h3>
                    ${q.answers.map(answer => `
                        <button class="btn btn-primary m-2 quiz-answer" onclick="checkAnswer('${answer}', '${q.correct}', ${index}, this)" ${isAnswered ? 'disabled' : ''} ${isAnswered && answer === q.correct ? 'class="btn-success"' : isAnswered && answer !== q.correct ? 'class="btn-danger"' : ''}>${answer}</button>
                    `).join('')}
                </div>
            </div>
        `;
        quizCarouselElement.querySelector('.carousel-inner').appendChild(carouselItem);
    });

    // Mise à jour du compteur à partir du localStorage
    document.getElementById('correct-counter').textContent = correctAnswers;
});

// Fonction pour vérifier la réponse et enregistrer dans le localStorage
function checkAnswer(answer, correct, questionIndex, element) {
    if (answeredQuestions.find(item => item.questionIndex === questionIndex)) return; // Empêcher de répondre à nouveau

    const buttons = element.closest('.quiz-content').querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add(btn.textContent === correct ? 'btn-success' : 'btn-danger');
    });

    const quizModal = new bootstrap.Modal(document.getElementById('quizModal'));
    const modalBody = document.getElementById('quizModalBody');

    if (answer === correct) {
        modalBody.textContent = "Bonne réponse ! 🎉";
        correctAnswers++; // Incrémentation du compteur
        document.getElementById('correct-counter').textContent = correctAnswers;

        // Enregistrer dans le localStorage
        localStorage.setItem('correctAnswers', correctAnswers);
    } else {
        modalBody.textContent = "Mauvaise réponse, essaye encore ! ❌";
    }

    // Marquer la question comme répondue, et stocker si réponse correcte ou non
    answeredQuestions.push({ questionIndex: questionIndex, correct: answer === correct });
    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));

    quizModal.show();
}






// Gestion des messages laissés par les visiteurs
function submitMessage() {
    const messageBox = document.getElementById("message-box");
    const messageDisplay = document.getElementById("message-display");

    if (messageBox.value.trim() !== "") {
        const message = document.createElement("div");
        message.classList.add("message");
        message.innerHTML = `
            <p>${messageBox.value}</p>
            <small>Posté par Anonyme</small>
        `;
        messageDisplay.appendChild(message);
        messageBox.value = "";
    }
}

// Ajout de l'effet ripple sur le header
document.getElementById('header').addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);

    ripple.style.left = `${e.clientX - this.offsetLeft}px`;
    ripple.style.top = `${e.clientY - this.offsetTop}px`;
    ripple.style.animation = 'ripple-effect 0.6s linear';
    ripple.onanimationend = () => ripple.remove();
});

// Configuration initiale de Lightbox pour une meilleure expérience visuelle
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true
});



