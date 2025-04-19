document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const brickWall = document.getElementById('brick-wall');
    const mathProblem = document.getElementById('math-problem');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const gameOverScreen = document.getElementById('game-over');
    const finalName = document.getElementById('final-name');
    const finalTime = document.getElementById('final-time');
    const finalScore = document.getElementById('final-score');
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    
    // Game Constants
    const BRICK_LINE_HEIGHT = 30;
    const OPTION_SPEED = 0.5;
    const SCORE_CORRECT = 100;
    const SCORE_TIME_BONUS = 10;
    
    // Game State
    let gameActive = true;
    let seconds = 0;
    let brickHeight = 0;
    let currentOptions = [];
    let currentAnswer = null;
    let difficulty = 'easy';
    let score = 0;
    let animationId = null;
    let brickLines = [];
    
    // Initialize Game
    initGame();
    
    function initGame() {
        // Start timer
        const timer = setInterval(updateTimer, 1000);
        
        // Set initial math problem position
        mathProblem.style.bottom = '0px';
        
        // Start game loop
        generateProblem();
        animateOptions();
    }
    
    function updateTimer() {
        if (!gameActive) return;
        
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeDisplay.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        
        // Update difficulty
        if (minutes >= 3 && difficulty === 'easy') {
            difficulty = 'medium';
        } else if (minutes >= 5 && difficulty === 'medium') {
            difficulty = 'hard';
        }
    }
    
    function generateProblem() {
        fetch(`/generate_problem?difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => {
                mathProblem.textContent = data.problem + " = ?";
                currentAnswer = data.answer;
                
                // Clear previous options
                clearOptions();
                
                // Create new falling options
                createOptions(data.options);
            });
    }
    
    function clearOptions() {
        currentOptions.forEach(option => {
            if (option.element && document.body.contains(option.element)) {
                brickWall.removeChild(option.element);
            }
        });
        currentOptions = [];
    }
    
    function createOptions(options) {
        const wallWidth = brickWall.offsetWidth;
        const optionWidth = 70;
        const spacing = (wallWidth - (4 * optionWidth)) / 5;
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            
            const leftPosition = spacing + (index * (optionWidth + spacing));
            optionElement.style.left = `${leftPosition}px`;
            optionElement.style.top = '0px';
            
            brickWall.appendChild(optionElement);
            
            const optionObj = {
                value: option,
                element: optionElement,
                position: 0,
                speed: OPTION_SPEED + (Math.random() * 0.3)
            };
            
            currentOptions.push(optionObj);
            
            optionElement.addEventListener('click', () => checkAnswer(option, optionElement));
        });
    }
    
    function checkAnswer(selectedAnswer, optionElement) {
        if (!gameActive) return;
        
        if (selectedAnswer == currentAnswer) {
            handleCorrectAnswer(optionElement);
        } else {
            handleWrongAnswer(optionElement);
        }
    }
    
    function handleCorrectAnswer(optionElement) {
        optionElement.classList.add('correct');
        correctSound.currentTime = 0;
        correctSound.play();
        
        const wallHeight = brickWall.offsetHeight;
        const optionPosition = currentOptions.find(opt => opt.element === optionElement)?.position || 0;
        const positionRatio = 1 - (optionPosition / (wallHeight - BRICK_LINE_HEIGHT - brickHeight));
        const timeBonus = Math.floor(positionRatio * SCORE_TIME_BONUS);
        
        score += SCORE_CORRECT + timeBonus;
        scoreDisplay.textContent = score;
        
        setTimeout(() => {
            if (optionElement && document.body.contains(optionElement)) {
                brickWall.removeChild(optionElement);
            }
            generateProblem();
        }, 500);
    }
    
    function handleWrongAnswer(optionElement) {
        optionElement.classList.add('wrong');
        wrongSound.currentTime = 0;
        wrongSound.play();
        
        score = Math.max(0, score - 50);
        scoreDisplay.textContent = score;
        
        setTimeout(() => {
            addBrickLine();
            generateProblem();
        }, 500);
    }
    
    function addBrickLine() {
        brickHeight += BRICK_LINE_HEIGHT;
        
        const brickLine = document.createElement('div');
        brickLine.className = 'brick-line';
        brickLine.style.bottom = `${brickHeight}px`;
        brickWall.appendChild(brickLine);
        brickLines.push(brickLine);
        
        // Check if game over
        if (brickHeight >= brickWall.offsetHeight - BRICK_LINE_HEIGHT) {
            endGame();
        }
    }
    
    function animateOptions() {
        if (!gameActive) {
            cancelAnimationFrame(animationId);
            return;
        }
        
        const wallHeight = brickWall.offsetHeight;
        const bottomThreshold = wallHeight - brickHeight;
        let optionReachedBottom = false;
        
        currentOptions.forEach((option) => {
            if (option.element && document.body.contains(option.element)) {
                option.position += option.speed;
                option.element.style.top = `${option.position}px`;
                
                if (option.position >= bottomThreshold - 40 && !optionReachedBottom) {
                    optionReachedBottom = true;
                }
            }
        });
        
        if (optionReachedBottom) {
            // Remove all options that reached bottom
            currentOptions = currentOptions.filter(opt => {
                if (opt.position >= bottomThreshold - 40) {
                    if (opt.element && document.body.contains(opt.element)) {
                        brickWall.removeChild(opt.element);
                    }
                    return false;
                }
                return true;
            });
            
            if (currentOptions.length === 0) {
                addBrickLine();
                generateProblem();
            }
        }
        
        animationId = requestAnimationFrame(animateOptions);
    }
    
    function endGame() {
        gameActive = false;
        cancelAnimationFrame(animationId);
        
        finalName.textContent = document.querySelector('.player-name span').textContent;
        finalTime.textContent = timeDisplay.textContent;
        finalScore.textContent = score;
        
        gameOverScreen.style.display = 'flex';
    }
});
