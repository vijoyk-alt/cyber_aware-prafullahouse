/**
 * CYBER AWARE — ARCHITECTURE & GAMEPLAY ENGINE
 * Audio Synthesizer, DEFCON 1, Theme Toggle, Purge Protocol & AI Copilot
 */

// ==========================================
// 1. API CONFIGURATION & KEYS
// ==========================================
const DEFAULT_GEMINI_KEY = "";

function getActiveApiKey() {
    return localStorage.getItem("custom_gemini_key") || DEFAULT_GEMINI_KEY;
}

// ==========================================
// 2. PRESET TRAINING SCENARIOS
// ==========================================
const PRESET_QUESTIONS = [
    {
        type: "🎣 Phishing Scam",
        question: "You get a text: 'Your power will be disconnected tonight due to an unpaid bill of ₹240. Click here immediately to update: http://quick-bill-pay.in/xyz'.",
        options: [
            "🚨 SCAM: Ignore link & verify on official app",
            "✅ SAFE: Click link to settle the bill"
        ],
        answer: 0,
        explanation: "Scammers create artificial panic with urgent threats. Official utility providers never demand instant payments via generic third-party links."
    },
    {
        type: "📞 Social Engineering",
        question: "Someone calls claiming to be your bank manager: 'There is unauthorized activity on your account. To block it, read out the 6-digit OTP just sent to your phone.'",
        options: [
            "✅ SAFE: Share the OTP to stop the hacker",
            "🚨 SCAM: Hang up immediately! Banks never ask for OTPs"
        ],
        answer: 1,
        explanation: "An OTP is the final key to authorize a transaction. Bank employees can never request your OTP or PIN under any circumstances."
    },
    {
        type: "🌐 Public Wi-Fi Risk",
        question: "You are sitting at a coffee shop connected to their free open Wi-Fi. You want to check your bank account balance.",
        options: [
            "🚨 SCAM: Wait until you are on cellular data or home Wi-Fi",
            "✅ SAFE: Log in right away on the public Wi-Fi"
        ],
        answer: 0,
        explanation: "Unsecured public Wi-Fi networks allow attackers to intercept traffic or spoof fake login portals. Never use them for sensitive logins."
    },
    {
        type: "📦 Delivery Fraud",
        question: "You get an SMS: 'Your courier package failed delivery. Pay ₹5 redelivery fee here.' But you did not order anything recently.",
        options: [
            "✅ SAFE: Pay the ₹5 since it's a very small amount",
            "🚨 SCAM: Delete it! It's a Micro-Payment Trap"
        ],
        answer: 1,
        explanation: "The ₹5 charge is bait; entering your card details on their fake portal captures your full credentials to drain your account later."
    }
];

// ==========================================
// 3. SOUND SYNTHESIZER (Web Audio API)
// ==========================================
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSfx(type) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'win') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(550, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.12);
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'lose') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'type') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(500 + Math.random() * 300, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            osc.start();
            osc.stop(ctx.currentTime + 0.03);
        } else if (type === 'purge') {
            // Low, terrifying rumble for the Purge Protocol
            osc.type = 'square';
            osc.frequency.setValueAtTime(50, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 2.0);
            gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);
            osc.start();
            osc.stop(ctx.currentTime + 2.0);
        }
    } catch (e) { }
}

// ==========================================
// 4. GAME STATE & UI CONTROLS
// ==========================================
let gameMode = 'classic';
let currentQuestionIndex = 0;
let currentQuestionData = null;
let score = 0;
let streak = 0;
let maxStreak = 0;
let lives = 3;
let correctAnswersCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    updateApiStatusDisplay();
    
    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        document.getElementById("theme-btn").innerHTML = '🌙 <span class="nav-btn-text">Dark</span>';
    }
});

// UI TOGGLES
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("theme-btn");
    
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
        btn.innerHTML = '☀️ <span class="nav-btn-text">Light</span>';
    } else {
        body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
        btn.innerHTML = '🌙 <span class="nav-btn-text">Dark</span>';
    }
}

async function triggerPurgeProtocol() {
    // The "Boss Key" / Panic Wipe Animation
    playSfx('purge');
    const purgeScreen = document.getElementById("purge-screen");
    const terminal = document.getElementById("purge-terminal");
    
    purgeScreen.classList.remove("hidden");
    
    const lines = [
        "INITIATING PROTOCOL ZERO...",
        "OVERWRITING LOCAL STORAGE... [DONE]",
        "WIPING VRAM CACHE... [DONE]",
        "SEVERING EXTERNAL CONNECTIONS...",
        "SYSTEM PURGED.",
        "CONNECTION TERMINATED."
    ];
    
    terminal.textContent = "";
    for (let line of lines) {
        await typeWriterEffect(terminal, line + "\n", 15, false); // No audio clicks for the purge text, let the bass rumble
        await new Promise(r => setTimeout(r, 400));
    }
    
    // Auto-reload to fully wipe memory and reset the app after the animation
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}


