export const gameConsole = document.getElementById("gameConsole");
export const gameCtx = gameConsole.getContext('2d');

const nextBlockConsole = document.getElementById("nextBlockConsole");
const nextBlockCtx = nextBlockConsole.getContext('2d');

const holdBlockConsole = document.getElementById("holdBlockConsole");
const holdBlockCtx = holdBlockConsole.getContext('2d');

const scoreElement = document.getElementById("score");

const title = document.getElementById("title");

const ONE_LINE_POINT = 150;
const TWO_LINE_POINT = 370;
const THREE_LINE_POINT = 780;
const TETRIS = 1500;

import * as block from "./blocks.js";
gameConsole.width = 300;
gameConsole.height = 500; // indicate row

nextBlockConsole.width = 100;
nextBlockConsole.height = 80;

holdBlockConsole.width = 100;
holdBlockConsole.height = 80;

// the board will command when the blocks are randomly generated
export class Game_Board {
    constructor() {

        // for the NEXT block canvas
        this.num_row_next = nextBlockConsole.height / block.MEASUREMENT;
        this.num_column_next = nextBlockConsole.width / block.MEASUREMENT;

        this.next_block_array;
        this.upcoming_block = new block.I_Block();
        this.upcoming_fill;
        this.upcoming_stoke;
        this.generate_random_upcoming_block();
        this.initiate_next_block_array();

        // for the HOLD block canvas
        this.swapped = false;
        this.num_row_hold = holdBlockConsole.height / block.MEASUREMENT;
        this.num_column_hold = holdBlockConsole.width / block.MEASUREMENT;

        this.hold_block_array;
        this.hold_block;
        this.hold_fill;
        this.hold_stoke;
        this.update_hold_block_canvas();
        this.initiate_hold_block_array();

        this.score = 0;
        this.number_of_row = gameConsole.height / block.MEASUREMENT;
        this.number_of_column = gameConsole.width / block.MEASUREMENT;
        this.current_block;
        this.board_array;
        this.NUM_BLOCK = 7; // use this to generate random number and then choose the specific block base on the number
        this.end_game = false;
        this.current_fill;
        this.current_stroke;
        this.line_to_clear = [];
        this.update_current_block();
        this.initiate_board_array();

        this.is_paused = false;
    }

