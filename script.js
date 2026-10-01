/* ================================
MY VIRTUAL PET
================================ */


const defaultState = {

name: "Mochi",

hunger: 72,
happiness: 84,
energy: 88,
cleanliness: 78,

coins: 35,

outfit: "bow",

lamp: true,

night: false

};


let saved =
localStorage.getItem("myVirtualPet");


let state = {

...defaultState,

...(saved
? JSON.parse(saved)
: {})

};


let gameTimer = null;

let memoryFirst = null;

let memoryLock = false;


/* ================================
HELPERS
================================ */


const $ = id =>
document.getElementById(id);


const clamp = number =>
Math.max(
0,
Math.min(100, number)
);


function adjust(stat, amount) {

state[stat] =
clamp(
state[stat] + amount
);

}


function save() {

const input =
$("petName").value.trim();

state.name =
input || "Mochi";

localStorage.setItem(
"myVirtualPet",
JSON.stringify(state)
);

}


/* ================================
RENDER
================================ */


function setBar(
barID,
textID,
value
) {

value = clamp(value);

$(barID).style.width =
value + "%";

$(textID).textContent =
Math.round(value) + "%";

}


function render() {

$("coins").textContent =
state.coins;


$("petName").value =
state.name;


setBar(
"hungerBar",
"hungerText",
state.hunger
);


setBar(
"happyBar",
"happyText",
state.happiness
);


setBar(
"energyBar",
"energyText",
state.energy
);


setBar(
"cleanBar",
"cleanText",
state.cleanliness
);


$("lamp").classList.toggle(
"on",
state.lamp
);


/*
When the lamp is off,
the room automatically becomes dark.
*/

state.night =
!state.lamp;


$("room").classList.toggle(
"night",
state.night
);


$("accessory").className =
"accessory " +
(state.outfit || "");


const average =
(
state.hunger +
state.happiness +
state.energy +
state.cleanliness
) / 4;


const mood =
$("moodDot");


if (average >= 70) {

mood.style.background =
"#9ecdb4";

}

else if (average >= 40) {

mood.style.background =
"#f1c876";

}

else {

mood.style.background =
"#e99aa8";

}

}


/* ================================
SPEECH
================================ */


function speak(message) {

$("speech").textContent =
message;

}


/* ================================
BIG SPARKLES
================================ */


function actionSparkles() {

const pet =
$("petWrap");

const rect =
pet.getBoundingClientRect();


const centerX =
rect.left +
rect.width / 2;


const topY =
rect.top + 25;


const positions = [

{
x: centerX - 55,
y: topY + 20
},

{
x: centerX,
y: topY - 5
},

{
x: centerX + 55,
y: topY + 20
},

{
x: centerX - 25,
y: topY + 45
},

{
x: centerX + 25,
y: topY + 45
}

];


positions.forEach(
(position, index) => {

const element =
document.createElement(
"span"
);


element.className =
"action-sparkle";


element.style.left =
position.x + "px";


element.style.top =
position.y + "px";


element.style.animationDelay =
(index * 0.06) + "s";


document.body.appendChild(
element
);


setTimeout(
() => element.remove(),
1200
);

}
);

}


/* ================================
LITTLE SPARKLES
================================ */


function floatSparkle() {

const element =
document.createElement("span");


element.className =
"spark";


element.style.left =
Math.random() * 100 + "vw";


element.style.top =
Math.random() * 100 + "vh";


$("sparkles").appendChild(
element
);


setTimeout(
() => element.remove(),
1100
);

}


/* ================================
FEEDING
================================ */


const foods = {

strawberry: {

name: "strawberry tart",

hunger: 24,

happiness: 7,

energy: 1,

cost: 3,

line:
"That was so sweet. More, please?"

},


milk: {

name: "warm milk",

hunger: 17,

happiness: 4,

energy: 8,

cost: 2,

line:
"Mmm... warm milk makes me sleepy."

},


cake: {

name: "tiny cake",

hunger: 30,

happiness: 12,

energy: -2,

cost: 5,

line:
"Pulo is officially the best baker."

},


berry: {

name: "berry bowl",

hunger: 20,

happiness: 8,

energy: 4,

cost: 4,

line:
"Berry good. I had to say it."

}

};


function feed(foodID) {

const food =
foods[foodID];


if (!food)
return;


if (state.coins < food.cost) {

speak(
"I need a few more coins for that one."
);

return;
}


if (state.hunger >= 96) {

speak(
"I'm already very full."
);

return;
}


state.coins -=
food.cost;


adjust(
"hunger",
food.hunger
);


adjust(
"happiness",
food.happiness
);


adjust(
"energy",
food.energy
);


speak(food.line);


actionSparkles();


closeModal();


render();

save();

}


/* ================================
BATH
================================ */


function bath() {

adjust(
"cleanliness",
32
);


adjust(
"happiness",
5
);


adjust(
"energy",
-5
);


speak(
"All clean! I smell like a tiny cloud."
);


actionSparkles();


render();

save();

}


