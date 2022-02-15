import * as board from "./board.js";

// measure of pixels per square that constructs the block 
export const MEASUREMENT = 20;
const DEAFAULT_SPEED = 400;

// BUILDING BLOCKS FOR THE ACTUAL BLOCKS IN THE GAME

// actually generate piece to be in the middle of the canvas
function randomize_starting_position() {
    
    // let random_position = Math.floor(Math.random() * (board.gameConsole.width / MEASUREMENT)) * MEASUREMENT;

    // if (random_position > (board.gameConsole.width - (MEASUREMENT * 4))){
    //     return random_position - (MEASUREMENT * 4);
    // }

    let random_position = board.gameConsole.width / 2;

    if (random_position % MEASUREMENT != 0)
    {
        random_position -= 10;
    }

    return random_position;
}

class Unit_Block {
    constructor (x_position, y_position) {
        this.x_position = x_position;
        this.y_position = y_position;
        this.width = MEASUREMENT; 
        this.height = MEASUREMENT;
    }

    check_landed() {
        if (this.y_position === (board.gameConsole.height - MEASUREMENT)){
            return true;
        }
        else{
            return false;
        }
    }

    check_left_border() {
        return (this.x_position === 0) ? true : false;
    }

    check_right_border() {
        return (this.x_position === board.gameConsole.width - MEASUREMENT) ? true : false;
    }

    // use in the rotate function - helper function
    check_near_left_border() {
        return (this.x_position < MEASUREMENT * 2) ? true : false;
    }

    check_near_right_border() {
        return (this.x_position >= board.gameConsole.width - MEASUREMENT * 2) ? true : false;
    }

    check_near_bottom_border() {
        return (this.y_position >= board.gameConsole.height - MEASUREMENT * 3) ? true : false;
    }

    check_bottom_border() {
        return (this.y_position === board.gameConsole.height - MEASUREMENT) ? true : false;
    }

};

class Block {
    constructor (fill_color, stroke_color) {
        this.start_x = randomize_starting_position();
        this.start_y = -20;
        this.horizontal = true;
        this.moved = true;
        this.speed = DEAFAULT_SPEED;
        this.fill_color = fill_color;
        this.stroke_color = stroke_color;
        this.landed = false;
        this.left_border = false;
        this.right_border = false;

        this.near_left_border = false;
        this.near_right_border = false;
        this.near_bottom_border = false;
    }

    render_on_screen() {
        this.block.forEach((unit_block) => {
            board.gameCtx.fillStyle = this.fill_color;
            board.gameCtx.strokeStyle = this.stroke_color;
            board.gameCtx.fillRect(unit_block.x_position, unit_block.y_position, unit_block.width, unit_block.height);
            board.gameCtx.strokeRect(unit_block.x_position, unit_block.y_position, unit_block.width, unit_block.height);
        });
    }

    rotate() {
        // doesn't do any rotation
    }

    move_down_one_row() {
        if (!this.is_landed()){
            this.first_block.y_position += MEASUREMENT;
            this.second_block.y_position += MEASUREMENT;
            this.third_block.y_position += MEASUREMENT;
            this.fourth_block.y_position += MEASUREMENT;
        }
    }

    move_left() {
        // detect if block on left border and if so prevent it from moving outside the canvas
        if (!this.is_left_border()){
            this.first_block.x_position -= MEASUREMENT;
            this.second_block.x_position -= MEASUREMENT;
            this.third_block.x_position -= MEASUREMENT;
            this.fourth_block.x_position -= MEASUREMENT;
            this.moved = true;
        }
    }

    move_right() {
        // detect if block on right border and if so prevent it from moving outside the canvas
        if (!this.is_right_border()){
            this.first_block.x_position += MEASUREMENT;
            this.second_block.x_position += MEASUREMENT;
            this.third_block.x_position += MEASUREMENT;
            this.fourth_block.x_position += MEASUREMENT;
            this.moved = true;
        }
    }

    is_landed() {
        if (this.block.some(sub_block => sub_block.check_landed() || this.landed)){
            this.moved = false;
            return true;
        }
        return false;
    }

    is_fully_landed() {
        return this.block.some(sub_block => sub_block.check_landed) && !this.moved;
    }

    increase_speed() {
        this.move_down_one_row();
    }

    is_left_border() {
        return this.block.some(sub_block => sub_block.check_left_border() || this.left_border);
    }

    is_right_border() {
        return this.block.some(sub_block => sub_block.check_right_border() || this.right_border);
    }

    is_bottom_border() {
        return this.block.some(sub_block => sub_block.check_bottom_border());
    }

