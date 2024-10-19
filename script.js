const arrayContainer = document.getElementById('array-container');
let array = [];
let showLabels = false;
let speed = 50;

function generateArray() {
    const arraySize = document.getElementById('array-size').value || 50;
    arrayContainer.innerHTML = '';
    array = [];
    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        array.push(value);
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`;
        bar.style.width = `${Math.min(600 / arraySize, 20)}px`; // Adjust bar width based on array size

        if (showLabels) {
            const label = document.createElement('div');
            label.classList.add('bar-label');
            label.innerText = value;
            bar.appendChild(label);
        }

        arrayContainer.appendChild(bar);
    }
}

function toggleLabels() {
    showLabels = !showLabels;
    generateArray();
}

function updateSpeed() {
    speed = document.getElementById('speed-range').value;
}

async function startSorting() {
    const algorithm = document.getElementById('algorithm-select').value;
    switch (algorithm) {
        case 'selectionSort':
            await selectionSort();
            break;
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'insertionSort':
            await insertionSort();
            break;
        case 'mergeSort':
            await mergeSort();
            break;
        case 'quickSort':
            await quickSort();
            break;
    }
}

// Selection Sort
async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            await swap(i, minIndex);
            await pause(100 - speed); // Adjust speed
        }
    }
}

// Bubble Sort
async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
                await pause(100 - speed); // Adjust speed
            }
        }
    }
}

// Insertion Sort
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            const bars = document.getElementsByClassName('bar');
            bars[j + 1].style.height = `${array[j]}px`;
            if (showLabels) bars[j + 1].innerText = array[j];
            j--;
            await pause(100 - speed); // Adjust speed
        }
        array[j + 1] = key;
        const bars = document.getElementsByClassName('bar');
        bars[j + 1].style.height = `${key}px`;
        if (showLabels) bars[j + 1].innerText = key;
    }
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            array[k++] = leftArray[i++];
        } else {
            array[k++] = rightArray[j++];
        }
    }

    while (i < leftArray.length) {
        array[k++] = leftArray[i++];
    }

    while (j < rightArray.length) {
        array[k++] = rightArray[j++];
    }

    for (let idx = start; idx <= end; idx++) {
        const bars = document.getElementsByClassName('bar');
        bars[idx].style.height = `${array[idx]}px`;
        if (showLabels) bars[idx].innerText = array[idx];
        await pause(100 - speed); // Adjust speed
    }
}

// Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
    if (start >= end) return;
    let index = await partition(start, end);
    await Promise.all([
        quickSort(start, index - 1),
        quickSort(index + 1, end)
    ]);
}

async function partition(start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
            await swap(i, pivotIndex);
            pivotIndex++;
        }
    }
    await swap(pivotIndex, end);
    return pivotIndex;
}

async function swap(i, j) {
    const bars = document.getElementsByClassName('bar');
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    bars[i].style.height = `${array[i]}px`;
    bars[j].style.height = `${array[j]}px`;

    if (showLabels) {
        bars[i].innerText = array[i];
        bars[j].innerText = array[j];
    }
}

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listener to update speed
document.getElementById('speed-range').addEventListener('input', updateSpeed);

// Generate the initial array
generateArray
