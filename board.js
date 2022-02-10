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
        this.board_array = Array(25);
        this.NUM_BLOCK = 7; // use this to generate random number and then choose the specific block base on the number
        // this.blocks = [new block.I_Block(), new block.O_Block(), new block.T_Block(), 
        //     new block.Z_Block(), new block.S_Block(), new block.L_Block(), new block.J_Block()];
        this.end_game = false;
        this.on_board = false;
        this.current_block = new block.I_Block();
        // instantiate the number of row in the array
        for (let i = 0; i < this.board_array.length; i++){
            this.board_array[i] = Array(15);
        }
    }

    generate_random_block() {
        this.on_board = true;
        const chosen_block = Math.floor(Math.random() * this.NUM_BLOCK);

        switch (chosen_block){
            case 0: 
                this.current_block = new block.I_Block();
                break;
            case 1:
                this.current_block = new block.O_Block();
                break;
            case 2:
                this.current_block = new block.T_Block();
                break;
            case 3:
                this.current_block = new block.Z_Block();
                break;
            case 4:
                this.current_block = new block.S_Block();
                break;
            case 5:
                this.current_block = new block.L_Block();
                break;
            case 6:
                this.current_block = new block.J_Block();
                break;
        }
        
    }

}

let game_board = new Game_Board()

window.addEventListener("keypress", (event => {
    if (!game_board.current_block.is_landed()){
        switch (event.key){
            case 'a':
                gameCtx.clearRect(0, 0, gameConsole.width, gameConsole.height);
                game_board.current_block.move_left();   
                break;
            case "d":
                gameCtx.clearRect(0, 0, gameConsole.width, gameConsole.height);
                game_board.current_block.move_right();
                break;
            case 's':
                gameCtx.clearRect(0, 0, gameConsole.width, gameConsole.height);
                game_board.current_block.increase_speed();
                break;
            case 'w':
                gameCtx.clearRect(0, 0, gameConsole.width, gameConsole.height);
                game_board.current_block.rotate();
                break;
        }
    }
}));
export function play_game() {

    //game_board.current_block.render_on_screen();
    let anim = setInterval(move, 100);
    game_board.current_block.render_on_screen();

    function move() {
        if (game_board.end_game){
            clearInterval(anim);
        }
        else if (game_board.current_block.is_landed()){
            game_board.generate_random_block();
        }
        else{
            gameCtx.clearRect(0, 0, gameConsole.width, gameConsole.height);
            game_board.current_block.move_down_one_row();
        }
    }
}