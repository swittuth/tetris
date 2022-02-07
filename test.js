class Unit_Block {
    constructor (x_position, y_position) {
        this.x_position = x_position;
        this.y_position = y_position; 
        this.width = 20; 
        this.height = 20;
    }
}

const MEASUREMENT = 20;
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
        let random_position = Math.floor(Math.random() * 200);

        return random_position;
    }

    render_on_screen() {
        this.block.forEach((unit_block) => {
            gameCtx.fillStyle = "coral";
            gameCtx.strokeStyle = "red";
            gameCtx.rect(unit_block.x_position, unit_block.y_position, unit_block.width, unit_block.height);
            gameCtx.fill();
            gameCtx.stroke();
        });
    }

    move_down_one_row() {
        this.first_block.y_position += 450;
        this.second_block.y_position += MEASUREMENT;
        this.third_block.y_position += MEASUREMENT;
        this.fourth_block.y_position += MEASUREMENT;
        
    }
}

const i_block = new I_Block();
i_block.move_down_one_row()

console.log(i_block.block[0].y_position);