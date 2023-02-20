const urlPage = new URL(window.location.href);
const idProduit = urlPage.searchParams.get("id");

const reponseProduit = await fetch("http://localhost:3000/api/products/"+idProduit);
const canape = await reponseProduit.json();

console.log(canape);
// --- Gestion Image ---
// Récupération de la Div qui contient l'image du produit
const imgDiv = document.querySelector(".item__img");
// Mise en place de l'image produit
const imgCanape = document.createElement("img");
imgCanape.src = canape.imageUrl;
imgCanape.alt = canape.altTxt;

imgDiv.appendChild(imgCanape);

// --- Gestion Titre ---
const nomProduit = canape.name;
document.getElementById("title").textContent = nomProduit;

// --- Gestion Prix ---
const prixProduit = canape.price;
document.getElementById("price").textContent = prixProduit;

// --- Gestion Description ---
const descriptionProduit = canape.description;
document.getElementById("description").textContent = descriptionProduit;

// Ajout des options de couleurs
const optionsCouleurs = document.getElementById("colors");
const couleursProduit = canape.colors;
console.log(couleursProduit);

for (let i = 0; i < couleursProduit.length; i++) {
    let newColor = new Option(couleursProduit[i], couleursProduit[i]);
    optionsCouleurs.add(newColor);
}