    is_near_left_border() {
        return this.block.some(sub_block => sub_block.check_near_left_border()) || this.near_left_border;
    }

    is_near_right_border() {
        return this.block.some(sub_block => sub_block.check_near_right_border()) || this.near_right_border;
    }

    is_near_bottom_border() {
        return this.block.some(sub_block => sub_block.check_near_bottom_border()) || this.near_bottom_border;
    }
}

export class O_Block extends Block{
    constructor () {
        super("aqua", "blue");
        this.first_block = new Unit_Block(this.start_x, this.start_y);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.start_y);
        this.third_block = new Unit_Block(this.first_block.x_position, this.second_block.y_position + MEASUREMENT);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.third_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }
}

export class T_Block extends Block {
    constructor() {
        super("lightgray", "gray");
        this.first_block = new Unit_Block(this.start_x, this.start_y);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.fourth_block = new Unit_Block(this.second_block.x_position, this.second_block.y_position - MEASUREMENT);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
        this.facing_up = true;
    }

    rotate() {       
        if (this.horizontal){
            // rotating positions are centered around the second unit block or x position and y position
            
            // during the facing up cycle
            if (this.facing_up){
                if (this.is_landed()){
                    // if it is landed and user wants to rotate then have to prop up 
                    this.third_block.y_position = board.gameConsole.height - MEASUREMENT;
                    this.third_block.x_position = this.second_block.x_position;
    
                    this.second_block.y_position = this.third_block.y_position - MEASUREMENT;
                }
                else{
                    
                    this.third_block.x_position = this.second_block.x_position;
                    this.third_block.y_position = this.second_block.y_position + MEASUREMENT;
    
                }
    
                this.first_block.x_position = this.second_block.x_position;
                this.first_block.y_position = this.second_block.y_position - MEASUREMENT;
    
                this.fourth_block.y_position = this.second_block.y_position;
                this.fourth_block.x_position = this.second_block.x_position + MEASUREMENT;
            }
            else{
                if (this.is_landed()){
                    // if it is landed and user wants to rotate then have to prop up 
                    this.first_block.y_position = board.gameConsole.height - MEASUREMENT;
                    this.first_block.x_position = this.second_block.x_position;
    
                    this.second_block.y_position = this.first_block.y_position - MEASUREMENT;
                }
                else{
                    
                    this.first_block.x_position = this.second_block.x_position;
                    this.first_block.y_position = this.second_block.y_position + MEASUREMENT;
    
                }
    
                this.third_block.x_position = this.second_block.x_position;
                this.third_block.y_position = this.second_block.y_position - MEASUREMENT;
    
                this.fourth_block.y_position = this.second_block.y_position;
                this.fourth_block.x_position = this.second_block.x_position - MEASUREMENT;
            }

        }
        else{ // deal with cases when the block is vertical
            
            // during the facing up cycle 
            if (this.facing_up){ // in other words facing right
                if (!this.is_left_border()){
                    this.fourth_block.x_position = this.second_block.x_position;
                    this.fourth_block.y_position = this.second_block.y_position + MEASUREMENT;

                    this.third_block.y_position = this.second_block.y_position;
                    this.third_block.x_position = this.second_block.x_position - MEASUREMENT;

                    this.first_block.y_position = this.second_block.y_position;
                    this.first_block.x_position = this.second_block.x_position + MEASUREMENT;
                    this.facing_up = false;
                    // changes the cycle because now the t-block will be facing downward
                }
            }
            else{
                if (!this.is_right_border()){ // facing left
                    this.fourth_block.x_position = this.second_block.x_position;
                    this.fourth_block.y_position = this.second_block.y_position - MEASUREMENT;

                    this.third_block.y_position = this.second_block.y_position;
                    this.third_block.x_position = this.second_block.x_position + MEASUREMENT;

                    this.first_block.y_position = this.second_block.y_position;
                    this.first_block.x_position = this.second_block.x_position - MEASUREMENT;
                    this.facing_up = true;
                }
            }
        }
 
        this.horizontal = !this.horizontal;
        this.moved = true;
 
    }
}

