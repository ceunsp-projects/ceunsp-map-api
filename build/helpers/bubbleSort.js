"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bubbleSort(items) {
    let changed = true;
    do {
        changed = false;
        for (let j = 0; j < items.length; j++) {
            if (items[j] > items[j + 1]) {
                const temp = items[j];
                items[j] = items[j + 1];
                items[j + 1] = temp;
                changed = true;
            }
        }
    } while (changed);
    return items;
}
exports.default = bubbleSort;
