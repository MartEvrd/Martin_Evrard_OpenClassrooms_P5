
// TODO
/* Si modification de la quantité, mettre le total à jour
* Fonctionnalité de suppression
* Analyse des input pour validation du contenu/format
* Indiquer message d'erreur en cas de problème de saisie
* Ne pas stocker les prix des articles en local
*/


// ! A REVOIR - L'import/export de la fonction recupPanier ne fonctionne pas
// import {recupPanier} from "./product.js";
// let panier = recupPanier();
// console.log(panier);

function recupPanier() {
    let panier = window.localStorage.getItem('panier');

    if (panier === null) {
        return [];
    } else{
        return JSON.parse(panier);
    }
}
let panier = recupPanier();
console.log(panier);
let totalArticles = 0;
let sommePanier = 0;
majTotalPanier(totalArticles, sommePanier);

const panierList = document.getElementById("cart__items");

if (panier.length === 0) {
    const emptyCart = document.createElement("p");
    emptyCart.innerText = "Vous n'avez pour le moment aucun article dans votre panier";
    panierList.appendChild(emptyCart);
} else {
    for (let i = 0; i < panier.length; i++) {
        const idProduit = panier[i].id;
        const couleur = panier[i].couleur;
        const quantite = panier[i].quantite;

        const reponseProduit = await fetch("http://localhost:3000/api/products/"+idProduit);
        const canape = await reponseProduit.json();

        // Intégration d'un nouvel article
        const itemBlock = document.createElement("Article");
        itemBlock.className="cart__item";
        itemBlock.dataset.id=idProduit;
        itemBlock.dataset.color = couleur;

        panierList.appendChild(itemBlock);

        // Intégration image produit
        const imgBlock = document.createElement("div");
        imgBlock.classList="cart__item__img";
        const imgProduit = document.createElement("img");
        setAttributes(imgProduit, {src: canape.imageUrl, alt: "Photographie d'un canape"});
        // imgProduit.src = canape.imageUrl;
        // imgProduit.alt = "Photographie d'un canape";
        
        itemBlock.appendChild(imgBlock);
        imgBlock.appendChild(imgProduit);

        // Intégration des détails du produit
        const contentDiv = document.createElement("div");
        contentDiv.className="cart__item__content";

        itemBlock.appendChild(contentDiv);

        // Description du produit choisi
        const descriptionDiv = document.createElement("div");
        descriptionDiv.className="cart__item__content__description";

        const nomProduit = document.createElement("h2");
        nomProduit.innerText = canape.name;

        const couleurProduit = document.createElement("p");
        couleurProduit.innerText = couleur;

        const prixProduit = document.createElement("p");
        prixProduit.innerText = canape.price + " €";

        contentDiv.appendChild(descriptionDiv);
        descriptionDiv.append(nomProduit, couleurProduit, prixProduit);

        // Quantité et suppression du produit
        const settingsDiv = document.createElement("div");
        settingsDiv.className = "cart__item__content__settings"

        contentDiv.appendChild(settingsDiv);

        const quantiteDiv = document.createElement("div");
        quantiteDiv.className = "cart__item__content__settings__quantity"

        settingsDiv.appendChild(quantiteDiv);
        
        // Quantité
        const quantiteTxt = document.createElement("p");
        quantiteTxt.innerText = "Qté : ";
        const quantiteInput = document.createElement("input");
        setAttributes(quantiteInput, {type: "number", class: "itemQuantity", min: 1, max: 100, value: quantite})
        // quantiteInput.type = "Number";
        // quantiteInput.className = "itemQuantity";
        // quantiteInput.min = 1;
        // quantiteInput.max = 100;
        // quantiteInput.value = quantite;


        quantiteDiv.appendChild(quantiteTxt);
        quantiteDiv.appendChild(quantiteInput);

        // Suppression
        const suppressionDiv = document.createElement("div");
        suppressionDiv.className = "cart__item__content__settings__delete"
        
        settingsDiv.appendChild(suppressionDiv);

        const supprimer = document.createElement("p");
        supprimer.innerText = "Supprimer";

        suppressionDiv.appendChild(supprimer);

        totalArticles += quantite;
        sommePanier += (canape.price * quantite);
    }    
}
majTotalPanier(totalArticles, sommePanier);