/* ================================
SLEEP
================================ */


function sleepPet() {

if (state.energy > 92) {

speak(
"I'm not sleepy yet."
);

return;
}


speak(
"Goodnight, Pulo. Wake me when there are snacks."
);


state.lamp = false;

render();


setTimeout(() => {

adjust(
"energy",
42
);


adjust(
"hunger",
-13
);


adjust(
"cleanliness",
-8
);


state.lamp = true;


speak(
"Good morning! I dreamed about cake."
);


render();

save();

}, 3000);

}


/* ================================
PETTING
================================ */


function pet() {

adjust(
"happiness",
9
);


const messages = [

"That tickles.",

"Best little pats.",

"Pulo is the best.",

"I love hanging out with you.",

"Again, again!",

"That made my whole day."

];


speak(
messages[
Math.floor(
Math.random() *
messages.length
)
]
);


actionSparkles();


render();

save();

}


/* ================================
TALK
================================ */


function talk() {

const lines = [

"Pulo is the best.",

"I think we need a bigger wardrobe.",

"Do you think my ears look cute?",

"I have a very important question: snacks?",

"Thank you for taking care of me.",

"If I had a trophy, it would say Best Bear.",

"You came back! I missed you.",

"I am small, but my personality is huge."

];


openModal(`

<h2>little conversations</h2>

<p class="modal-sub">
choose something to say
</p>

<div class="talk-grid">

${lines.map(
(line, index) => `

<button
class="talk-choice"
data-talk="${index}"
>
${line}
</button>

`
).join("")}

</div>

`);


document
.querySelectorAll("[data-talk]")
.forEach(button => {

button.onclick = () => {

const message =
lines[
Number(
button.dataset.talk
)
];


speak(message);


adjust(
"happiness",
4
);


closeModal();

render();

save();

};

});

}


/* ================================
WARDROBE
================================ */


function wardrobe() {

const items = [

[
"bow",
"soft bow",
"a classic little bow",
"outfit-bow"
],

[
"crown",
"tiny crown",
"for royal bear days",
"outfit-crown"
],

[
"beret",
"lavender beret",
"very serious fashion",
"outfit-beret"
],

[
"flower",
"pink flower",
"a flower for your bear",
"outfit-flower"
],

[
"",
"no accessory",
"back to basics",
""
]

];


openModal(`

<h2>bear's wardrobe</h2>

<p class="modal-sub">
pick something cute
</p>

<div class="wardrobe-grid">

${items.map(
item => `

<button
class="choice"
data-outfit="${item[0]}"
>

<div
class="draw-icon ${item[3]}"
></div>

<b>
${item[1]}
</b>

<small>
${item[2]}
</small>

</button>

`
).join("")}

</div>

`);


document
.querySelectorAll("[data-outfit]")
.forEach(button => {

button.onclick = () => {

state.outfit =
button.dataset.outfit;


speak(
state.outfit
? "Fashion icon unlocked."
: "Simple is cute too."
);


closeModal();

render();

save();

};

});

}


/* ================================
FOOD MENU
================================ */


function foodMenu() {

openModal(`

<h2>snack time</h2>

<p class="modal-sub">
each snack gives your bear a different little boost
</p>


<div class="food-grid">


<button
class="choice"
data-food="strawberry"
>

<div
class="draw-icon food-donut"
></div>

<b>
strawberry tart
</b>

<small>
+24 hunger · 3 coins
</small>

</button>


<button
class="choice"
data-food="milk"
>

<div
class="draw-icon food-milk"
></div>

<b>
warm milk
</b>

<small>
+17 hunger · +energy · 2 coins
</small>

</button>


<button
class="choice"
data-food="cake"
>

<div
class="draw-icon food-cake"
></div>

<b>
tiny cake
</b>

<small>
+30 hunger · +happiness · 5 coins
</small>

</button>


<button
class="choice"
data-food="berry"
>

<div
class="draw-icon food-berry"
></div>

<b>
berry bowl
</b>

<small>
+20 hunger · +energy · 4 coins
</small>

</button>


</div>


<div class="reward">

Playing mini games earns coins
for snacks and clothes.

</div>

`);


document
.querySelectorAll("[data-food]")
.forEach(button => {

button.onclick = () => {

feed(
button.dataset.food
);

};

});

}


/* ================================
MODALS
================================ */


function openModal(content) {

$("modalContent").innerHTML =
content;


$("modal")
.classList
.add("show");

}


function closeModal() {

$("modal")
.classList
.remove("show");


clearInterval(
gameTimer
);

}


/* ================================
MINI GAMES
================================ */


