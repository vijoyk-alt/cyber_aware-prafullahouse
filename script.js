const questions = [

    {
        question:
        "You receive a message saying: 'Congratulations! You have won ₹10,000. Click this link to claim your prize.' What should you do?",

        options: [
            "Click the link immediately",
            "Forward it to your friends",
            "Ignore/report it and verify the source",
            "Reply asking for more information"
        ],

        answer: 2,

        explanation:
        "Unexpected prize messages are a common phishing tactic. Do not click suspicious links. Verify the information through an official source."
    },


    {
        question:
        "Which password is the strongest?",

        options: [
            "12345678",
            "password123",
            "Rahul2009",
            "A long, unique passphrase with different characters"
        ],

        answer: 3,

        explanation:
        "Long, unique passwords are generally much harder to guess. Avoid using easily available personal information."
    },


    {
        question:
        "An unknown person sends you an email attachment. What is the safest action?",

        options: [
            "Open it immediately",
            "Download it and check later",
            "Verify the sender before opening it",
            "Forward it to someone else"
        ],

        answer: 2,

        explanation:
        "Unexpected attachments can contain harmful content. Verify the sender and the context before opening anything."
    },


    {
        question:
        "A website asks you to enter your password after you clicked a suspicious link. What should you do?",

        options: [
            "Enter the password",
            "Use your old password",
            "Close the page and visit the official website directly",
            "Ask a friend to enter it"
        ],

        answer: 2,

        explanation:
        "Phishing websites can imitate legitimate websites. Instead of using a suspicious link, navigate to the official website yourself."
    },


    {
        question:
        "Which is a good security practice?",

        options: [
            "Using the same password everywhere",
            "Sharing passwords with friends",
            "Enabling two-factor authentication",
            "Writing passwords publicly"
        ],

        answer: 2,

        explanation:
        "Two-factor authentication adds an additional layer of security beyond your password."
    },


    {
        question:
        "You receive a message from a friend asking for money, but the message seems unusual. What should you do?",

        options: [
            "Send the money immediately",
            "Ignore everything",
            "Verify the request using another trusted method",
            "Share the message publicly"
        ],

        answer: 2,

        explanation:
        "Accounts can sometimes be impersonated or compromised. Verify unusual requests through another trusted communication method."
    },


    {
        question:
        "Why should software and operating systems be updated regularly?",

        options: [
            "Only to change the appearance",
            "Updates can fix security vulnerabilities",
            "Updates make passwords unnecessary",
            "Updates prevent all cyber attacks"
        ],

        answer: 1,

        explanation:
        "Security updates often fix vulnerabilities that attackers could otherwise exploit."
    },


    {
        question:
        "Which information should you generally avoid sharing publicly online?",

        options: [
            "Your favourite movie",
            "Your favourite sport",
            "Sensitive personal information",
            "A harmless hobby"
        ],

        answer: 2,

        explanation:
        "Sensitive personal information can be misused for impersonation, scams or other forms of abuse."
    },


    {
        question:
        "You see a social-media post offering a product at an unbelievably low price with a suspicious link. What should you do?",

        options: [
            "Click immediately",
            "Check the seller and website independently",
            "Send your card details",
            "Share the post"
        ],

        answer: 1,

        explanation:
        "Extremely attractive offers can be used to lure people to fraudulent websites. Research the seller independently before taking action."
    },


    {
        question:
        "What is phishing?",

        options: [
            "A type of computer game",
            "A method of tricking people into revealing information",
            "A software update",
            "A type of computer hardware"
        ],

        answer: 1,

        explanation:
        "Phishing involves deceptive messages or websites designed to trick people into revealing information or taking unsafe actions."
    }

];


let currentQuestion = 0;
let score = 0;


function startQuiz() {

    currentQuestion = 0;
    score = 0;

    document
        .getElementById("home-screen")
        .classList.add("hidden");

    document
        .getElementById("result-screen")
        .classList.add("hidden");

    document
        .getElementById("quiz-screen")
        .classList.remove("hidden");

    showQuestion();
}


function showQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("question-number").textContent =
        `Scenario ${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("score").textContent =
        `Score: ${score}`;

    document.getElementById("question").textContent =
        q.question;

    document.getElementById("progress").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;


    const optionsContainer =
        document.getElementById("options");

    optionsContainer.innerHTML = "";


    q.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.classList.add("option");

        button.textContent = option;

        button.onclick = () => selectAnswer(index);

        optionsContainer.appendChild(button);

    });


    document
        .getElementById("feedback")
        .classList.add("hidden");
}


function selectAnswer(selectedIndex) {

    const q = questions[currentQuestion];

    const buttons =
        document.querySelectorAll(".option");


    buttons.forEach(button => {
        button.disabled = true;
    });


    if (selectedIndex === q.answer) {

        score += 10;

        buttons[selectedIndex]
            .classList.add("correct");

        document.getElementById("feedback-title")
            .textContent = "✅ Correct!";

    } else {

        buttons[selectedIndex]
            .classList.add("wrong");

        buttons[q.answer]
            .classList.add("correct");

        document.getElementById("feedback-title")
            .textContent = "❌ Not quite!";
    }


    document.getElementById("feedback-text")
        .textContent = q.explanation;

    document.getElementById("feedback")
        .classList.remove("hidden");

    document.getElementById("score")
        .textContent = `Score: ${score}`;
}


function nextQuestion() {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        showResult();

    }
}


function showResult() {

    document
        .getElementById("quiz-screen")
        .classList.add("hidden");

    document
        .getElementById("result-screen")
        .classList.remove("hidden");


    document.getElementById("final-score")
        .textContent = score;


    const title =
        document.getElementById("result-title");

    const description =
        document.getElementById("result-description");


    if (score >= 90) {

        title.textContent = "🛡️ Cyber Guardian";

        description.textContent =
            "Excellent! You demonstrate strong cybersecurity awareness.";

    } else if (score >= 70) {

        title.textContent = "🔐 Cyber Smart";

        description.textContent =
            "Good job! You understand most common cybersecurity risks.";

    } else if (score >= 50) {

        title.textContent = "⚠️ Needs Improvement";

        description.textContent =
            "You know some basics, but there is still room to improve your cyber awareness.";

    } else {

        title.textContent = "🚨 Cyber Rookie";

        description.textContent =
            "Time to strengthen your cybersecurity habits!";
    }
}


function restartQuiz() {

    document
        .getElementById("result-screen")
        .classList.add("hidden");

    document
        .getElementById("home-screen")
        .classList.remove("hidden");

}