document.querySelectorAll(".itemQuantity").forEach(el => {
    el.addEventListener("change", function() {
        const parentArticle = document.querySelector("article").closest(".cart__item");
        const idProduit = parentArticle.dataset.id;
        const colorProduit = parentArticle.dataset.color;

        console.log(idProduit);

        if(nbrProduits.value > 100) {
            alert("La quantité ne peut pas être supérieure à 100")
            nbrProduits.value = 100;
        } else if (nbrProduits.value < 1){
            alert("La quantité ne peut pas être inférieure à 1")
            nbrProduits.value = 1;
        }
    })
})
// 
/**
 * Fonction de mise à jour du nombre d'article et du coût total du panier
 * @param {Integer} totalArticles
 * @param {Integer} sommePanier
 */
function majTotalPanier(totalArticles, sommePanier) {
    const totalQuantite = document.getElementById("totalQuantity");
    const totalPrix = document.getElementById("totalPrice");
    totalQuantite.innerText = totalArticles;
    totalPrix.innerText = sommePanier;
}

function setAttributes(element, attributes) {
    for(var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
}







// ! A RETRAVAILLER -- FONCTION DE GENERATION DU DOM
/**
 * This function will create a new Node element, give its attributes and integrate it according to a previous DOM element.
 * @param {string} tag
 * @param {Array} attributes
 * @param {string} prevTag
 */
function createDom (tag, attributes, prevTag) {

}

async function cartItemsAdd (idProduit, couleur, quantite) {
    
    const reponseProduit = await fetch("http://localhost:3000/api/products/"+idProduit);
    const canape = await reponseProduit.json();

    // Intégration d'un nouvel article
    const itemBlock = document.createElement("Article");
    itemBlock.className="cart__item";
    itemBlock.dataset.id=idProduit;
    itemBlock.dataset.color = couleur;

    panierList.appendChild(itemBlock);

    // Intégration image produit
    const imgBlock = document.createElement("div");
    imgBlock.classList="cart__item__img";
    const imgProduit = document.createElement("img");
    // setAttributes(imgProduit, {src: canape.imageUrl, alt: "Photographie d'un canape"});
    imgProduit.src = canape.imageUrl;
    imgProduit.alt = "Photographie d'un canape";
    
    itemBlock.appendChild(imgBlock);
    imgBlock.appendChild(imgProduit);

    // Intégration des détails du produit
    const contentDiv = document.createElement("div");
    contentDiv.className="cart__item__content";

    itemBlock.appendChild(contentDiv);

    // Description du produit choisi
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className="cart__item__content__description";

    const nomProduit = document.createElement("h2");
    nomProduit.innerText = canape.name;

    const couleurProduit = document.createElement("p");
    couleurProduit.innerText = couleur;

    const prixProduit = document.createElement("p");
    prixProduit.innerText = canape.price + " €";

    contentDiv.appendChild(descriptionDiv);
    descriptionDiv.append(nomProduit, couleurProduit, prixProduit);

    // Quantité et suppression du produit
    const settingsDiv = document.createElement("div");
    settingsDiv.className = "cart__item__content__settings"

    contentDiv.appendChild(settingsDiv);

    const quantiteDiv = document.createElement("div");
    quantiteDiv.className = "cart__item__content__settings__quantity"

    settingsDiv.appendChild(quantiteDiv);
    
    // Quantité
    const quantiteTxt = document.createElement("p");
    quantiteTxt.innerText = "Qté : ";
    const quantiteInput = document.createElement("input");
    // setAttributes(quantiteInput, {type: "number", className: "itemQuantity", min: 1, max: 100, value: quantite})
    quantiteInput.type = "Number";
    quantiteInput.className = "itemQuantity";
    quantiteInput.min = 1;
    quantiteInput.max = 100;
    quantiteInput.value = quantite;


    quantiteDiv.appendChild(quantiteTxt);
    quantiteDiv.appendChild(quantiteInput);

    // Suppression
    const suppressionDiv = document.createElement("div");
    suppressionDiv.className = "cart__item__content__settings__delete"
    
    settingsDiv.appendChild(suppressionDiv);

    const supprimer = document.createElement("p");
    supprimer.innerText = "Supprimer";

    suppressionDiv.appendChild(supprimer);
}