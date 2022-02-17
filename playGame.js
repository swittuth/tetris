import * as game_board from "./board.js";

const start_restart_button = document.getElementById("start-restart");

start_restart_button.addEventListener("click", () => {
    game_board.initiate_game();
    start_restart_button.innerHTML = "RESTART";
});