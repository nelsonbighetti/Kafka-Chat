username, uid = "";
connected = false;
last_update = 0;

function login() {
    var name = document.getElementById('username').value;
    document.getElementById('login_form_wrapper').style.visibility = "hidden";
    document.getElementById('chat_wrapper').style.visibility = "visible";
    username = name;
    uid = name + new Date().getTime();
    connected = true;
}


function createRightBubbleAndClearInput(msg) {
    var bubble = document.createElement('div');
    bubble.className = "talk-bubble talk-bubble-right";
    bubble.innerHTML = "<div class=\"sender_bubble sender_bubble_right\">" +
        username + "</div>" + "<div class=\"talktext\"><p>" +
        msg + "</p></div>";

    var chat_bubbles = document.getElementById('chat_bubbles');
    chat_bubbles.appendChild(bubble);
    document.getElementById('message').value = "";
}

function sendMsg() {
    var msg = document.getElementById('message').value;
    createRightBubbleAndClearInput(msg);
    var python = require('child_process').spawn('python', ['./python/sendMsg.py', '-u', username, '-uid', uid, '-msg', msg]);
    python.stdout.on('data', function(data) {});
}

function createLeftBubble(name, msg) {
    var bubble = document.createElement('div');
    bubble.className = "talk-bubble talk-bubble-left";
    bubble.innerHTML = "<div class=\"sender_bubble sender_bubble_left\">" +
        name + "</div>" + "<div class=\"talktext\"><p>" +
        msg + "</p></div>";

    var chat_bubbles = document.getElementById('chat_bubbles');
    chat_bubbles.appendChild(bubble);
}

function updateInboundMessages() {
    var python = require('child_process').spawn('python', ['./python/receiveMsg.py', '-uid', uid, '-ts', last_update]);
    python.stdout.on('data', function(data) {
        input_json = JSON.parse(data.toString('utf8'));
        last_update = input_json['ts'];
        if (input_json['new']) {
            msg_list = JSON.parse(input_json['msg_list']);
            for (message_num in msg_list) {
                createLeftBubble(msg_list[message_num]['name'], msg_list[message_num]['msg']);
            }
        }
    });
}


(function() {

    const remote = require('electron').remote;

    function init() {
        document.getElementById("min-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            window.minimize();
        });

        document.getElementById("max-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
                window.maximize();
            } else {
                window.unmaximize();
            }
        });

        document.getElementById("close-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            window.close();
        });

        document.querySelector('#login_btn').addEventListener('click', () => {
            login()
        })

        document.querySelector('#send_btn').addEventListener('click', () => {
            sendMsg()
        })

        var messagesInbound = setInterval(updateInboundMessages, 1500);
    };

    document.onreadystatechange = function() {
        if (document.readyState == "complete") {
            init();
        }
    };
})();