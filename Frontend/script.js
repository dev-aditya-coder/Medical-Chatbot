const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const chatBox =
    document.getElementById("chatBox");


// =========================
// NAVIGATION ELEMENTS
// =========================

const chatNav =
    document.getElementById("chatNav");

const libraryNav =
    document.getElementById("libraryNav");

const symptomsNav =
    document.getElementById("symptomsNav");

const aboutNav =
    document.getElementById("aboutNav");

const clearChatButton =
    document.getElementById("clearChatButton");


// =========================
// PAGE VIEWS
// =========================

const chatView =
    document.getElementById("chatView");

const libraryView =
    document.getElementById("libraryView");

const symptomsView =
    document.getElementById("symptomsView");

const aboutView =
    document.getElementById("aboutView");


// =========================
// CHANGE PAGE
// =========================

function showPage(page) {

    // Hide all pages
    chatView.classList.remove("active-view");

    libraryView.classList.remove("active-view");

    symptomsView.classList.remove("active-view");

    aboutView.classList.remove("active-view");


    // Remove active state from navigation
    chatNav.classList.remove("active");

    libraryNav.classList.remove("active");

    symptomsNav.classList.remove("active");

    aboutNav.classList.remove("active");


    // Show selected page

    if (page === "chat") {

        chatView.classList.add("active-view");

        chatNav.classList.add("active");

        messageInput.focus();

    }


    if (page === "library") {

        libraryView.classList.add("active-view");

        libraryNav.classList.add("active");

    }


    if (page === "symptoms") {

        symptomsView.classList.add("active-view");

        symptomsNav.classList.add("active");

    }


    if (page === "about") {

        aboutView.classList.add("active-view");

        aboutNav.classList.add("active");

    }

}


// =========================
// SIDEBAR NAVIGATION
// =========================

chatNav.addEventListener(
    "click",
    function() {

        showPage("chat");

    }
);


libraryNav.addEventListener(
    "click",
    function() {

        showPage("library");

    }
);


symptomsNav.addEventListener(
    "click",
    function() {

        showPage("symptoms");

    }
);


aboutNav.addEventListener(
    "click",
    function() {

        showPage("about");

    }
);


// =========================
// SEND MESSAGE
// =========================

async function sendMessage() {

    const message =
        messageInput.value.trim();


    if (message === "") {

        return;

    }


    // Make sure chat is visible
    showPage("chat");


    // Prevent multiple requests
    sendButton.disabled = true;


    // Add user's message
    addMessage(
        message,
        "user"
    );


    // Clear input
    messageInput.value = "";


    // Show typing indicator
    const typingMessage =
        addTypingIndicator();


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


        const data =
            await response.json();


        // Remove typing indicator
        typingMessage.remove();


        if (!response.ok) {

            addMessage(
                "Sorry, something went wrong. Please try again.",
                "assistant"
            );

            return;

        }


        // Add AI response
        addMessage(
            data.response,
            "assistant"
        );


    }

    catch (error) {

        console.error(error);


        typingMessage.remove();


        addMessage(
            "Unable to connect to the medical chatbot.",
            "assistant"
        );

    }

    finally {

        sendButton.disabled = false;

        messageInput.focus();

    }

}


// =========================
// ADD MESSAGE
// =========================

function addMessage(
    text,
    sender
) {

    const messageDiv =
        document.createElement("div");


    messageDiv.classList.add(
        "message",
        sender
    );


    const avatar =
        document.createElement("div");


    avatar.classList.add(
        "avatar"
    );


    avatar.textContent =
        sender === "assistant"
            ? "✦"
            : "●";


    const content =
        document.createElement("div");


    const bubble =
        document.createElement("div");


    bubble.classList.add(
        "bubble"
    );


    bubble.textContent =
        text;


    const time =
        document.createElement("div");


    time.classList.add(
        "time"
    );


    time.textContent =
        getCurrentTime();


    content.appendChild(
        bubble
    );


    content.appendChild(
        time
    );


    messageDiv.appendChild(
        avatar
    );


    messageDiv.appendChild(
        content
    );


    chatBox.appendChild(
        messageDiv
    );


    // Scroll to newest message
    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// =========================
// TYPING INDICATOR
// =========================

function addTypingIndicator() {

    const messageDiv =
        document.createElement("div");


    messageDiv.classList.add(
        "message",
        "assistant"
    );


    const avatar =
        document.createElement("div");


    avatar.classList.add(
        "avatar"
    );


    avatar.textContent =
        "✦";


    const content =
        document.createElement("div");


    const bubble =
        document.createElement("div");


    bubble.classList.add(
        "bubble"
    );


    bubble.innerHTML = `
        <div class="typing">

            <span></span>
            <span></span>
            <span></span>

        </div>
    `;


    content.appendChild(
        bubble
    );


    messageDiv.appendChild(
        avatar
    );


    messageDiv.appendChild(
        content
    );


    chatBox.appendChild(
        messageDiv
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return messageDiv;

}


// =========================
// CURRENT TIME
// =========================

function getCurrentTime() {

    const now =
        new Date();


    return now.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =========================
// SEND BUTTON
// =========================

sendButton.addEventListener(
    "click",
    sendMessage
);


// =========================
// ENTER KEY
// =========================

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// =========================
// SUGGESTED TOPICS
// =========================

const topicButtons =
    document.querySelectorAll(
        ".topics-card button"
    );


topicButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const topic =
                    button
                        .querySelector("span")
                        .textContent;


                showPage("chat");


                messageInput.value =
                    `Tell me about ${topic.toLowerCase()}.`;


                sendMessage();

            }
        );

    }
);


// =========================
// CLEAR CHAT
// =========================

clearChatButton.addEventListener(
    "click",
    function() {

        chatBox.innerHTML = `

            <div class="message assistant">

                <div class="avatar">
                    ✦
                </div>

                <div>

                    <div class="bubble">
                        Hello! I'm your AI Medical Assistant.<br>
                        Describe your symptoms or ask a medical question.
                    </div>

                    <div class="time">
                        ${getCurrentTime()}
                    </div>

                </div>

            </div>

        `;


        messageInput.value = "";


        showPage("chat");


        messageInput.focus();

    }
);


// =========================
// SYMPTOM BUTTONS
// =========================

const symptomButtons =
    document.querySelectorAll(
        ".symptom-card"
    );


symptomButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const symptom =
                    button.querySelector("h3")
                        .textContent;


                showPage("chat");


                messageInput.value =
                    `What can cause ${symptom.toLowerCase()}?`;


                sendMessage();

            }
        );

    }
);