export default function bubbleSort(items: string[]) {
  let swapped = true;
	do {
		swapped = false;
		for (let j = 0; j < items.length; j++) {
			if (items[j] > items[j + 1]) {
				const temp = items[j];
				items[j] = items[j + 1];
				items[j + 1] = temp;
				swapped = true;
			}
		}
	} while (swapped);
	return items;
}
