import {Color} from "./Color";

export class TableGenerator {

    private PADDING_SIZE: number = 2;
    private TABLE_JOINT_SYMBOL: string = "+";
    private TABLE_V_SPLIT_SYMBOL: string = "|";
    private TABLE_H_SPLIT_SYMBOL: string = "-";

    public generateTable(headerList: string[], rowList: Array<Array<string>>, overRiddenHeader: number[] = []) {
        let strBuilder: string = "";
        const rowheight = overRiddenHeader.length > 0 ? overRiddenHeader[0] : 1;
        const columMaxWidthMapping = this.getMaximumWidthOfTable(headerList, rowList);

        strBuilder += '\n';
        strBuilder = this.createRowLine(strBuilder, headerList.length, columMaxWidthMapping);
        strBuilder += '\n';

        for (let headerIndex = 0; headerIndex < headerList.length; headerIndex++)
            strBuilder = this.fillCell(strBuilder, headerList[headerIndex], headerIndex, columMaxWidthMapping);

        strBuilder += '\n';
        strBuilder = this.createRowLine(strBuilder, headerList.length, columMaxWidthMapping);

        rowList.forEach(row => {
            for (let i = 0; i < rowheight; i++)
                strBuilder += '\n';
            for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
                strBuilder = this.fillCell(strBuilder, row[cellIndex], cellIndex, columMaxWidthMapping);
            }
        });

        strBuilder += '\n';
        strBuilder = this.createRowLine(strBuilder, headerList.length, columMaxWidthMapping);
        strBuilder += '\n';

        return strBuilder;
    }

    private getMaximumWidthOfTable(headerList: string[], rowList: Array<Array<string>>) {
        const columnMaxWidthMapping: Map<number, number> = new Map();

        for (let columnIndex = 0; columnIndex < headerList.length; columnIndex++) {
            columnMaxWidthMapping.set(columnIndex, 0);
        }

        for (let columnIndex = 0; columnIndex < headerList.length; columnIndex++) {
            const len = Color.extracter(headerList[columnIndex]).length;
            if (len > columnMaxWidthMapping[columnIndex])
                columnMaxWidthMapping.set(columnIndex, len);
        }

        rowList.forEach(row => {
            for (let columIndex = 0; columIndex < row.length; columIndex++) {
                const len = Color.extracter(row[columIndex]).length;
                if (len > columnMaxWidthMapping.get(columIndex)) {
                    columnMaxWidthMapping.set(columIndex, len);
                }
            }
        });

        for (let columIndex = 0; columIndex < headerList.length; columIndex++) {
            if (columnMaxWidthMapping.get(columIndex) % 2 != 0)
                columnMaxWidthMapping.set(columIndex, columnMaxWidthMapping.get(columIndex) + 1);
        }
        return columnMaxWidthMapping;
    }

    private fillSpace(str: string, len: number) {
        for (let i = 0; i < len; i++)
            str += ' ';
        return str;
    }

    private createRowLine(str: string, headerLen: number, columMaxWidthMapping: Map<number, number>) {
        for (let i = 0; i < headerLen; i++) {
            if (i == 0)
                str += this.TABLE_JOINT_SYMBOL;
            for (let j = 0; j < columMaxWidthMapping.get(i) + this.PADDING_SIZE * 2; j++)
                str += this.TABLE_H_SPLIT_SYMBOL;
            str += this.TABLE_JOINT_SYMBOL;
        }
        return str;
    }

    private fillCell(str: string, cell: string, cellIndex: number,
                     columMaxWidthMapping: Map<number, number>) {
        const cellLen = Color.extracter(cell).length;
        const cellPaddingSize = this.getOptimumCellPadding(cellIndex, cellLen, columMaxWidthMapping, this.PADDING_SIZE);

        if (cellIndex == 0)
            str += this.TABLE_V_SPLIT_SYMBOL;

        str = this.fillSpace(str, cellPaddingSize);
        str += cell;

        if (cellLen % 2 != 0)
            str += ' ';

        str = this.fillSpace(str, cellPaddingSize);
        str += this.TABLE_V_SPLIT_SYMBOL;
        return str;
    }

    private getOptimumCellPadding(cellIndex: number, dataLength: number, columMaxWidthMapping: Map<number, number>, cellPaddingSize: number) {
        if (dataLength % 2 != 0)
            dataLength++;
        if (dataLength < columMaxWidthMapping.get(cellIndex))
            cellPaddingSize = cellPaddingSize + (columMaxWidthMapping.get(cellIndex) - dataLength) / 2;
        return cellPaddingSize;
    }
}