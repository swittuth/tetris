import * as game_board from "./board.js";

const start_button = document.getElementById("start-restart");

start_button.addEventListener("click", () => {
    game_board.play_game();
    start_button.innerHTML = "RESTART";
});