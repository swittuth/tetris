import * as board from "./board.js";

let blockRegistered;

window.addEventListener("keypress", (event => {

    if (!blockRegistered.is_landed()){
        switch (event.key){
            case 'a':
                board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
                blockRegistered.move_left();   
                break;
            case "d":
                //if (!blockRegistered.is_right_border()){
                board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
                blockRegistered.move_right();
                break;
            case 's':
                // actually add pixel to the y position of the board
                board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
                blockRegistered.increase_speed();
                break;
            case 'w':
                board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
                blockRegistered.rotate();
                break;
        }
    }
}));

export function register_block(block){
    blockRegistered = block;
}

export function move_i_block(i_block) {

    let anim = setInterval(move, i_block.speed);

    function move() {
        if (i_block.is_landed()){
            clearInterval(anim);
        }
        else{
            board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
            i_block.move_down_one_row();
        }
    }
}