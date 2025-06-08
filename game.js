let atf = 100;
let distance = 0;
let tools = 3;
let currency = 0;
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

function update() {
    if (atf > 0) {
        distance += 1;
        atf -= 1;
        if (Math.random() < 0.1) {
            currency += 1;
        }
        if (Math.random() < 0.05 && tools > 0) {
            tools -= 1;
        }
    }
    draw();
    document.getElementById("stats").innerText = `ATF: ${atf} | Distance: ${distance}m | Tools: ${tools} | 💰: ${currency}`;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "gray";
    ctx.fillRect(20, 200, 360, 20);
    ctx.fillStyle = "blue";
    ctx.fillRect(180, 160, 40, 40);
}

function drinkKvass() {
    atf += 15;
}

function sendStats() {
    if (window.Telegram.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify({
            distance: distance,
            tools: tools,
            currency: currency
        }));
    }
}

setInterval(update, 500);