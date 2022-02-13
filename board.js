export let gameConsole = document.getElementById("gameConsole");
export let gameCtx = gameConsole.getContext('2d');

import * as block from "./blocks.js";
gameConsole.width = 300;
gameConsole.height = 500; // indicate row

// the board will command when the blocks are randomly generated
export class Game_Board {
    constructor() {
        this.number_of_row = gameConsole.height / block.MEASUREMENT;
        this.number_of_column = gameConsole.width / block.MEASUREMENT;
        this.board_array = Array(this.number_of_row);
        this.NUM_BLOCK = 7; // use this to generate random number and then choose the specific block base on the number
        // this.blocks = [new block.I_Block(), new block.O_Block(), new block.T_Block(), 
        //     new block.Z_Block(), new block.S_Block(), new block.L_Block(), new block.J_Block()];
        this.end_game = false;
        this.on_board = false;
        this.current_block = new block.I_Block();
        this.current_fill = this.current_block.fill_color;
        this.current_stroke = this.current_block.stroke_color;
        // instantiate the number of row in the array
        for (let i = 0; i < this.board_array.length; i++){
            this.board_array[i] = Array(this.number_of_column);
        }

        for (let row = 0; row < this.board_array.length; row++){
            for(let column = 0; column < this.board_array[row].length; column++){
                this.board_array[row][column] = {
                    status: 0,
                    fill_color: this.current_block.fill_color,
                    stroke_color: this.current_block.stroke_color,
                }
            }
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

        this.update_paint();

    }

    update_paint() {
        for (let row = 0; row < this.board_array.length; row++){
            for(let column = 0; column < this.board_array[row].length; column++){
                // if the area is not locked then use a different paint color to update the canvas
                if (this.board_array[row][column].status !== 2){
                    this.board_array[row][column].fill_color = this.current_block.fill_color;
                    this.board_array[row][column].stroke_color = this.current_block.stroke_color;
                }
            }
        }
    }

    // update landed block to block array
    register_block_to_board() {
        const block_array = this.current_block.block; // get the array of blocks to register onto board
        let index_x_position, index_y_position;
        for (let unit of block_array){
            index_x_position = unit.x_position / block.MEASUREMENT;
            index_y_position = unit.y_position / block.MEASUREMENT;

            this.board_array[index_y_position][index_x_position].status = 2; // to indicate that the block is set for permanent
            this.board_array[index_y_position][index_x_position].fill_color = this.current_block.fill_color;
            this.board_array[index_y_position][index_x_position].stroke_color = this.current_block.stroke_color;
        }
    }

    // update movement of the block to the block array
    register_movement_board() { // board has to double check whether block has landed to the board or has led to collision by reading the values from the array
        // loop through display board and then take off the current movement first and then update the movement
        
        // READ COLLISION AND END OF BOARD HERE
        if (this.check_valid_position()){
            for (let index_y_position = 0; index_y_position < this.board_array.length; index_y_position++){
                for (let index_x_position = 0; index_x_position < this.board_array[index_y_position].length; index_x_position++){
                    if (this.board_array[index_y_position][index_x_position].status === 1){
                        this.board_array[index_y_position][index_x_position].status = 0;
                    }
                }
            }

            const block_array = this.current_block.block; // get the array of blocks to register onto board
            let index_x_position, index_y_position;
            for (let unit of block_array){
                index_x_position = unit.x_position / block.MEASUREMENT;
                index_y_position = unit.y_position / block.MEASUREMENT;

                this.board_array[index_y_position][index_x_position].status = 1; // to indicate that the block is still in movement 
            }
        }

        
    }

    check_valid_position() {
        // read if next position being made is valid on board
        // collision is made when block falling has a block underneath 
        const block_array = this.current_block.block; 
        let index_x_position, index_y_position; 
        for (let unit of block_array){ // looping through each unit in the block array
            index_x_position = unit.x_position / block.MEASUREMENT; // getting the index position of each block
            index_y_position = unit.y_position / block.MEASUREMENT;
            // checking if collision is with the below block
            if (index_y_position + 1 < this.board_array.length){
                if (this.board_array[index_y_position + 1][index_x_position].status === 2){
                    this.current_block.landed = true; // indicate that it has collided with another block on the board and set landed to true
                    return false;
                }
            }

        }

        return true; 
    }

    valid_turn() {
        const block_array = this.current_block.block; 
        let index_x_position, index_y_position; 
        for (let unit of block_array){ // looping through each unit in the block array
            index_x_position = unit.x_position / block.MEASUREMENT; // getting the index position of each block
            index_y_position = unit.y_position / block.MEASUREMENT;

            // check if side block is being collided
            // check for left side
            if (index_x_position - 1 >= 0){
                if (this.board_array[index_y_position][index_x_position - 1].status === 2){
                    this.current_block.left_border = true;
                    return false;
                }
            } // check if near left border
            else if (index_x_position - 2 >= 0){
                if (this.board_array[index_y_position][index_x_position - 2].status === 2){
                    this.current_block.near_left_border = true;
                }
                else{
                    this.current_block.near_left_border = true;
                }
            } 

            // check for right side
            if (index_x_position + 1 < this.board_array[0].length){
                if (this.board_array[index_y_position][index_x_position + 1].status === 2){
                    this.current_block.right_border = true;
                    return false;
                }
            }
            else if (index_x_position + 2 < this.board_array[0].length){
                if (this.board_array[index_y_position][index_x_position + 2].status === 2){
                    this.current_block.near_right_border = true;
                }
                else{
                    this.current_block.near_right_border = true;
                }
            }

            
        }

        return true;
    }

    display_board() {
        for (let index_y_position = 0; index_y_position < this.board_array.length; index_y_position++){
            for (let index_x_position = 0; index_x_position < this.board_array[index_y_position].length; index_x_position++){
                if (this.board_array[index_y_position][index_x_position].status === 2 || this.board_array[index_y_position][index_x_position].status === 1){
                    gameCtx.fillStyle = this.board_array[index_y_position][index_x_position].fill_color;
                    gameCtx.strokeStyle = this.board_array[index_y_position][index_x_position].stroke_color;
                    gameCtx.fillRect(index_x_position * block.MEASUREMENT, index_y_position * block.MEASUREMENT, block.MEASUREMENT, block.MEASUREMENT);
                    gameCtx.strokeRect(index_x_position * block.MEASUREMENT, index_y_position * block.MEASUREMENT, block.MEASUREMENT, block.MEASUREMENT);
                }
                else{
                    gameCtx.clearRect(index_x_position * block.MEASUREMENT, index_y_position * block.MEASUREMENT, block.MEASUREMENT, block.MEASUREMENT);
                }
            }
        }
    }

    check_for_clear_lines() {
        const lines_to_clear_array = [];
        for (let index_y_position = 0; index_y_position < this.board_array.length; index_y_position++){
            if (this.board_array[index_y_position].every(position => position.status === 2)){
                lines_to_clear_array.push(index_y_position);
            }
        }

        if (lines_to_clear_array.length > 0){
            this.clear_lines(lines_to_clear_array);
        }
    }

    // detect if line is cleared then clear the entire rows and shift the rest down
    clear_lines(row_array) {
        // if want can add animation before hand for all of the blocks to keep changing color and then fade away

        // change all of the values in that current row to 0 
        row_array.forEach(row => this.board_array[row].forEach(element => element.status = 0));

        // shift all the higher row down 
        if (row_array.length === 1){
            console.log(row_array[0]);
            for (let current_column = row_array[0] - 1; current_column >= 0; current_column -= 1){
                for (let current_row_position = 0; current_row_position < this.board_array[current_column].length; current_row_position += 1){
                    if (this.board_array[current_column][current_row_position].status === 2){
                        this.board_array[current_column][current_row_position].status = 0;
                        this.board_array[current_column + 1][current_row_position].status = 2
                    }
                }
            }
        }
        else{ // when more than one row cleared
            // determine which row to start shifting down
            // last element of the row_array is the last line to be cleared
            // the first element of the row_array is the first element to be cleared
            // number of position to be shifted down is last_element - first_element
            // row to be shifted down starts from row before the first element
            const shifted_lines = row_array[row_array.length - 1] - row_array[0] + 1;
            console.log(shifted_lines);
            for (let current_column = row_array[0]; current_column >= 0; current_column -= 1){
                for (let current_row_position = 0; current_row_position < this.board_array[current_column].length; current_row_position += 1){
                    if (this.board_array[current_column][current_row_position].status === 2){
                        this.board_array[current_column][current_row_position].status = 0;
                        this.board_array[current_column + shifted_lines][current_row_position].status = 2
                    }
                }
            }

        }

        
    }


}

const game_board = new Game_Board()

window.addEventListener("keypress", (event => {
    if (!game_board.current_block.is_landed()){
        switch (event.key){
            case 'a':
                if (game_board.valid_turn()){
                    game_board.current_block.move_left(); 
                }  
                break;
            case "d":
                if (game_board.valid_turn()){
                    game_board.current_block.move_right();
                }
                break;
            case 's':
                game_board.current_block.increase_speed();
                break;
            case 'w':
                game_board.current_block.rotate();
                break;
        }
    }
}));

const timer = {
    start: 0,
    elapsed: 0, 
    level: 200
}

export function play_game(now = 0) {
    game_board.register_movement_board(); 
    
    //function move() {
    if (game_board.end_game){
        clearInterval(anim);
    }
    else if (game_board.current_block.is_landed()){
        game_board.register_block_to_board();
        game_board.generate_random_block();
        game_board.check_for_clear_lines();
    }
    else{
        timer.elapsed = now - timer.start;

        if (timer.elapsed > timer.level){
            timer.start = now;

            game_board.register_movement_board(); 
            game_board.current_block.move_down_one_row();
        }
    }
    game_board.display_board();

    requestAnimationFrame(play_game);
}