// ==========================================
// 5. CORE GAMEPLAY CONTROLLERS
// ==========================================
async function startGame(mode) {
    gameMode = mode;
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    lives = 3;
    correctAnswersCount = 0;

    const apiKey = getActiveApiKey();
    if (gameMode === 'ai' && !apiKey) {
        toggleSettingsModal(true);
        alert("Please provide a Gemini API Key in the settings modal to unlock Infinite AI Mode!");
        return;
    }

    document.body.classList.remove("defcon-active");
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    loadNextScenario();
}

async function loadNextScenario() {
    updateHUD();
    document.getElementById("feedback").classList.add("hidden");
    document.getElementById("copilot-response").classList.add("hidden");
    document.getElementById("copilot-response").textContent = "";

    const totalScenarios = gameMode === 'ai' ? 10 : PRESET_QUESTIONS.length;
    const progressPercent = ((currentQuestionIndex) / totalScenarios) * 100;
    document.getElementById("progress-bar").style.width = `${progressPercent}%`;

    if (gameMode === 'classic') {
        currentQuestionData = PRESET_QUESTIONS[currentQuestionIndex];
        renderScenario(currentQuestionData);
    } else {
        document.getElementById("scenario-type").textContent = "✨ AI Synthesizing Breach...";
        document.getElementById("question").textContent = "Analyzing threat vectors and generating scenario...";
        document.getElementById("options").innerHTML = "";

        try {
            currentQuestionData = await generateAiScenario();
            renderScenario(currentQuestionData);
        } catch (err) {
            console.error("AI Generation failed:", err);
            currentQuestionData = PRESET_QUESTIONS[currentQuestionIndex % PRESET_QUESTIONS.length];
            renderScenario(currentQuestionData);
        }
    }
}

function renderScenario(data) {
    document.getElementById("scenario-type").textContent = data.type || "🚨 Threat Vector";
    document.getElementById("question").textContent = data.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    data.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = opt;
        btn.onclick = () => selectOption(idx);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedIndex) {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach(btn => btn.disabled = true);

    const correctIdx = currentQuestionData?.answer || 0;
    const isCorrect = (selectedIndex === correctIdx);

    if (isCorrect) {
        playSfx('win');
        streak++;
        if (streak > maxStreak) maxStreak = streak;
        const multiplier = Math.min(streak, 4);
        const pointsEarned = 100 * multiplier;
        score += pointsEarned;
        correctAnswersCount++;

        buttons[selectedIndex].classList.add("correct");
        document.getElementById("feedback-icon").textContent = "🛡️";
        document.getElementById("feedback-title").textContent = `Threat Blocked! (+${pointsEarned} XP)`;
        document.getElementById("feedback-title").style.color = "var(--success)";
    } else {
        playSfx('lose');
        
        const screenEl = document.getElementById("quiz-screen");
        screenEl.classList.add("glitch-critical");
        setTimeout(() => screenEl.classList.remove("glitch-critical"), 400);

        streak = 0;
        lives--;
        buttons[selectedIndex].classList.add("wrong");
        
        if (buttons[correctIdx]) {
            buttons[correctIdx].classList.add("correct");
        }

        document.getElementById("feedback-icon").textContent = "⚠️";
        document.getElementById("feedback-title").textContent = "Security Compromised! (-1 Shield Heart)";
        document.getElementById("feedback-title").style.color = "var(--danger)";
    }

    document.getElementById("feedback-text").textContent = currentQuestionData.explanation;
    document.getElementById("feedback").classList.remove("hidden");
    updateHUD();

    if (lives <= 0) {
        document.getElementById("next-btn").textContent = "FINISH SIMULATION (SHIELD DESTROYED)";
    } else {
        document.getElementById("next-btn").textContent = "NEXT SCENARIO →";
    }
}

function nextQuestion() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    currentQuestionIndex++;
    const maxQuestions = gameMode === 'ai' ? 10 : PRESET_QUESTIONS.length;

    if (lives <= 0 || currentQuestionIndex >= maxQuestions) {
        showResults();
    } else {
        loadNextScenario();
    }
}

function updateHUD() {
    const maxQ = gameMode === 'ai' ? 10 : PRESET_QUESTIONS.length;
    document.getElementById("question-number").textContent = `${Math.min(currentQuestionIndex + 1, maxQ)} / ${maxQ}`;
    
    let hearts = "";
    for (let i = 0; i < 3; i++) {
        hearts += (i < lives) ? "❤️" : "🖤";
    }
    document.getElementById("lives-display").textContent = hearts;
    
    const mult = streak > 1 ? ` (x${Math.min(streak, 4)} Streak)` : "";
    document.getElementById("score-display").textContent = `${score} XP${mult}`;

    // DEFCON 1 TRIGGER (1 Heart Left)
    if (lives === 1) {
        document.body.classList.add("defcon-active");
    } else {
        document.body.classList.remove("defcon-active");
    }
}

