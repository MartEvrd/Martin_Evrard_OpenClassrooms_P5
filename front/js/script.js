import { createDom } from "./functions.js";

const reponse = await fetch("http://localhost:3000/api/products");
const produits = await reponse.json();

/**
 * Affiche les produits de l'API sur la page d'accueil
 * @param {Array} canapes 
 */
function genererProduits(canapes) {
    for (let i = 0; i < canapes.length; i++) {
        const produit = canapes[i];
        // Récupération de l'élément DOM qui accueillera les fiches produit
        const sectionItems = document.querySelector(".items");        
        
        // Création du lien du produit
        const lienProduit = createDom("a", "", {href: "./product.html?id=" + produit._id}, sectionItems)
        
        // Création d'une balise dédiée à un produit
        const produitArticle = createDom("article", "", {"data-id": i}, lienProduit)

        // Image du produit
        const imageProduit = createDom("img", "", {src: produit.imageUrl, alt: produit.altTxt}, produitArticle)

        // Nom du produit
        const nomProduit = createDom("h3", produit.name, {class: "productName"}, produitArticle)
        
        // Description du produit
        const descriptionProduit = createDom("p", produit.description, {class: "productDescription"}, produitArticle)
    }
}
genererProduits(produits);