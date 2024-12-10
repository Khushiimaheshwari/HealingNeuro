let responses = [];
let currentStep = 0; 
const questions = document.querySelectorAll('.question-slide'); 

document.addEventListener('DOMContentLoaded', function () {
    questions.forEach((question, index) => {
        const saveButton = question.querySelector('.save-button');
        const clearButton = question.querySelector('.clear-button');
        const textarea = question.querySelector('#text-answer');

        saveButton.addEventListener('click', () => saveResponse(index));
        clearButton.addEventListener('click', () => clearResponse(index));

        loadSavedSelection(index);
    });

    updateProgressBar(); 
});

let responsesString_2 = "";

function saveResponse(questionIndex) {
    const question = questions[questionIndex];
    const answer = question.querySelector('#text-answer').value;

    if (answer.trim() !== "") {
        question.querySelector('.tick-mark').style.display = 'inline';
        showNotification('Your Response has been saved.', 'success');
        question.querySelector('#text-answer').disabled = true;
        question.querySelector('.save-button').disabled = true;
        question.querySelector('.input-container').classList.add('saved');

        responses[questionIndex] = answer;
        localStorage.setItem(`responseQuestion_2${questionIndex}`, answer);

        if (responsesString_2) {
            responsesString_2 += `, "${answer}"`;
        } else {
            responsesString_2 = `"${answer}"`;
        }

    } else {
        showNotification('Please enter a response before saving.', 'warning');
    }

    console.log("All Responses:", responsesString_2);
}

function clearResponse(questionIndex) {
    const question = questions[questionIndex];
    const textarea = question.querySelector('#text-answer');

    textarea.value = "";
    question.querySelector('.tick-mark').style.display = 'none';
    textarea.disabled = false;
    question.querySelector('.save-button').disabled = false;
    question.querySelector('.input-container').classList.remove('saved');

    responses[questionIndex] = "";
    localStorage.removeItem(`responseQuestion_2${questionIndex}`);

    const responseToRemove = `Question ${questionIndex + 1}: ${localStorage.getItem(`responseQuestion_2${questionIndex}`)} | `;
    responsesString_2 = responsesString_2.replace(responseToRemove, "");

    console.log("All Responses after Clear:", responsesString_2);
}

function updateStepText() {
    const stepText = document.getElementById('step-text');
    stepText.textContent = `STEP ${currentStep + 1} OF ${questions.length}`;
}

function goToNextQuestion() {
    if (currentStep < questions.length - 1) {
        currentStep++;
        scrollQuestionContainer('next');
        updateProgressBar();
        updateStepText();
    } else {
        showNotification('Click on the "Submit" button to save your response.', 'error');
    }
}

function goToPreviousQuestion() {
    if (currentStep > 0) {
        currentStep--;
        scrollQuestionContainer('prev');
        updateProgressBar();
        updateStepText();
    }
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const n = questions.length - 1;
    const progressPercentage = ((currentStep) / n) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

function scrollQuestionContainer(direction) {
    const questionContainer = document.querySelector('.question-container');
    const customScrollDistance = 1110;

    if (direction === 'next') {
        questionContainer.scrollBy({ left: customScrollDistance, behavior: 'smooth' });
    } else if (direction === 'prev') {
        questionContainer.scrollBy({ left: -customScrollDistance, behavior: 'smooth' });
    }
}

function loadSavedSelection(questionIndex) {
    const savedResponse = localStorage.getItem(`responseQuestion_2${questionIndex}`);
    
    const question = questions[questionIndex];
    const textarea = question.querySelector('#text-answer');
    const tickMark = question.querySelector('.tick-mark');
    const saveButton = question.querySelector('.save-button');
    
    if (savedResponse && savedResponse !== "undefined" && savedResponse !== "0") {
        textarea.value = savedResponse;
        tickMark.style.display = 'inline';
        textarea.disabled = true;
        saveButton.disabled = true;
        question.querySelector('.input-container').classList.add('saved');
    } else {
        textarea.value = "";
    }
}

function validateResponses() {
    let allSaved = true;

    questions.forEach((question, index) => {
        const savedResponse = localStorage.getItem(`responseQuestion_2${index}`);
        const textarea = question.querySelector('#text-answer');

        if (!savedResponse || savedResponse.trim() === "" || textarea.value.trim() === "") {
            allSaved = false;
        }
    });

    if (allSaved) {
        submitResponsesToFlaskSession2();
        return true;
    } else {
        showNotification('Please complete and save all the responses before submitting.', 'info');
    }
}

function closePopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    popup.classList.remove("visible");
    overlay.classList.remove("visible");
}

function showPopup() {
    if (validateResponses()) {
        const popup = document.getElementById("popup");
        const overlay = document.getElementById("overlay");
        popup.classList.add("visible");
        overlay.classList.add("visible");
    } else {
        showNotification('Please complete and save all the responses before submitting.', 'info');
    }
}

function showNextContent() {
    const confirmation = document.getElementById("conformation");
    const finalSubmission = document.getElementById("final_submission");

    confirmation.classList.remove("visible");
    confirmation.classList.add("hidden");

    finalSubmission.classList.remove("hidden");
    finalSubmission.classList.add("visible");
    submitResponses();
    saveResponsesToFile();
}

function submitResponses() {
    const responses = [];
    questions.forEach((question, index) => {
        const savedResponse = localStorage.getItem(`responseQuestion_2${index}`);
        if (savedResponse) {
            responses.push(`${savedResponse}`);
        }
    });

    responsesString_2 = responses.join(',');
    console.log("User responses:", responsesString_2); 
}


function showNotification(message, iconType) {
    console.log("Notification triggered:", message);

    const iconDetails = {
        success: { background: '#4CAF50', icon: '&#10004;' }, 
        warning: { background: '#FFC107', icon: '&#9888;' }, 
        error: { background: '#F44336', icon: '&#10006;' },
        info: { background: '#2196F3', icon: '&#8505;' } 
    };

    const validIconType = iconDetails[iconType] ? iconType : "info";

    if (!iconDetails[iconType]) {
        console.warn(`Invalid iconType: "${iconType}". Defaulting to "info".`);
    }   

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
    iconElement.innerHTML = iconDetails[validIconType].icon;
 

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

function saveResponsesToFile() {
    if (!responsesString_2 || responsesString_2.trim() === "") {
        console.error("No responses to save!");
        showNotification("No responses to save!", "error");
        return;
    }
    const blob = new Blob([responsesString_2], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'responses.txt';  
    link.click();
}

function submitResponsesToFlaskSession2() {
    fetch('http://127.0.0.1:5000/process-responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            session_id: 2, 
            responses: responsesString_2
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
        showNotification(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/*
function saveResponsesToFile(responsesString_2) {
    const blob = new Blob([responsesString_2], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'responses.txt';  // Name of the file to be downloaded
    link.click();
}
*/