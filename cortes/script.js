const imgs = document.querySelectorAll("#img img");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let idx = 0;

function showImage() {
    const container = document.getElementById("img");
    container.style.transform = `translateX(${-idx * 300}px)`;
}

function nextImage() {
    idx++;

    if (idx > imgs.length - 1) {
        idx = 0;
    }

    showImage();
}

function prevImage() {
    idx--;

    if (idx < 0) {
        idx = imgs.length - 1;
    }

    showImage();
}

// Adicionando os eventos de clique aos botões de navegação
nextButton.addEventListener('click', nextImage);
prevButton.addEventListener('click', prevImage);

