import * as board from "./board.js";

let blockRegistered;

window.addEventListener("keypress", (event => {
    if (!blockRegistered.is_fully_landed()){
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

export function move_block() {

    let anim = setInterval(move, blockRegistered.speed);

    function move() {
        if (blockRegistered.is_landed()){
            clearInterval(anim);
        }
        else{
            board.gameCtx.clearRect(0, 0, board.gameConsole.width, board.gameConsole.height);
            blockRegistered.move_down_one_row();
        }
    }
}