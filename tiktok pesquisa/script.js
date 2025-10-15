document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        { question: "Como você avalia sua experiência geral no TikTok?", options: ["😊 Excelente", "🙂 Boa", "😐 Regular", "😞 Ruim"], reward: 62.47 },
        { question: "Como você descobre novos vídeos no TikTok?", options: ["🎯 Feed 'Para você'", "❤️ Seguindo criadores", "#️⃣ Através de hashtags", "👀 Feed 'Seguindo'"], reward: 48.23 },
        { question: "Como você descobre novos vídeos no TikTok?", options: ["🎯 Feed 'Para você'", "❤️ Seguindo criadores", "#️⃣ Através de hashtags", "👀 Feed 'Seguindo'", "✨ Recomendações"], reward: 71.56 },
        { question: "O que te faz seguir um criador no TikTok?", options: ["🤣 Conteúdo divertido", "🎓 Conteúdo educativo", "❤️ Conexão pessoal", "🏆 Participação em desafios", "🗓️ Frequência de postagens"], reward: 39.14 },
        { question: "Qual desses temas de conteúdo você mais gosta de assistir no TikTok?", options: ["😂 Comédia", "💃 Dança", "💡 Tutoriais e dicas", "🤳 Vlogs diários", "💅 Moda e beleza"], reward: 87.65 },
        { question: "Qual horário do dia você mais usa o TikTok?", options: ["☀️ Manhã", "🌇 Tarde", "🌙 Noite", "🌃 Madrugada"], reward: 25.87 },
        { question: "Qual seção do TikTok você mais acessa?", options: ["🎯 Para Você", "❤️ Seguindo", "🔴 TikTok Live", "🔍 Descobrir", "➕ Outro"], reward: 94.32 },
        { question: "Com que frequência você comenta em vídeos do TikTok?", options: ["💯 Sempre", "📈 Frequentemente", "💬 Às vezes", "📉 Raramente", "❌ Nunca"], reward: 16.98 },
        { question: "Você já criou conteúdo no TikTok?", options: ["😎 Sim, frequentemente", "🙂 Sim, ocasionalmente", "🤔 Tentei algumas vezes", "👀 Não, só assisto"], reward: 67.89 },
        { question: "Qual é a sua faixa etária?", options: ["13-17 anos", "18-24 anos", "25-34 anos", "35 anos ou mais"], reward: 85.76 }
    ];

    let currentQuestionIndex = 0;
    let balance = 0;
    const finalBonus = 599.87;

    const balanceEl = document.getElementById('balance');
    const questionProgressEl = document.getElementById('question-progress');
    const questionTitleEl = document.getElementById('question-title');
    const optionsContainerEl = document.getElementById('options-container');
    const quizContainerEl = document.getElementById('quiz-container');
    
    // NOVO: Elemento da barra de progresso
    const progressBarFillEl = document.getElementById('progress-bar-fill');

    const popupOverlay = document.getElementById('popup-overlay');
    const rewardAmountEl = document.getElementById('reward-amount');
    const newBalanceEl = document.getElementById('new-balance');
    const popupNextButton = document.getElementById('popup-next-button');

    const finalPopupOverlay = document.getElementById('final-popup-overlay');
    const finalAmountEl = document.getElementById('final-amount');

    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            obj.innerHTML = formatCurrency(currentValue);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function loadQuestion() {
        if (currentQuestionIndex >= quizData.length) {
            showFinalScreen();
            return;
        }

        quizContainerEl.style.animation = 'fadeIn 0.5s ease-in-out';

        // NOVO: Atualiza a barra de progresso
        const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
        progressBarFillEl.style.width = `${progressPercentage}%`;

        const currentQuestion = quizData[currentQuestionIndex];
        
        questionProgressEl.innerHTML = `Pergunta ${currentQuestionIndex + 1} de ${quizData.length} • +R$ ${formatCurrency(currentQuestion.reward)}`;
        questionTitleEl.innerText = currentQuestion.question;

        optionsContainerEl.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('option');
            optionEl.innerHTML = `
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
                <div class="custom-radio"></div>
            `;
            optionEl.addEventListener('click', () => selectOption(optionEl));
            optionsContainerEl.appendChild(optionEl);
        });
    }

    function selectOption(selectedOptionEl) {
        if (optionsContainerEl.classList.contains('disabled')) return;
        optionsContainerEl.classList.add('disabled');
        
        selectedOptionEl.classList.add('selected');
        
        setTimeout(handleNext, 400);
    }
    
    function handleNext() {
        const reward = quizData[currentQuestionIndex].reward;
        const newBalanceValue = balance + reward;

        rewardAmountEl.innerText = formatCurrency(reward);
        newBalanceEl.innerText = formatCurrency(newBalanceValue);
        
        popupOverlay.classList.add('show');
        
        animateValue(balanceEl, balance, newBalanceValue, 1000);
        balance = newBalanceValue;
    }
    
    popupNextButton.addEventListener('click', () => {
        popupOverlay.classList.remove('show');
        confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
    });
        currentQuestionIndex++;
        
        setTimeout(() => {
            loadQuestion();
            optionsContainerEl.classList.remove('disabled');
        }, 300); 
    });
    
    function showFinalScreen() {
        quizContainerEl.classList.add('hidden');
        finalAmountEl.innerText = `R$ ${formatCurrency(finalBonus)}`;
        finalPopupOverlay.classList.add('show');
    }

    loadQuestion();
});