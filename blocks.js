import * as board from "./board.js";

// measure of pixels per square that constructs the block 
const MEASUREMENT = 20;
const DEAFAULT_SPEED = 600;

// BUILDING BLOCKS FOR THE ACTUAL BLOCKS IN THE GAME

function randomize_starting_position() {
    let random_position = Math.floor(Math.random() * (board.gameConsole.width / MEASUREMENT)) * MEASUREMENT;

    if (random_position > (board.gameConsole.width - (MEASUREMENT * 4))){
        return random_position - (MEASUREMENT * 4);
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
        this.horizontal = true;
        this.moved = true;
        this.speed = DEAFAULT_SPEED;
        this.fill_color = fill_color;
        this.stroke_color = stroke_color;
    
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
        this.render_on_screen();
    }

    move_down_one_row() {
        if (!this.is_landed()){
            this.first_block.y_position += MEASUREMENT;
            this.second_block.y_position += MEASUREMENT;
            this.third_block.y_position += MEASUREMENT;
            this.fourth_block.y_position += MEASUREMENT;
        }
        this.render_on_screen();
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
        this.render_on_screen();
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
        this.render_on_screen();
    }

    is_landed() {
        if (this.block.some(sub_block => sub_block.check_landed())){
            setTimeout(() => this.moved = false, this.speed / 100);
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
        return this.block.some(sub_block => sub_block.check_left_border());
    }

    is_right_border() {
        return this.block.some(sub_block => sub_block.check_right_border());
    }

    is_bottom_border() {
        return this.block.some(sub_block => sub_block.check_bottom_border());
    }

    is_near_right_border() {
        return this.block.some(sub_block => sub_block.check_near_right_border());
    }

    is_near_bottom_border() {
        return this.block.some(sub_block => sub_block.check_near_bottom_border());
    }
}


// ACTUAL BLOCKS FOR THE GAME

/*
Shapes: 
+ I-block ("coral", "red")             - (DONE)
+ J-block ("violet", "purple")         - (NEED TO WORK ON ROTATION)
+ L-block ("yellow", "orange")         - (NEED TO WORK ON ROTATION)
+ O-block ("aqua", "blue")             - (DONE)
+ S-block ("lightgreen", "darkgreen")  - (NEED TO WORK ON ROTATION)
+ T-block ("lightgray", "charcoal")    - 
+ Z-block ("rose", "pink")             - (NEED TO WORK ON ROTATION)
*/

export class T_Block extends Block {
    constructor() {
        super("lightgray", "charcoal");
        this.first_block = new Unit_Block(this.start_x, MEASUREMENT);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.fourth_block = new Unit_Block(this.second_block.x_position, this.second_block.y_position - MEASUREMENT);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }

    rotate() {       
        if (this.horizontal){
             
        }
        else{ // deal with cases when the block is vertical
             
             
        }
 
         // indicate that it has already rotated
         this.horizontal = !this.horizontal;
         this.moved = true;
 
         this.render_on_screen();
     }
}

export class Z_Block extends Block {
    constructor() {
        super("lightpink", "deeppink");
        this.first_block = new Unit_Block(this.start_x, 0);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.third_block = new Unit_Block(this.second_block.x_position, this.first_block.y_position + MEASUREMENT);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.third_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
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
}

export class L_Block extends Block {
    constructor() {
        super("yellow", "orange");
        this.first_block = new Unit_Block(this.start_x, 0);
        this.second_block = new Unit_Block(this.first_block.x_position, this.first_block.y_position + MEASUREMENT);
        this.third_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.first_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }
}

export class J_Block extends Block {
    constructor() {
        super("violet", "purple");
        this.first_block = new Unit_Block(this.start_x, 0);
        this.second_block = new Unit_Block(this.first_block.x_position, this.first_block.y_position + MEASUREMENT);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, this.second_block.y_position);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.second_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }

    rotate() {

    }
}


export class O_Block extends Block{
    constructor () {
        super("aqua", "blue");
        this.first_block = new Unit_Block(this.start_x, 0);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, 0);
        this.third_block = new Unit_Block(this.first_block.x_position, this.second_block.y_position + MEASUREMENT);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, this.third_block.y_position);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }
}

export class I_Block extends Block{
    constructor () {
        super("coral", "red");
        // speed used to indicate the inital freshing rate frame for the board
        this.first_block = new Unit_Block(this.start_x, 0);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, 0);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, 0);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, 0);
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

        // indicate that it has already rotated
        this.horizontal = !this.horizontal;
        this.moved = true;

        this.render_on_screen();
    }
}