export class I_Block extends Block{
    constructor () {
        super("coral", "red");
        // speed used to indicate the inital freshing rate frame for the board
        this.first_block = new Unit_Block(this.start_x, this.start_y);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.start_y);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, this.start_y);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.start_y);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }

    rotate() {       
       if (this.horizontal){
            if (this.is_near_bottom_border() || this.is_landed()){
                // all blocks' y positions are base on the 4th block 
                // all blocks' x positions are base on the 2nd block
                this.fourth_block.y_position = board.gameConsole.height - MEASUREMENT;
                this.fourth_block.x_position = this.second_block.x_position;

                this.third_block.y_position = this.fourth_block.y_position - MEASUREMENT;
                this.third_block.x_position = this.second_block.x_position;

                this.second_block.y_position = this.third_block.y_position - MEASUREMENT;
                
                this.first_block.y_position = this.second_block.y_position - MEASUREMENT;
                this.first_block.x_position = this.second_block.x_position;
            }
            else {
                // change position of first block
                this.first_block.x_position = this.second_block.x_position;
                this.first_block.y_position = this.second_block.y_position - MEASUREMENT;

                // change position of third block
                this.third_block.x_position = this.second_block.x_position;
                this.third_block.y_position = this.second_block.y_position + MEASUREMENT;

                // change position of fourth block based off of third block
                this.fourth_block.x_position = this.second_block.x_position;
                this.fourth_block.y_position = this.third_block.y_position + MEASUREMENT;
            }
       }
       else{ // deal with cases when the block is vertical
            if (this.is_right_border() || this.is_near_right_border()){
                // reset the block so that it fits within the canvas in horizontal position
                // have to base x position off of 4th block
                // have to base x position off of 2nd block

                this.fourth_block.y_position = this.second_block.y_position;
                this.fourth_block.x_position = board.gameConsole.width - MEASUREMENT;

                this.third_block.y_position = this.second_block.y_position;
                this.third_block.x_position = this.fourth_block.x_position - MEASUREMENT;

                this.second_block.x_position = this.third_block.x_position - MEASUREMENT;

                this.first_block.y_position = this.second_block.y_position;
                this.first_block.x_position = this.second_block.x_position - MEASUREMENT;

            }
            else if (this.is_left_border()){
                // y position base on the second block
                // x posiiton base on the first block 
                this.first_block.y_position = this.second_block.y_position;
                this.first_block.x_position = 0;
                
                this.second_block.x_position = this.first_block.x_position + MEASUREMENT;

                this.third_block.y_position = this.second_block.y_position;
                this.third_block.x_position = this.second_block.x_position + MEASUREMENT;

                this.fourth_block.y_position = this.second_block.y_position;
                this.fourth_block.x_position = this.third_block.x_position + MEASUREMENT;

                
            }
            else{
                // change position of first block
                this.first_block.x_position = this.second_block.x_position - MEASUREMENT;
                this.first_block.y_position = this.second_block.y_position;

                // change position of third block
                this.third_block.x_position = this.second_block.x_position + MEASUREMENT;
                this.third_block.y_position = this.second_block.y_position;

                // change position of fourth block based off of third block
                this.fourth_block.x_position = this.third_block.x_position + MEASUREMENT;
                this.fourth_block.y_position = this.second_block.y_position;
            }
            
       }

        this.horizontal = !this.horizontal;
        this.moved = true;

    }
}

export class Z_Block extends Block {
    constructor() {
        super("lightpink", "deeppink");
        this.first_block = new Unit_Block(this.start_x, this.start_y);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.third_block = new Unit_Block(this.second_block.x_position, this.first_block.y_position + MEASUREMENT);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.third_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }

    rotate() {
        // rotate base on the second block's position
        if (this.horizontal){
            this.first_block.x_position = this.second_block.x_position;
            this.first_block.y_position = this.second_block.y_position - MEASUREMENT;

            this.third_block.y_position = this.second_block.y_position;
            this.third_block.x_position = this.second_block.x_position - MEASUREMENT;

            this.fourth_block.x_position = this.third_block.x_position;
            this.fourth_block.y_position = this.third_block.y_position + MEASUREMENT;
        }
        else {
            if (this.is_left_border()){
                // only case that is actually based on the first block
                this.first_block.x_position = 0;
                this.second_block.x_position = this.first_block.x_position + MEASUREMENT;
            }
            else if (this.is_right_border()){
                this.first_block.x_position = board.gameConsole.width - (MEASUREMENT * 3);
                this.second_block.x_position = this.first_block.x_position + MEASUREMENT;
            }
            else{
                this.first_block.x_position = this.second_block.x_position - MEASUREMENT;
            }

            this.first_block.y_position = this.second_block.y_position ;

            this.third_block.x_position = this.second_block.x_position;
            this.third_block.y_position = this.second_block.y_position + MEASUREMENT;

            this.fourth_block.y_position = this.third_block.y_position;
            this.fourth_block.x_position = this.third_block.x_position + MEASUREMENT;
        }

        this.horizontal = !this.horizontal;
        this.moved = true;
 
    }
    
}