    // update landed block to block array
    register_block_to_board() {
        const block_array = this.current_block.block; // get the array of blocks to register onto board
        let index_x_position, index_y_position;
        this.display_board();
        for (let unit of block_array){
            try{
                index_x_position = unit.x_position / block.MEASUREMENT;
                index_y_position = unit.y_position / block.MEASUREMENT;

                if (index_y_position < 0){
                    this.end_game = true;
                }

                this.board_array[index_y_position][index_x_position].status = 2; // to indicate that the block is set for permanent
                this.board_array[index_y_position][index_x_position].fill_color = this.current_block.fill_color;
                this.board_array[index_y_position][index_x_position].stroke_color = this.current_block.stroke_color;
            }
            catch (error){
                break;
            }
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

                try{
                    this.board_array[index_y_position][index_x_position].status = 1; // to indicate that the block is still in movement 
                    this.board_array[index_y_position][index_x_position].fill_color = this.current_block.fill_color;
                    this.board_array[index_y_position][index_x_position].stroke_color = this.current_block.stroke_color;
                }
                catch (error){
                    break;
                }
                
            }
        }
        
    }

    drop_block() {
        while (!this.current_block.is_landed()){
            if (this.check_valid_position()){
                this.current_block.move_down_one_row();
                this.score += 5;
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
            try{
                if (index_y_position + 1 < this.board_array.length){
                    if (this.board_array[index_y_position + 1][index_x_position].status === 2){
                        this.current_block.landed = true; // indicate that it has collided with another block on the board and set landed to true
                        return false;
                    }
                }
            }
            catch (error){
                break;
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
            try{
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
            catch (error){
                break;
            }
            
        }

        return true;
    }

    display_board() {
        scoreElement.innerHTML = `SCORE: ${this.score}`;
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
        for (let index_y_position = 0; index_y_position < this.board_array.length; index_y_position++){
            if (this.board_array[index_y_position].every(position => position.status === 2)){
                this.line_to_clear.push(index_y_position);
            }
        }
    }

    animate_line(row_array) {
        const random_color = ["gold", "yellowgreen", "aqua", "coral", "lightpink", "lightgreen", "yellow", "violet"];

        row_array.forEach(row => this.board_array[row].forEach(element => {
            element.fill_color = random_color[Math.ceil(Math.random() * random_color.length)];
            element.stroke_color = random_color[Math.ceil(Math.random() * random_color.length)];
        }));
    }

    // detect if line is cleared then clear the entire rows and shift the rest down
    clear_lines(row_array) {
        // if want can add animation before hand for all of the blocks to keep changing color and then fade away

        // change all of the values in that current row to 0 
        row_array.forEach(row => this.board_array[row].forEach(element => element.status = 0));

        if (row_array.length === 1){
            this.score += ONE_LINE_POINT;
        }
        else if (row_array.length === 2){
            this.score += TWO_LINE_POINT;
        }
        else if (row_array.length === 3){
            this.score += THREE_LINE_POINT;
        }
        else if (row_array.length === 4){
            this.score += TETRIS;
        }

        // shift all the higher row down 
        if (row_array.length >= 1){
            
            const shifted_lines = row_array[row_array.length - 1] - row_array[0] + 1;
            for (let current_column = row_array[0]; current_column >= 0; current_column -= 1){
                for (let current_row_position = 0; current_row_position < this.board_array[current_column].length; current_row_position += 1){
                    if (this.board_array[current_column][current_row_position].status === 2){
                        this.board_array[current_column][current_row_position].status = 0;
                        this.board_array[current_column + shifted_lines][current_row_position].status = 2
                        this.board_array[current_column + shifted_lines][current_row_position].fill_color = this.board_array[current_column][current_row_position].fill_color;
                        this.board_array[current_column + shifted_lines][current_row_position].stroke_color = this.board_array[current_column][current_row_position].stroke_color;
                    }
                }
            }

        }

        this.line_to_clear = [];
    }

    initiate_board_array() {
        // instantiate the number of row in the array
        this.board_array = Array(this.number_of_row);

        for (let i = 0; i < this.board_array.length; i++){
            this.board_array[i] = Array(this.number_of_column);
        }

        for (let row = 0; row < this.board_array.length; row++){
            for(let column = 0; column < this.board_array[row].length; column++){
                this.board_array[row][column] = {
                    status: 0,
                    fill_color: "white",
                    stroke_color: "white",
                }
            }
        }

    }

    update_current_block() {
        this.current_block = this.upcoming_block;
        this.generate_random_upcoming_block();
    }

    generate_random_upcoming_block(){
        const chosen_block = Math.floor(Math.random() * this.NUM_BLOCK);

        if (chosen_block === 0){
            this.upcoming_block = new block.I_Block();
        }
        else if (chosen_block === 1){
            this.upcoming_block = new block.O_Block();
        }
        else if (chosen_block === 2){
            this.upcoming_block = new block.T_Block();
        }
        else if (chosen_block === 3){
            this.upcoming_block = new block.Z_Block();
        }
        else if (chosen_block === 4){
            this.upcoming_block = new block.S_Block();
        }
        else if (chosen_block === 5){
            this.upcoming_block = new block.L_Block();
        }
        else if (chosen_block === 6){
            this.upcoming_block = new block.J_Block();
        }

        this.upcoming_fill = this.upcoming_block.fill_color;
        this.upcoming_stroke = this.upcoming_block.stroke_color;

        try{
            this.update_next_block_canvas();
        }
        catch (error){
            return;
        }
    }

    update_next_block_canvas() {
        for (let row = 0; row < this.next_block_array.length; row++){
            for(let column = 0; column < this.next_block_array[row].length; column++){
                // if the area is not locked then use a different paint color to update the canvas
                if (this.next_block_array[row][column].status === 2){
                    this.next_block_array[row][column].status = 0;
                }
            }
        }

        for (let row = 0; row < this.next_block_array.length; row++){
            for(let column = 0; column < this.next_block_array[row].length; column++){
                // if the area is not locked then use a different paint color to update the canvas
                if (this.next_block_array[row][column].status !== 2){
                    this.next_block_array[row][column].fill_color = this.upcoming_block.fill_color;
                    this.next_block_array[row][column].stroke_color = this.upcoming_block.stroke_color;
                }
            }
        }
    }

    initiate_next_block_array() {
        this.next_block_array = Array(this.num_row_next);
        
        for (let i = 0; i < this.next_block_array.length; i++){
            this.next_block_array[i] = Array(this.num_column_next);
        }

        for (let row = 0; row < this.next_block_array.length; row++){
            for (let column = 0; column < this.next_block_array[row].length; column++){
                this.next_block_array[row][column] = {
                    status: 0,
                    fill_color: "white",
                    stroke_color: "white"
                }
            }
        }
    }

    register_next_block_to_canvas() {
        // detect what is the next block and register it accordingly
        if (this.upcoming_block.constructor.name === "S_Block"){
            this.next_block_array[2][1].status = 2;
            this.next_block_array[2][2].status = 2;
            this.next_block_array[1][2].status = 2;
            this.next_block_array[1][3].status = 2;
        }
        else if (this.upcoming_block.constructor.name === "T_Block"){
            this.next_block_array[2][1].status = 2;
            this.next_block_array[2][2].status = 2;
            this.next_block_array[2][3].status = 2;
            this.next_block_array[1][2].status = 2;
        }
        else if (this.upcoming_block.constructor.name === "Z_Block"){
            this.next_block_array[1][1].status = 2;
            this.next_block_array[1][2].status = 2;
            this.next_block_array[2][2].status = 2;
            this.next_block_array[2][3].status = 2;
        }
        else if (this.upcoming_block.constructor.name === "I_Block"){
            this.next_block_array[1][0].status = 2;
            this.next_block_array[1][1].status = 2;
            this.next_block_array[1][2].status = 2;
            this.next_block_array[1][3].status = 2;
        }
        else if (this.upcoming_block.constructor.name === "O_Block"){
            this.next_block_array[1][1].status = 2;
            this.next_block_array[1][2].status = 2;
            this.next_block_array[2][1].status = 2;
            this.next_block_array[2][2].status = 2;
        }
        else if (this.upcoming_block.constructor.name === "J_Block"){
            this.next_block_array[1][1].status = 2;
            this.next_block_array[2][1].status = 2;
            this.next_block_array[2][2].status = 2;
            this.next_block_array[2][3].status = 2;
        }
        else if (this.upcoming_block.constructor.name === "L_Block"){
            this.next_block_array[2][1].status = 2;
            this.next_block_array[2][2].status = 2;
            this.next_block_array[2][3].status = 2;
            this.next_block_array[1][3].status = 2;
        }
    }

    display_next_canvas() {
        for (let index_y_position = 0; index_y_position < this.next_block_array.length; index_y_position++){
            for (let index_x_position = 0; index_x_position < this.next_block_array[index_y_position].length; index_x_position++){

                let offset_y = 0;
                let offset_x = 0;

                if (this.upcoming_block.constructor.name === "I_Block"){
                    offset_y += 10;
                    offset_x += 10;
                }
                else if (this.upcoming_block.constructor.name === "O_Block"){
                    offset_x += 10;
                }

                if (this.next_block_array[index_y_position][index_x_position].status === 2){
                    nextBlockCtx.fillStyle = this.next_block_array[index_y_position][index_x_position].fill_color;
                    nextBlockCtx.strokeStyle = this.next_block_array[index_y_position][index_x_position].stroke_color;
                    nextBlockCtx.fillRect(index_x_position * block.MEASUREMENT + offset_x, index_y_position * block.MEASUREMENT + offset_y, block.MEASUREMENT, block.MEASUREMENT);
                    nextBlockCtx.strokeRect(index_x_position * block.MEASUREMENT + offset_x, index_y_position * block.MEASUREMENT + offset_y, block.MEASUREMENT, block.MEASUREMENT);
                }
                else{
                    nextBlockCtx.clearRect(index_x_position * block.MEASUREMENT + offset_x, index_y_position * block.MEASUREMENT + offset_y, block.MEASUREMENT, block.MEASUREMENT);
                }
            }
        }
    }

    initiate_hold_block_array() {
        this.hold_block_array = Array(this.num_row_hold);
        
        for (let i = 0; i < this.hold_block_array.length; i++){
            this.hold_block_array[i] = Array(this.num_column_hold);
        }

        for (let row = 0; row < this.hold_block_array.length; row++){
            for (let column = 0; column < this.hold_block_array[row].length; column++){
                this.hold_block_array[row][column] = {
                    status: 0,
                    fill_color: "white",
                    stroke_color: "white"
                }
            }
        }

    }

    register_hold_block_to_canvas() {
        // detect what is the next block and register it accordingly
        if (this.hold_block.constructor.name === "S_Block"){
            this.hold_block_array[2][1].status = 2;
            this.hold_block_array[2][2].status = 2;
            this.hold_block_array[1][2].status = 2;
            this.hold_block_array[1][3].status = 2;
        }
        else if (this.hold_block.constructor.name === "T_Block"){
            this.hold_block_array[2][1].status = 2;
            this.hold_block_array[2][2].status = 2;
            this.hold_block_array[2][3].status = 2;
            this.hold_block_array[1][2].status = 2;
        }
        else if (this.hold_block.constructor.name === "Z_Block"){
            this.hold_block_array[1][1].status = 2;
            this.hold_block_array[1][2].status = 2;
            this.hold_block_array[2][2].status = 2;
            this.hold_block_array[2][3].status = 2;
        }
        else if (this.hold_block.constructor.name === "I_Block"){
            this.hold_block_array[1][0].status = 2;
            this.hold_block_array[1][1].status = 2;
            this.hold_block_array[1][2].status = 2;
            this.hold_block_array[1][3].status = 2;
        }
        else if (this.hold_block.constructor.name === "O_Block"){
            this.hold_block_array[1][1].status = 2;
            this.hold_block_array[1][2].status = 2;
            this.hold_block_array[2][1].status = 2;
            this.hold_block_array[2][2].status = 2;
        }
        else if (this.hold_block.constructor.name === "J_Block"){
            this.hold_block_array[1][1].status = 2;
            this.hold_block_array[2][1].status = 2;
            this.hold_block_array[2][2].status = 2;
            this.hold_block_array[2][3].status = 2;
        }
        else if (this.hold_block.constructor.name === "L_Block"){
            this.hold_block_array[2][1].status = 2;
            this.hold_block_array[2][2].status = 2;
            this.hold_block_array[2][3].status = 2;
            this.hold_block_array[1][3].status = 2;
        }
        
    }

    swap() {
        if (!this.swapped){
            if (this.hold_block === undefined){
                this.hold_block = this.current_block;
                
                this.update_current_block();
            }
            else {
                const temp_block = this.hold_block;
                this.hold_block = this.current_block;
                this.current_block = temp_block.reset();
                
                this.current_fill = this.hold_block.fill_color;
                this.current_stroke = this.hold_block.stroke_color;
            }
            
            this.update_hold_block_canvas();
            this.swapped = true;
        }
    }

    update_hold_block_canvas() {
        try{
            for (let row = 0; row < this.hold_block_array.length; row++){
                for(let column = 0; column < this.hold_block_array[row].length; column++){
                    // if the area is not locked then use a different paint color to update the canvas
                    if (this.hold_block_array[row][column].status === 2){
                        this.hold_block_array[row][column].status = 0;
                    }
                }
            }
    
            for (let row = 0; row < this.hold_block_array.length; row++){
                for(let column = 0; column < this.hold_block_array[row].length; column++){
                    // if the area is not locked then use a different paint color to update the canvas
                    if (this.hold_block_array[row][column].status !== 2){
                        this.hold_block_array[row][column].fill_color = this.hold_block.fill_color;
                        this.hold_block_array[row][column].stroke_color = this.hold_block.stroke_color;
                    }
                }
            }
        }
        catch (e){
            return;
        }
        
    }

    display_hold_block_canvas() {
        for (let index_y_position = 0; index_y_position < this.hold_block_array.length; index_y_position++){
            for (let index_x_position = 0; index_x_position < this.hold_block_array[index_y_position].length; index_x_position++){

                let offset_y = 0;
                let offset_x = 0;

                try {
                    if (this.hold_block.constructor.name === "I_Block"){
                        offset_y += 10;
                        offset_x += 10;
                    }
                    else if (this.hold_block.constructor.name === "O_Block"){
                        offset_x += 10;
                    }
                }
                catch (e){
                     
                }

                if (this.hold_block_array[index_y_position][index_x_position].status === 2){
                    holdBlockCtx.fillStyle = this.hold_block_array[index_y_position][index_x_position].fill_color;
                    holdBlockCtx.strokeStyle = this.hold_block_array[index_y_position][index_x_position].stroke_color;
                    holdBlockCtx.fillRect(index_x_position * block.MEASUREMENT + offset_x, index_y_position * block.MEASUREMENT + offset_y, block.MEASUREMENT, block.MEASUREMENT);
                    holdBlockCtx.strokeRect(index_x_position * block.MEASUREMENT + offset_x, index_y_position * block.MEASUREMENT + offset_y, block.MEASUREMENT, block.MEASUREMENT);
                }
                else{
                    holdBlockCtx.clearRect(index_x_position * block.MEASUREMENT + offset_x, index_y_position * block.MEASUREMENT + offset_y, block.MEASUREMENT, block.MEASUREMENT);
                }
            }
        }
    }
}

export function initiate_game() {
    let game_board = new Game_Board();

    document.addEventListener("keydown", (event => {
        if (!game_board.current_block.is_landed()){
            event.preventDefault();
    
            if (event.keyCode === 37 || event.keyCode === 65){
                if (game_board.valid_turn()){
                    game_board.current_block.move_left(); 
                }
            }
            else if (event.keyCode === 39 || event.keyCode === 68){
                if (game_board.valid_turn()){
                    game_board.current_block.move_right();
                }
            }
            else if (event.keyCode === 40 || event.keyCode === 83){
                game_board.current_block.increase_speed();
                game_board.score += 5;
            }
            else if (event.keyCode === 38 || event.keyCode === 87){
                game_board.current_block.rotate();
            }
            else if (event.keyCode === 32){
                game_board.drop_block();
            }
            else if (event.keyCode === 80){
                game_board.is_paused = !game_board.is_paused;
            }
            else if (event.keyCode === 16){
                game_board.swap();
            }
    
        }
    }));

    const timer = {
        start: 0,
        elapsed: 0, 
        level: game_board.current_block.speed,
    }
    play_game();
    function play_game(now = 0) {
        title.innerHTML = "TETRIS LIMITED";
        let raf = requestAnimationFrame(play_game);
        game_board.register_movement_board(); 
        game_board.register_next_block_to_canvas();
        game_board.display_hold_block_canvas();
    
        if (game_board.swapped){
            game_board.register_hold_block_to_canvas();
        }
    
        if (game_board.end_game){
            cancelAnimationFrame(raf);
            title.innerHTML = "GAME OVER";
        }
        else if (game_board.is_paused){
            title.innerHTML = "GAME PAUSED";
            // do nothing 
        }
        else if (game_board.current_block.is_landed()){
    
            timer.elapsed = now - timer.start;
            game_board.register_block_to_board();
            game_board.update_current_block();
            game_board.check_for_clear_lines();
            game_board.generate_random_upcoming_block();
            game_board.register_next_block_to_canvas();
            game_board.swapped = false;
        }
        else if (game_board.line_to_clear.length > 0){
            // include a function to animate block by changing the color of the block 
            game_board.animate_line(game_board.line_to_clear);
    
            game_board.display_next_canvas();
            game_board.display_board();
    
            timer.elapsed = now - timer.start;
            
            if (timer.elapsed > 500){
                game_board.clear_lines(game_board.line_to_clear)
            };
        }
        else{
            timer.elapsed = now - timer.start;
            game_board.display_board();
            game_board.display_next_canvas();
            game_board.display_hold_block_canvas();
            if (timer.elapsed > timer.level){
                timer.start = now;
                game_board.register_movement_board(); 
                game_board.current_block.move_down_one_row();
            }
        }
    }
}