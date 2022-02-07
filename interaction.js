let gameConsole = document.getElementById("gameConsole");
let gameCtx = gameConsole.getContext('2d');
gameConsole.width = 300;
gameConsole.height = 500;

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

// SHAPE CONSTRUCTION
const MEASUREMENT = 20;


class Unit_Block {
    constructor (x_position, y_position) {
        this.x_position = x_position;
        this.y_position = y_position; 
        this.width = MEASUREMENT; 
        this.height = MEASUREMENT;
    }

    check_landed() {
        if (this.y_position === (gameConsole.height - MEASUREMENT)){
            return true;
        }
        else{
            return false;
        }
    }
};

class I_Block {
    constructor () {
        const start_x = this.randomize_start_position();
        this.first_block = new Unit_Block(start_x, 0);
        this.second_block = new Unit_Block(this.first_block.x_position + MEASUREMENT, 0);
        this.third_block = new Unit_Block(this.second_block.x_position + MEASUREMENT, 0);
        this.fourth_block = new Unit_Block(this.third_block.x_position + MEASUREMENT, 0);
        this.block = [this.first_block, this.second_block, this.third_block, this.fourth_block];
    }

    randomize_start_position() {
        let random_position = Math.floor(Math.random() * (gameConsole.width / MEASUREMENT)) * MEASUREMENT;

        if (random_position > (gameConsole.width - (MEASUREMENT * 4))){
            return random_position - (MEASUREMENT * 4);
        }

        return random_position;
    }

    render_on_screen() {
        this.block.forEach((unit_block) => {
            gameCtx.fillStyle = "coral";
            //gameCtx.strokeStyle = "red";
            gameCtx.fillRect(unit_block.x_position, unit_block.y_position, unit_block.width, unit_block.height);
        });
    }

    move_down_one_row() {
        this.first_block.y_position += MEASUREMENT;
        this.second_block.y_position += MEASUREMENT;
        this.third_block.y_position += MEASUREMENT;
        this.fourth_block.y_position += MEASUREMENT;
        this.render_on_screen();
    }

    landed() {
        return this.block.some((block) => {
            return block.check_landed();
        });
    }
}

function move_i_block() {

    setTimeout(() => {
        gameCtx.clearRect(0, 0, gameConsole.width, gameConsole.height);
        i_block.move_down_one_row();
    }, 200)

    setTimeout(() => {
        let raf = requestAnimationFrame(move_i_block)
        if (i_block.landed()){
            cancelAnimationFrame(raf);
        }
    }, 200);

}

const i_block = new I_Block();
i_block.render_on_screen();
move_i_block();