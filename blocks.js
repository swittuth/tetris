import * as board from "./board.js";

// measure of pixels per square that constructs the block 
const MEASUREMENT = 20;
const DEAFAULT_SPEED = 600;

/*
Shapes: 
+ I-block
+ J-block
+ L-block
+ O-block (square 2x2)
+ S-block 
+ T-block 
+ Z-block
*/


export class Unit_Block {
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

export class I_Block {
    constructor () {
        const start_x = this.randomize_start_position();
        this.moved = false;
        this.horizontal = true;
        // speed used to indicate the inital freshing rate frame for the board
        this.speed = DEAFAULT_SPEED;
        this.first_block = new Unit_Block(start_x, 0);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, 0);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, 0);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, 0);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }

    randomize_start_position() {
        let random_position = Math.floor(Math.random() * (board.gameConsole.width / MEASUREMENT)) * MEASUREMENT;

        if (random_position > (board.gameConsole.width - (MEASUREMENT * 4))){
            return random_position - (MEASUREMENT * 4);
        }

        return random_position;
    }

    render_on_screen() {
        this.block.forEach((unit_block) => {
            board.gameCtx.fillStyle = "coral";
            board.gameCtx.strokeStyle = "red";
            board.gameCtx.fillRect(unit_block.x_position, unit_block.y_position, unit_block.width, unit_block.height);
            board.gameCtx.strokeRect(unit_block.x_position, unit_block.y_position, unit_block.width, unit_block.height);
        });
    }

    move_down_one_row() {
        if (!this.is_landed()){
            this.first_block.y_position += MEASUREMENT;
            this.second_block.y_position += MEASUREMENT;
            this.third_block.y_position += MEASUREMENT;
            this.fourth_block.y_position += MEASUREMENT;
            this.render_on_screen();
        }
        this.moved = false;
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

    rotate() {       
       if (this.horizontal){
            if (this.is_near_bottom_border()){
                // all blocks' y positions are base on the 4th block 
                // all blocks' x positions are base on the 2nd block
                this.fourth_block.y_position = board.gameConsole.height - MEASUREMENT * 2;
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

        // indicate that rotation was just made
        this.moved = true
    }

    increase_speed() {
        this.move_down_one_row();
    }

    is_fully_landed() {
        return this.block.some(sub_block => sub_block.check_landed()) && !this.moved;
        
    }

    is_landed() {
        return this.block.some(sub_block => sub_block.check_landed());
        
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