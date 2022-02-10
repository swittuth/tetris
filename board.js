export let gameConsole = document.getElementById("gameConsole");
export let gameCtx = gameConsole.getContext('2d');

import * as block from "./blocks.js";
import * as action from "./interaction.js";
gameConsole.width = 300;
gameConsole.height = 500; // indicate row

// the board will command when the blocks are randomly generated
export class Game_Board {
    constructor() {
        this.number_of_row = gameConsole.height / block.MEASUREMENT;
        this.number_of_column = gameConsole.width / block.MEASUREMENT;
        this.board_array = Array(this.number_of_row);
        this.blocks = [new block.I_Block(), new block.O_Block(), new block.T_Block(), 
            new block.Z_Block(), new block.S_Block(), new block.L_Block(), new block.J_Block()];
        this.end_game = false;
        this.on_board = false;
        this.current_block = this.generate_random_block();
        // instantiate the number of row in the array
        for (let i = 0; i < this.board_array.length; i++){
            this.board_array[i] = Array(this.number_of_column);
        }
    }

    generate_random_block() {
        this.on_board = true;
        return this.blocks[Math.floor(Math.random() * this.blocks.length)];

    }

    
    
}

const game_board = new Game_Board()
export function play_game(timestamp) {
    let start_time = timestamp;
    console.log(timestamp - start_time);
    if (timestamp > game_board.current_block.speed){
        if (game_board.current_block.is_fully_landed()){
            game_board.current_block = game_board.generate_random_block();
            console.log("generated a new block");
        }
        else if (!game_board.current_block.on_board){
            action.register_block(game_board.current_block);
            action.move_block();
            console.log("block moving");
        }
    }
    
    
    //window.requestAnimationFrame(play_game);
}