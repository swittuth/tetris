import * as action from "./interaction.js";
import * as blocks from "./blocks.js";
import * as game_board from "./board.js";

// game will be played through the command of the board game

const board_game = new game_board.Game_Board();

// board_game.simulate_game()

game_board.play_game();