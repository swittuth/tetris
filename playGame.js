import * as game_board from "./board.js";

const start_restart_button = document.getElementById("start-restart");
const instruction_button = document.getElementById("instruction-button");

start_restart_button.addEventListener("click", () => {
    game_board.initiate_game();
    start_restart_button.innerHTML = "RESTART";
});

instruction_button.addEventListener("click", () => {
    window.alert(`    "a" or ← : move left
    "d" or → : move right
    "s" or ↓ : increase speed
    "w" or ↑ : rotate block
    "spacebar" : drop block
    "shift": hold / swap block
    "p" : pause game`)
})