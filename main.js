const casiers = document.querySelectorAll(".casier");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");

const modalName = document.getElementById("modal-name");
const modalSize = document.getElementById("modal-size");
const modalBrand = document.getElementById("modal-brand");
const modalPrice = document.getElementById("modal-price");

casiers.forEach(casier => {
    casier.addEventListener("click", () => {
        modalName.textContent = casier.dataset.name;
        modalSize.textContent = casier.dataset.size;
        modalBrand.textContent = casier.dataset.brand;
        modalPrice.textContent = casier.dataset.price;
        modal.style.display = "flex";
    });
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

document.querySelectorAll('.casier.vide').forEach(casier => {
    const input = casier.querySelector('input[type="file"]');
    casier.addEventListener('click', (e) => {
        if (casier.classList.contains('vide')) {
            input.click();
            e.stopPropagation();
        }
    });
    input.addEventListener('change', (e) => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                casier.innerHTML = `<img src="${evt.target.result}" alt="Photo ajoutée" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
                casier.classList.remove('vide');
            };
            reader.readAsDataURL(file);
        }
    });
});

document.querySelectorAll(".btn-detail").forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.stopPropagation();
        const params = new URLSearchParams({
            img: this.dataset.img,
            gallery: this.dataset.gallery,
            name: this.dataset.name,
            size: this.dataset.size,
            brand: this.dataset.brand,
            price: this.dataset.price
        });
        window.location.href = "detail.html?" + params.toString();
    });
});

const params = new URLSearchParams(window.location.search);
document.getElementById('maillot-img').src = params.get('img');
document.getElementById('maillot-name').textContent = params.get('name');
document.getElementById('maillot-size').textContent = params.get('size');
document.getElementById('maillot-brand').textContent = params.get('brand');
document.getElementById('maillot-price').textContent = params.get('price');

document.querySelector('.ajouter-panier').addEventListener('click', function() {
    // Récupère les infos du maillot
    const article = {
        img: document.getElementById('maillot-img').src,
        name: document.getElementById('maillot-name').textContent,
        taille: document.getElementById('taille-select').value,
        prenom: document.getElementById('prenom-maillot').value,
        prix: document.getElementById('maillot-price').textContent
    };

    // Récupère le panier existant ou crée un nouveau
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier.push(article);
    localStorage.setItem('panier', JSON.stringify(panier));

    // Affiche le message de confirmation
    document.getElementById('panier-message').style.display = 'block';
});