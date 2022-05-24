const selectionSort = (array: any, callback: (item: any) => void) => {
  for (let i = 0; i < array.length - 1; i++) {
    let min = i;

    for (let j = i + 1; j < array.length; j++) {
        if(callback(array[j]) < callback(array[min])) {
          min = j
        }
    }

    [array[i], array[min]] = [array[min], array[i]];
  }

  return array;
}

export default selectionSort;