export class S_Block extends Block {
    constructor() {
        super("lightgreen", "darkgreen");
        this.first_block = new Unit_Block(this.start_x, MEASUREMENT);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.third_block = new Unit_Block(this.second_block.x_position, this.first_block.y_position - MEASUREMENT);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.third_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }

    rotate() {
        if (this.horizontal){
            // block will rotate base on the second unit block
            if (this.is_landed()){
                this.first_block.y_position = board.gameConsole.height - MEASUREMENT;
                this.second_block.y_position = this.first_block.y_position - MEASUREMENT;
            }
            else{
                this.first_block.y_position = this.second_block.y_position + MEASUREMENT;
            }
            this.first_block.x_position = this.second_block.x_position;

            this.third_block.y_position = this.second_block.y_position;
            this.third_block.x_position = this.second_block.x_position - MEASUREMENT;

            this.fourth_block.x_position = this.third_block.x_position;
            this.fourth_block.y_position = this.third_block.y_position - MEASUREMENT;
        }
        else {
            if (this.is_near_right_border()){
                this.fourth_block.x_position = board.gameConsole.width - MEASUREMENT;

                this.third_block.y_position = this.fourth_block.y_position;
                this.third_block.x_position = this.fourth_block.x_position - MEASUREMENT;

                this.second_block.x_position = this.third_block.x_position;
                this.second_block.y_position = this.third_block.y_position + MEASUREMENT;

                this.first_block.y_position = this.second_block.y_position;
                this.first_block.x_position = this.second_block.x_position - MEASUREMENT;
            }
            else{
                this.first_block.y_position = this.second_block.y_position;
                this.first_block.x_position = this.second_block.x_position - MEASUREMENT;

                this.third_block.x_position = this.second_block.x_position;
                this.third_block.y_position = this.second_block.y_position - MEASUREMENT;

                this.fourth_block.y_position = this.third_block.y_position;
                this.fourth_block.x_position = this.third_block.x_position + MEASUREMENT;
            }   
        }
        this.horizontal = !this.horizontal;
        this.moved = true;
    }

}

export class L_Block extends Block {
    constructor() {
        super("yellow", "orange");
        this.first_block = new Unit_Block(this.start_x, this.start_y);
        this.second_block = new Unit_Block(this.first_block.x_position, this.first_block.y_position + MEASUREMENT);
        this.third_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
        this.facing_up = false;
    }

    rotate(){
        if (this.horizontal){
            if (!this.facing_up){ // during the facing down cycle of the block
                this.third_block.x_position -= MEASUREMENT;
                this.first_block.y_position += MEASUREMENT;
                this.second_block.x_position += MEASUREMENT;
                this.fourth_block.x_position = this.third_block.x_position;
                this.fourth_block.y_position = this.third_block.y_position - MEASUREMENT;
            }
            else{
                // building off from block unit number 3
                this.third_block.x_position += MEASUREMENT;
                this.third_block.y_position -= MEASUREMENT;

                this.fourth_block.y_position = this.third_block.y_position + MEASUREMENT;
                this.fourth_block.x_position = this.third_block.x_position;

                this.first_block.y_position = this.third_block.y_position - MEASUREMENT;
                this.first_block.x_position = this.third_block.x_position;

                this.second_block.y_position = this.first_block.y_position;
                this.second_block.x_position = this.first_block.x_position - MEASUREMENT;
            }
        }
        else{
            // edge cases happen when the block is horizontally either 
            // on the left or right side border 
            if (!this.facing_up){
                if (this.is_right_border()){
                    this.first_block.x_position = board.gameConsole.width - MEASUREMENT;
                    this.second_block.y_position -= MEASUREMENT;

                    this.third_block.y_position = this.first_block.y_position;
                    this.third_block.x_position = this.first_block.x_position - MEASUREMENT;

                    this.fourth_block.y_position = this.third_block.y_position;
                    this.fourth_block.x_position = this.third_block.x_position - MEASUREMENT;

                }
                else{
                    this.fourth_block.y_position = this.first_block.y_position;
                    this.third_block.y_position = this.second_block.y_position;
                    this.third_block.x_position = this.second_block.x_position;

                    this.first_block.y_position = this.third_block.y_position;
                    this.first_block.x_position = this.third_block.x_position + MEASUREMENT;
                    
                    this.second_block.x_position = this.first_block.x_position;
                    this.second_block.y_position = this.first_block.y_position - MEASUREMENT;
                }
                this.facing_up = true;
            }
            else {
                if (this.is_left_border()){
                    // base on the first unit block position to rotate
                    this.first_block.x_position = 0;
                    this.first_block.y_position += MEASUREMENT;
                    this.second_block.y_position = this.first_block.y_position + MEASUREMENT;
                    this.third_block.x_position = this.first_block.x_position + MEASUREMENT;
                    this.third_block.y_position = this.first_block.y_position;
                    this.fourth_block.y_position = this.third_block.y_position;
                    this.fourth_block.x_position = this.third_block.x_position + MEASUREMENT;
                }
                else {
                    this.fourth_block.y_position = this.third_block.y_position;

                    this.third_block.x_position -= MEASUREMENT;

                    this.first_block.y_position = this.third_block.y_position;
                    this.first_block.x_position = this.third_block.x_position - MEASUREMENT;

                    this.second_block.x_position = this.first_block.x_position;
                    this.second_block.y_position = this.first_block.y_position + MEASUREMENT;
                }

                this.facing_up = false;
            }
        }

        //this.render_on_screen();
        this.horizontal = !this.horizontal;
        this.moved = true;
    }
}

