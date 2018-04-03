import sprintf from "sprintf-js"

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
        this.forEach((k, v) => str += sprintf.sprintf(`%${this._longestWord}s: %s\n`, k, v));
        return str;
    }
}