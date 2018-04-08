import {Color} from "./Color";

export class TableGenerator {

    public static generateTable(headerList: string[], rowList: Array<Array<string>>) {
        let final = '';
        headerList = headerList.map(e => Color.WHITE_BOLD + e.toUpperCase() + Color.RESET);
        const maxLenght : Map<number, number> = TableGenerator.getMaxLength(headerList, rowList);

        final += TableGenerator.buildHeader(headerList, maxLenght);
        final += TableGenerator.buildRowlist(rowList, maxLenght);
        return final;
    }

    private static buildRowlist(rowList: Array<Array<string>>, maxLenght: Map<number, number>) : string {
        let rows = '';
        rowList.forEach((table, x) => {
            table.forEach((col, i) => {
                let diff = maxLenght.get(i) - Color.extracter(col).length;
                if (diff <= 0)
                    diff = 1;
                rows += col + Array(diff).join(' ');
            });
            if (x != rowList.length)
                rows += '\n';
        });
        return rows;
    }

    private static buildHeader(headerList: string[], maxLenght: Map<number, number>) : string {
        let header = '';
        headerList.forEach((str, i) => {
            let diff = maxLenght.get(i) - Color.extracter(str).length;
            if (diff <= 0)
                diff = 1;
            header += str + Array(diff).join(' ')
        });
        return header + '\n';
    }

    private static getMaxLength(headerList: string[], rowList: Array<Array<string>>) {
        const map : Map<number, number> = new Map();
        let len : number;
        for (let i = 0; i < headerList.length; i++) {
            map.set(i, 0);
            if ((len = Color.extracter(headerList[i]).length) > map.get(i))
                map.set(i, len + 10);
            rowList.forEach(x =>  {
                if ((len = Color.extracter(x[i]).length) > map.get(i))
                    map.set(i, len + 10);
            });
        }
        return map;
    }
}