import sprintf from "sprintf-js"
import {Color} from "./Color";

export class SimpleTable extends Map<String, String> {

    private _longestWord = 0;

    putStr(key, value) {
        super.set(key, value);
        if (key.length > this._longestWord)
            this._longestWord = key.length;
        return this;
    }

    toStr() {
        let str = '';
        this.forEach((k, v) => str += sprintf.sprintf(`${Color.WHITE_BOLD}%-${this._longestWord}s${Color.RESET}  %s\n`, v, k));
        return str;
    }
}