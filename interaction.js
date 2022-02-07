import * as board from "./board.js";

let blockRegistered;

window.addEventListener("keypress", (event => {
    switch (event.key){
        case 'a':
            board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
            blockRegistered.move_left();
            break;
        case "d":
            board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
            blockRegistered.move_right();
            break;
        case 's':
            blockRegistered.increase_speed();
            break;
        case 'w':
            console.log("change position");
            break;
    }
}));

export function register_block(block){
    blockRegistered = block;
}

export function move_i_block(i_block) {

    let anim = setInterval(move, i_block.speed);

    function move() {
        if (i_block.landed()){
            clearInterval(anim);
        }
        else{
            board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
            i_block.move_down_one_row();
        }
    }
}