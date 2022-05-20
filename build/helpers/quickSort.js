"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function quickSort(items) {
    function swap(items, leftIndex, rightIndex) {
        const temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    }
    function partition(items, left, right) {
        const pivot = items[Math.floor((right + left) / 2)];
        let i = left;
        let j = right;
        while (i <= j) {
            while (items[i] < pivot) {
                i++;
            }
            while (items[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }
    function sort(items, left, right) {
        let index;
        if (items.length > 1) {
            index = partition(items, left, right);
            if (left < index - 1) {
                sort(items, left, index - 1);
            }
            if (index < right) {
                sort(items, index, right);
            }
        }
        return items;
    }
    return sort(items, 0, items.length - 1);
}
exports.default = quickSort;
