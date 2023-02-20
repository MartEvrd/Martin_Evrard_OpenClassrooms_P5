// TODO - REVOIR stockage dans le localStorage 

// Appel de la liste des produits stockés en local
// window.localStorage.clear();
// let canapes = window.localStorage.getItem('canapes');
// // console.log(canapes);
// if (canapes === null){
//     /* Si les produits ne sont pas en local :
//     * 1/ on les récupère de l'API pour les stocker dans la variable canapes
//     * 2/ On les transmet en local sous la clé "canapés"
//     */    
//     const reponse = await fetch("http://localhost:3000/api/products");
//     canapes = await reponse.json();
    
//     window.localStorage.setItem("canapes", reponse);
// }else{
//     console.log(canapes);
//     canapes = JSON.parse(canapes);
// }
const reponse = await fetch("http://localhost:3000/api/products");
const canapes = await reponse.json();

console.log(canapes);

function genererProduits(canapes) {
    for (let i = 0; i < canapes.length; i++) {
        const produit = canapes[i];
        // Récupération de l'élément DOM qui accueillera les fiches produit
        const sectionItems = document.querySelector(".items");        
        
        // Création du lien du produit
        const lienProduit = document.createElement("a");
        lienProduit.href = "./product.html?id=" + produit._id;

        // Création d'une balise dédiée à un produit
        const produitArticle = document.createElement("article");
        produitArticle.dataset.id = i;

        // Image du produit
        const imageProduit = document.createElement("img");
        imageProduit.src = produit.imageUrl;
        imageProduit.alt = produit.altTxt;

        // Nom du produit
        const nomProduit = document.createElement("h3");
        nomProduit.className = "productName";
        nomProduit.innerText = produit.name;
        
        // Description du produit
        const descriptionProduit = document.createElement("p");
        descriptionProduit.className = "productDescription";
        descriptionProduit.innerText = produit.description;

        sectionItems.appendChild(lienProduit);
        lienProduit.appendChild(produitArticle);
        produitArticle.appendChild(imageProduit);
        produitArticle.appendChild(nomProduit);
        produitArticle.appendChild(descriptionProduit);
    }
}
genererProduits(canapes);