export class J_Block extends Block {
    constructor() {
        super("violet", "purple");
        this.first_block = new Unit_Block(this.start_x, this.start_y);
        this.second_block = new Unit_Block(this.first_block.x_position, this.first_block.y_position + MEASUREMENT);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, this.second_block.y_position);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.second_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
        this.facing_up = true;
    }

    rotate() {

        if (this.horizontal){
            if (this.facing_up){
                // rotate base on the first block
                this.first_block.y_position += MEASUREMENT;
                this.first_block.x_position += MEASUREMENT;

                this.second_block.x_position = this.first_block.x_position + MEASUREMENT;

                this.third_block.x_position = this.second_block.x_position;
                this.third_block.y_position = this.second_block.y_position - MEASUREMENT;

                this.fourth_block.x_position = this.third_block.x_position;
                this.fourth_block.y_position = this.third_block.y_position - MEASUREMENT;
            }
            else{
                this.fourth_block.y_position += MEASUREMENT;
                this.third_block.x_position -= MEASUREMENT;
                this.second_block.x_position = this.third_block.x_position;
                this.second_block.y_position = this.third_block.y_position - MEASUREMENT;

                this.first_block.y_position = this.second_block.y_position;
                this.first_block.x_position = this.second_block.x_position + MEASUREMENT;
            }
        }
        else {
            //edge cases are here when rotation can lead to out of border
            if (this.facing_up){
                if (this.is_left_border()){
                    // if so then rotate base on the fourth block
                    this.fourth_block.x_position = this.start_y;
                    this.fourth_block.y_position += MEASUREMENT;

                    this.third_block.x_position = this.fourth_block.x_position + MEASUREMENT;
                    this.second_block.y_position = this.third_block.y_position;
                    this.second_block.x_position = this.third_block.x_position + MEASUREMENT;

                    this.first_block.x_position = this.second_block.x_position;
                    this.first_block.y_position = this.second_block.y_position + MEASUREMENT;
                    
                }
                else{
                    this.second_block.y_position -= MEASUREMENT;
                    this.first_block.x_position += MEASUREMENT;

                    this.third_block.x_position -= MEASUREMENT;
                    this.fourth_block.y_position = this.third_block.y_position;
                    this.fourth_block.x_position = this.third_block.x_position - MEASUREMENT;
                }

                this.facing_up = false;
            }
            else{
                if (this.is_right_border()){
                    // if so then rotate base on the fourth block
                    this.fourth_block.x_position = board.gameConsole.width - MEASUREMENT;

                    this.third_block.y_position = this.fourth_block.y_position;
                    this.third_block.x_position = this.fourth_block.x_position - MEASUREMENT;
                    
                    this.second_block.y_position = this.third_block.y_position;
                    this.second_block.x_position = this.third_block.x_position - MEASUREMENT;

                    this.first_block.x_position = this.second_block.x_position;
                    this.first_block.y_position = this.second_block.y_position - MEASUREMENT;
                }
                else{
                    // rotate base on the third unit block
                    this.third_block.y_position += MEASUREMENT;
                    this.third_block.x_position += MEASUREMENT;

                    this.second_block.x_position = this.third_block.x_position - MEASUREMENT;
                    this.second_block.y_position = this.third_block.y_position;
                    this.fourth_block.x_position = this.third_block.x_position + MEASUREMENT;

                    this.first_block.x_position = this.second_block.x_position;
                    this.first_block.y_position = this.second_block.y_position - MEASUREMENT;
                }

                this.facing_up = true;
            }
        }


        //this.render_on_screen();
        this.moved = true;
        this.horizontal = !this.horizontal;
    }
}