function games() {

openModal(`

<h2>mini game corner</h2>

<p class="modal-sub">
play little games to earn coins
</p>


<div class="game-grid">


<button
class="game-box"
data-game="stars"
>

<h3>
star catcher
</h3>

<p>
catch the moving stars
before time runs out
</p>

</button>


<button
class="game-box"
data-game="memory"
>

<h3>
memory cards
</h3>

<p>
find matching pairs
and earn a bigger reward
</p>

</button>


</div>

`);


document
.querySelectorAll("[data-game]")
.forEach(button => {

button.onclick = () => {

if (
button.dataset.game
=== "stars"
) {

startStars();

}

else {

startMemory();

}

};

});

}


/* ================================
STAR CATCHER
================================ */


function startStars() {

let score = 0;

let time = 15;


openModal(`

<h2>
star catcher
</h2>

<p class="modal-sub">
tap as many stars as you can
in 15 seconds
</p>


<div
class="game-board"
id="gameBoard"
></div>


<p>
time:
<b id="gameTime">15</b>

&nbsp;

score:
<b id="gameScore">0</b>
</p>

`);


const board =
$("gameBoard");


function spawn() {

board.innerHTML = "";


const star =
document.createElement(
"button"
);


star.className =
"star-target";


star.style.left =
Math.random() * 88 + "%";


star.style.top =
Math.random() * 78 + "%";


star.onclick = () => {

score++;


$("gameScore")
.textContent =
score;


spawn();

};


board.appendChild(
star
);

}


spawn();


gameTimer =
setInterval(() => {

time--;


$("gameTime")
.textContent =
time;


if (time <= 0) {

clearInterval(
gameTimer
);


const reward =
Math.max(
2,
score * 2
);


state.coins +=
reward;


adjust(
"happiness",
Math.min(
15,
score * 2
)
);


speak(
`You caught ${score} stars and earned ${reward} coins!`
);


closeModal();

render();

save();

}

}, 1000);

}


/* ================================
MEMORY GAME
================================ */


function startMemory() {

const values = [

"A", "A",
"B", "B",
"C", "C",
"D", "D"

];


values.sort(
() => Math.random() - .5
);


openModal(`

<h2>
memory cards
</h2>

<p class="modal-sub">
find all four pairs
</p>


<div class="memory-grid">

${values.map(
(value, index) => `

<button
class="memory-card"
data-val="${value}"
data-i="${index}"
>
${value}
</button>

`
).join("")}

</div>

`);


let found = 0;

memoryFirst = null;

memoryLock = false;


document
.querySelectorAll(".memory-card")
.forEach(card => {

card.onclick = () => {

if (
memoryLock ||
card.classList.contains(
"open"
)
) {

return;

}


card.classList.add(
"open"
);


if (!memoryFirst) {

memoryFirst =
card;

return;

}


if (
memoryFirst.dataset.val
===
card.dataset.val
) {

found++;

memoryFirst =
null;


if (found === 4) {

state.coins += 15;


adjust(
"happiness",
15
);


speak(
"Memory master! You earned 15 coins."
);


actionSparkles();


setTimeout(() => {

closeModal();

render();

save();

}, 800);

}

}

else {

memoryLock =
true;


const first =
memoryFirst;


memoryFirst =
null;


setTimeout(() => {

first.classList.remove(
"open"
);


card.classList.remove(
"open"
);


memoryLock =
false;

}, 600);

}

};

});

}


/* ================================
BUTTON CONNECTIONS
================================ */


$("closeModal").onclick =
closeModal;


$("modal").addEventListener(
"click",
event => {

if (
event.target.id
=== "modal"
) {

closeModal();

}

}
);


/* ACTION BUTTONS */

document
.querySelectorAll(".action")
.forEach(button => {

button.onclick = () => {

const panel =
button.dataset.panel;


const action =
button.dataset.action;


if (panel === "food")
foodMenu();


else if (
panel === "wardrobe"
)
wardrobe();


else if (
panel === "games"
)
games();


else if (
panel === "talk"
)
talk();


else if (
action === "bath"
)
bath();


else if (
action === "sleep"
)
sleepPet();

};

});


/* ================================
BEAR
================================ */

$("petWrap").onclick =
pet;


/* ================================
LAMP
================================ */

$("lamp").onclick = () => {

state.lamp =
!state.lamp;


speak(
state.lamp
? "Cozy lamp on."
: "Goodnight... fairy lights on."
);


render();

save();

};


/* ================================
RENAME
================================ */

$("renameBtn").onclick =
() => {

save();


speak(
`Okay! My name is ${state.name}.`
);


render();

};


$("petName").addEventListener(
"keydown",
event => {

if (
event.key === "Enter"
) {

save();


speak(
`Okay! My name is ${state.name}.`
);

}

}
);


/* ================================
STAT DECAY
================================ */

setInterval(() => {

adjust(
"hunger",
-2.2
);


adjust(
"cleanliness",
-1.1
);


adjust(
"energy",
-.8
);


adjust(
"happiness",
-.8
);


render();

save();

}, 10000);


/* ================================
BACKGROUND SPARKLES
================================ */

setInterval(
floatSparkle,
1500
);


/* ================================
START GAME
================================ */

render();