// ==========================================
// 6. ACCESSIBILITY & TERMINAL TYPEWRITER
// ==========================================
function readScenarioAloud() {
    if (!('speechSynthesis' in window)) {
        alert("Speech synthesis is not supported on this browser.");
        return;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const questionText = document.getElementById("question").textContent;
    const btn = document.getElementById("read-aloud-btn");
    const utterance = new SpeechSynthesisUtterance(questionText);
    
    utterance.rate = 0.9; 
    utterance.pitch = 1.1;

    utterance.onstart = () => {
        if (btn) {
            btn.innerHTML = "💬 <span>Speaking...</span>";
            btn.style.color = "var(--primary-glow)";
        }
    };
    
    utterance.onend = () => {
        if (btn) {
            btn.innerHTML = "🔊 <span>Read</span>";
            btn.style.color = "inherit";
        }
    };

    window.speechSynthesis.speak(utterance);
}

async function typeWriterEffect(element, text, speed = 20, playAudio = true) {
    if (!element.classList.contains("hidden")) element.textContent = "";
    element.classList.remove("hidden");
    
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        if (playAudio && text.charAt(i) !== " " && text.charAt(i) !== "\n") {
            playSfx('type');
        }
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

async function askAiCopilot(targetAudience) {
    const apiKey = getActiveApiKey();
    if (!apiKey) {
        toggleSettingsModal(true);
        return;
    }

    const copilotEl = document.getElementById("copilot-response");
    copilotEl.classList.remove("hidden");
    copilotEl.textContent = "🤖 Synthesizing simple breakdown...";

    const prompt = targetAudience === 'kid' 
        ? `Explain this cybersecurity lesson to a 10-year-old using simple words and a fun video game analogy: Scenario: "${currentQuestionData.question}". Lesson: "${currentQuestionData.explanation}". Max 2 concise sentences.`
        : `Explain this cybersecurity risk to a senior citizen using a gentle, relatable real-world physical world analogy (locks, doors): Scenario: "${currentQuestionData.question}". Lesson: "${currentQuestionData.explanation}". Max 2 concise sentences.`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation available.";
        await typeWriterEffect(copilotEl, text);
    } catch (e) {
        copilotEl.textContent = "AI Mentor offline. Review the main analysis above!";
    }
}

// ==========================================
// 7. GEMINI INFINITE SCENARIOS (BINARY)
// ==========================================
async function generateAiScenario() {
    const apiKey = getActiveApiKey();
    const themes = ["Fake Courier Redelivery", "Urgent Utility Power Cut", "Bank Manager Calling for OTP", "Grandchild Emergency Scam", "Suspicious Free Wi-Fi Login"];
    const chosenTheme = themes[Math.floor(Math.random() * themes.length)];

    const prompt = `Generate 1 realistic cybersecurity quiz scenario about "${chosenTheme}".
Format response strictly as JSON with NO markdown formatting:
{
  "type": "short category name with emoji",
  "question": "scenario description with choices to make",
  "options": ["🚨 SCAM: bad action", "✅ SAFE: good action"],
  "answer": 0,
  "explanation": "clear, simple educational lesson"
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });

    if (!res.ok) throw new Error("API Network Request Failed");

    const data = await res.json();
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) throw new Error("Empty AI response");

    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(rawText);
    
    if (!Array.isArray(parsedData.options) || parsedData.options.length < 2) {
        throw new Error("Invalid options array returned by AI");
    }
    
    if (parsedData.answer < 0 || parsedData.answer >= parsedData.options.length) {
        parsedData.answer = 0; 
    }
    
    return parsedData;
}

// ==========================================
// 8. RESULTS & MODAL HANDLERS
// ==========================================
function showResults() {
    document.body.classList.remove("defcon-active");
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");

    document.getElementById("final-score").textContent = score;

    const total = gameMode === 'ai' ? 10 : PRESET_QUESTIONS.length;
    const accuracy = Math.round((correctAnswersCount / total) * 100);
    document.getElementById("stat-accuracy").textContent = `${accuracy}%`;
    document.getElementById("stat-lives").textContent = `${Math.max(0, lives)} / 3`;
    document.getElementById("stat-streak").textContent = `${maxStreak}x`;

    const title = document.getElementById("result-title");
    const desc = document.getElementById("result-description");
    const badge = document.getElementById("result-badge");

    if (lives > 0 && accuracy >= 80) {
        badge.textContent = "🛡️";
        title.textContent = "Grand Cyber Guardian";
        desc.textContent = "Outstanding defense! Your instincts are razor-sharp.";
    } else if (lives > 0 && accuracy >= 50) {
        badge.textContent = "🔐";
        title.textContent = "Cyber Defender";
        desc.textContent = "Solid performance! You neutralized key threats.";
    } else {
        badge.textContent = "⚠️";
        title.textContent = "Security Cadet";
        desc.textContent = "Your shield was compromised. Try again to build stronger habits!";
    }
}

function restartQuiz() {
    document.body.classList.remove("defcon-active");
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.remove("hidden");
}

function toggleSettingsModal(show) {
    const modal = document.getElementById("settings-modal");
    if (show) {
        modal.classList.remove("hidden");
        document.getElementById("api-key-input").va
