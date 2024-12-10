let responses = [];
let currentStep = 0; 
const questions = document.querySelectorAll(".question-slide"); 

document.addEventListener("DOMContentLoaded", function () {
    for (let i = 0; i <= questions.length; i++) {
        loadSavedSelection(i);
    }
    updateStepText();
    updateProgressBar();
});

let responsesString_1 = "";

function updateStepText() {
    const stepText = document.getElementById("step-text");
    stepText.textContent = `STEP ${currentStep + 1} OF ${questions.length}`;
}

function goToNextQuestion() {
    if (currentStep < questions.length - 1) {
        currentStep++;
        scrollQuestionContainer("next");
        updateProgressBar();
        updateStepText();
    } else {
        showNotification('Click on the "Submit" button to save your response.', 'error');
    }
}

function goToPreviousQuestion() {
    if (currentStep > 0) {
        currentStep--;
        scrollQuestionContainer("prev");
        updateProgressBar();
        updateStepText();
    }
}

function updateProgressBar() {
    const progressFill = document.querySelector(".progress-fill");
    const n = questions.length - 1;
    const progressPercentage = ((currentStep) / n) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

function scrollQuestionContainer(direction) {
    const questionContainer = document.querySelector(".question-container");
    
    let customScrollDistance;
    if (window.innerWidth <= 480) { 
        customScrollDistance = questionContainer.clientWidth * 0.9; 
    } else if (window.innerWidth <= 768) { 
        customScrollDistance = questionContainer.clientWidth * 0.933; 
    } else { 
        customScrollDistance = questionContainer.clientWidth * 0.965; 
    }


    if (direction === "next") {
        questionContainer.scrollBy({ left: customScrollDistance, behavior: "smooth" });
    } else if (direction === "prev") {
        questionContainer.scrollBy({ left: -customScrollDistance, behavior: "smooth" });
    }
}

window.addEventListener("resize", () => {
   
});

function selectOption(questionIndex, answer) {
    const optionsContainer = document.querySelector(`#question-${questionIndex} .options`);
    const options = optionsContainer.querySelectorAll(".option");

    options.forEach(option => option.classList.remove("selected"));

    const selectedOption = Array.from(options).find(option => option.textContent.includes(answer));
    if (selectedOption) {
        selectedOption.classList.add("selected");

        responses[questionIndex] = answer;
        localStorage.setItem(`responseQuestion${questionIndex}`, answer);

        if (responsesString_1) {
            responsesString_1 += `, "${answer}"`;
        } else {
            responsesString_1 = `"${answer}"`;
        }
    }
}

function loadSavedSelection(questionIndex) {
    const savedSelection = localStorage.getItem(`responseQuestion${questionIndex}`);

    if (savedSelection) {
        const optionsContainer = document.querySelector(`#question-${questionIndex} .options`);
        const options = optionsContainer.querySelectorAll(".option");
        const selectedOption = Array.from(options).find(option => option.textContent.includes(savedSelection));

        if (selectedOption) {
            selectedOption.classList.add("selected");
        }
    }
}

function validateResponses() {
    const questions = document.querySelectorAll(".question-slide");
    for (let question of questions) {
        const options = question.querySelectorAll(".option");
        let isSelected = false;
        for (let option of options) {
            if (option.classList.contains("selected")) { 
                isSelected = true;
                break;
            }
        }
        if (!isSelected) {
            return false;
        }
    }
    return true;
}

function showPopup() {
    if (validateResponses()) {
        document.getElementById("popup").classList.add("visible");
        document.getElementById("overlay").classList.add("visible");
    } else {
        showNotification('Please complete all questions before submitting.', 'info');
    }
}

function showNextContent() {
    document.getElementById('conformation').classList.remove('visible');
    document.getElementById('conformation').classList.add('hidden');
    document.getElementById('final_submission').classList.remove('hidden');
    document.getElementById('final_submission').classList.add('visible');

    submitResponses();
    saveResponsesToFile();
}

function closePopup() {
    document.getElementById("popup").classList.remove("visible");
    document.getElementById("overlay").classList.remove("visible");
}

function submitResponses() {
    const responses = [];
    questions.forEach((question, index) => {
        const savedResponse = localStorage.getItem(`responseQuestion_1${index}`);
        if (savedResponse) {
            responses.push(`${savedResponse}`);
        }
    });

    responsesString_1 = responses.join(',');
    console.log("User responses:", responsesString_1); 
}

function saveResponsesToFile() {
    if (!responsesString_1 || responsesString_1.trim() === "") {
        console.error("No responses to save!");
        showNotification("No responses to save!", "error");
        return;
    }
    const blob = new Blob([responsesString_1], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'responses-session1.txt';  
    link.click();
}

function showNotification(message, iconType) {
    console.log("Notification triggered:", message);

    const iconDetails = {
        success: { background: '#4CAF50', icon: '&#10004;' }, 
        warning: { background: '#FFC107', icon: '&#9888;' }, 
        error: { background: '#F44336', icon: '&#10006;' },
        info: { background: '#2196F3', icon: '&#8505;' } 
    };

    let notification = document.getElementById('custom-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'custom-notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '480px';
        notification.style.marginRight = '50px';
        notification.style.padding = '20px';
        notification.style.backgroundColor = 'white';
        notification.style.color = '#333';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.borderRadius = '8px';
        notification.style.fontSize = '16px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '15px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
    }

    notification.innerHTML = '';

    const iconElement = document.createElement('div');
    iconElement.style.width = '40px';
    iconElement.style.height = '40px';
    iconElement.style.display = 'flex';
    iconElement.style.alignItems = 'center';
    iconElement.style.justifyContent = 'center';
    iconElement.style.borderRadius = '50%';
    iconElement.style.backgroundColor = iconDetails[iconType].background;
    iconElement.style.color = 'white';
    iconElement.style.marginRight = '15px';
    iconElement.style.flexShrink = '0';
    iconElement.innerHTML = iconDetails[iconType].icon;

    const messageElement = document.createElement('div');
    messageElement.style.display = 'flex'; 
    messageElement.style.alignItems = 'center';
    messageElement.textContent = message;

    notification.appendChild(iconElement);
    notification.appendChild(messageElement);

    notification.style.display = 'flex';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}






































/*
function scrollQuestionContainer(direction) {
    const questionContainer = document.querySelector(".question-container");
    const customScrollDistance = 1107; // Adjust based on your layout

    if (direction === "next") {
        questionContainer.scrollBy({ left: customScrollDistance, behavior: "smooth" });
    } else if (direction === "prev") {
        questionContainer.scrollBy({ left: -customScrollDistance, behavior: "smooth" });
    }
}

function scrollQuestionContainer(direction) {
    const questionContainer = document.querySelector(".question-container");
    const customScrollDistance = questionContainer.clientWidth * 0.965; // Adjust based on your layout

    if (direction === "next") {
        questionContainer.scrollBy({ left: customScrollDistance, behavior: "smooth" });
    } else if (direction === "prev") {
        questionContainer.scrollBy({ left: -customScrollDistance, behavior: "smooth" });
    }
}

function scrollQuestionContainer(direction) {
    const questionContainer = document.querySelector(".question-container");
    
    // Adjust scroll distance based on screen width
    let customScrollDistance;
    if (window.innerWidth <= 480) { // Small mobile screens
        customScrollDistance = questionContainer.clientWidth * 0.9; // 90% of container width
    } else if (window.innerWidth <= 768) { // Medium screens like tablets
        customScrollDistance = questionContainer.clientWidth * 0.8; // 80% of container width
    } else { // Larger screens
        customScrollDistance = 1095; // Default or a suitable value for desktop screens
    }

    // Scroll based on direction
    if (direction === "next") {
        questionContainer.scrollBy({ left: customScrollDistance, behavior: "smooth" });
    } else if (direction === "prev") {
        questionContainer.scrollBy({ left: -customScrollDistance, behavior: "smooth" });
    }
}

// Optional: add an event listener to handle resizing and recalibrate scroll distance
window.addEventListener("resize", () => {
    // Update the customScrollDistance if needed when resizing
});

function scrollQuestionContainer(direction) {
    const questionContainer = document.querySelector(".question-container");
    const customScrollDistance = questionContainer.clientWidth * 0.965; // Adjust based on your layout

    if (direction === "next") {
        questionContainer.scrollBy({ left: customScrollDistance, behavior: "smooth" });
    } else if (direction === "prev") {
        questionContainer.scrollBy({ left: -customScrollDistance, behavior: "smooth" });
    }
}
*/