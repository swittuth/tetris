import * as action from "./interaction.js";
import * as blocks from "./blocks.js";

const i_block = new blocks.I_Block();
i_block.render_on_screen();
action.register_block(i_block);
action.move_i_block(i_block);