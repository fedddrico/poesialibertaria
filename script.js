const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2hqI5IIXftWDQPsw8Crdi8W6fH6lNhX8Nv34z1wM0veq90h6mgq2LHjFa3xNP61YYq5ds0LSx24X3/pub?output=csv'; // Reemplaza con tu URL CSV

let words = [];

async function fetchWords() {
    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        words = parseCSV(csvText);
        createWordButtons(getRandomWords(10)); // Cargar palabras iniciales
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

function parseCSV(csvText) {
    // Convertir CSV en un array de palabras
    const rows = csvText.trim().split('\n');
    return rows.flatMap(row => row.split(','));
}

function getRandomWords(num) {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function createWordButtons(words) {
    const container = document.getElementById('words-container');
    container.innerHTML = ''; // Limpiar contenido previo
    words.forEach(word => {
        const button = document.createElement('button');
        button.textContent = word;
        button.addEventListener('click', () => addWordToPoem(word));
        container.appendChild(button);
    });
}

function addWordToPoem(word) {
    const poemContainer = document.getElementById('poem-container');
    const words = Array.from(poemContainer.getElementsByClassName('poem-word'));
    if (words.length % 3 === 0) {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('poem-line');
        poemContainer.appendChild(lineDiv);
    }
    const span = document.createElement('span');
    span.textContent = `${word} `;
    span.classList.add('poem-word');
    poemContainer.lastChild.appendChild(span);
}

function publishPoem() {
    const poemContainer = document.getElementById('poem-container');
    const publishedPoemsContainer = document.getElementById('published-poems-container');
    const poemLines = Array.from(poemContainer.getElementsByClassName('poem-line')).map(div => {
        return Array.from(div.getElementsByClassName('poem-word')).map(span => span.textContent.trim());
    });
    if (poemLines.length > 0) {
        const poemDiv = document.createElement('div');
        poemLines.forEach(line => {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = line.join(' ');
            lineDiv.classList.add('poem-line');
            poemDiv.appendChild(lineDiv);
        });
        poemDiv.classList.add('published-poem');
        publishedPoemsContainer.appendChild(poemDiv);
        savePoem(poemLines);
        poemContainer.innerHTML = ''; // Limpiar el poema en construcción
    }
}

function savePoem(poemLines) {
    try {
        const poems = JSON.parse(localStorage.getItem('publishedPoems')) || [];
        poems.push(poemLines);
        localStorage.setItem('publishedPoems', JSON.stringify(poems));
    } catch (error) {
        console.error('Error saving poem:', error);
    }
}

function loadPublishedPoems() {
    try {
        const poems = JSON.parse(localStorage.getItem('publishedPoems'));
        console.log('Loaded poems:', poems); // Verifica el contenido aquí
        if (!Array.isArray(poems)) {
            console.error('Data in localStorage is not an array');
            return;
        }
        const publishedPoemsContainer = document.getElementById('published-poems-container');
        poems.forEach(poemLines => {
            if (!Array.isArray(poemLines)) {
                console.error('Poem lines are not an array');
                return;
            }
            const poemDiv = document.createElement('div');
            poemLines.forEach(line => {
                if (!Array.isArray(line)) {
                    console.error('Line is not an array');
                    return;
                }
                const lineDiv = document.createElement('div');
                lineDiv.textContent = line.join(' ');
                lineDiv.classList.add('poem-line');
                poemDiv.appendChild(lineDiv);
            });
            poemDiv.classList.add('published-poem');
            publishedPoemsContainer.appendChild(poemDiv);
        });
    } catch (error) {
        console.error('Error loading published poems:', error);
    }
}

document.getElementById('new-words-btn').addEventListener('click', () => {
    const randomWords = getRandomWords(10);
    createWordButtons(randomWords);
});

document.getElementById('publish-poem-btn').addEventListener('click', publishPoem);

// Inicializar con palabras desde CSV y cargar poemas publicados
fetchWords().then(() => {
    loadPublishedPoems();
});

function clearLocalStorage() {
    try {
        localStorage.removeItem('publishedPoems');
        document.getElementById('published-poems-container').innerHTML = ''; // Limpiar la vista
        console.log('Memoria local borrada.');
    } catch (error) {
        console.error('Error al borrar la memoria local:', error);
    }
}

document.getElementById('clear-storage-btn').addEventListener('click', clearLocalStorage);

const gif = document.getElementById('gif_pregunta');
const hoverText = document.getElementById('hover_text');

gif.addEventListener('mouseenter', () => {
  hoverText.style.display = 'block';
});

gif.addEventListener('mouseleave', () => {
  hoverText.style.display = 'none';
});

