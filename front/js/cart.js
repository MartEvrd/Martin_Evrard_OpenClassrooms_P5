import { recupPanier, createDom, setAttributes, getProductDetails } from "./functions.js";

// TODO
/* Si modification de la quantité, mettre le total à jour
* Fonctionnalité de suppression
* Analyse des input pour validation du contenu/format
* Indiquer message d'erreur en cas de problème de saisie
* Ne pas stocker les prix des articles en local
*/


let panier = recupPanier();

console.log(panier);

const panierList = document.getElementById("cart__items");

await generateCart(panier);    

// EventListener Input quantités
document.querySelectorAll(".itemQuantity").forEach(inputQuantite => {
    inputQuantite.addEventListener("change", async function() {
        const parentArticle = inputQuantite.closest(".cart__item");
        const idProduit = parentArticle.dataset.id;
        const colorProduit = parentArticle.dataset.color;
        let quantiteProduit = parseInt(inputQuantite.value);

        if(quantiteProduit > 100) {
            alert("La quantité ne peut pas être supérieure à 100")
            inputQuantite.value = 100;
            quantiteProduit = 100
        } else if (quantiteProduit < 1){
            alert("La quantité ne peut pas être inférieure à 1")
            inputQuantite.value = 1;
            quantiteProduit = 1;
        }

        for (let i = 0; i < panier.length; i++){
            if (panier[i].id == idProduit && panier[i].couleur == colorProduit) {
                panier[i].quantite = quantiteProduit;
            }
        }
        window.localStorage.setItem('panier', JSON.stringify(panier));
        majTotalPanier(panier);
    })
})

// EventListener Bouton Suppression
document.querySelectorAll(".deleteItem").forEach(btnSuppr => {
    btnSuppr.addEventListener("click", async function() {
        const parentArticle = btnSuppr.closest(".cart__item");
        const idProduit = parentArticle.dataset.id;
        const colorProduit = parentArticle.dataset.color;

        console.log(idProduit + " " + colorProduit);
        console.log(panier);
        for (let i = 0; i < panier.length; i++){
            if (panier[i].id == idProduit && panier[i].couleur == colorProduit) {
                panier.splice(i,1);
            }
        }
        window.localStorage.setItem('panier', JSON.stringify(panier));

        parentArticle.remove();

        if (panier.length === 0) {
            const emptyCart = createDom("p", "Vous n'avez pour le moment aucun article dans votre panier", {}, panierList);
        }
        majTotalPanier(panier);
    })
})

// ---------------------
/**
 * -> Fonction d'affichage du panier sur la base des éléments ajoutés/supprimés/modifiés dans le localStorage
 * @param {Array} panier Tableau regroupant les produits ajoutés au panier (récupéré via le LocalStorage) 
 */
async function generateCart(panier) {
    if (panier.length === 0) {
        const emptyCart = createDom("p", "Vous n'avez pour le moment aucun article dans votre panier", {}, panierList);
    } else {
        for (let i = 0; i < panier.length; i++) {
            const idProduit = panier[i].id;
            const couleur = panier[i].couleur;
            const quantite = panier[i].quantite;
    
            const canape = await getProductDetails(idProduit);
    
            // Intégration d'un nouveau produit
            const itemBlock = createDom("Article", "", {class: "cart__item", "data-id": idProduit, "data-color": couleur}, panierList);

            // Intégration image produit (div + img)
            const imgBlock = createDom("div", "", {class: "cart__item__img"}, itemBlock);
            const imgProduit = createDom("img", "", {src: canape.imageUrl, alt: "Photographie d'un canape"}, imgBlock);
    
            // Intégration des détails du produit
            const contentDiv = createDom("div", "", {class: "cart__item__content"},itemBlock);
    
            // Description du produit choisi
            const descriptionDiv = createDom("div", "", {class: "cart__item__content__description"},contentDiv);
    
            const nomProduit = createDom("h2", canape.name, {}, descriptionDiv);
            const couleurProduit = createDom("p", couleur, {}, descriptionDiv);
            const prixProduit = createDom("p", canape.price + " €", {}, descriptionDiv);
    
            // Quantité et suppression du produit
            const settingsDiv = createDom("div", "", {class: "cart__item__content__settings"},contentDiv);
            const quantiteDiv = createDom("div", "", {class: "cart__item__content__settings__quantity"},settingsDiv);
            
            // Quantité
            const quantiteTxt = createDom("p", "Qté : ", {}, quantiteDiv);
            const quantiteInput = createDom(
                "input",
                "",
                {type: "number", class: "itemQuantity", min: 1, max: 100, value: quantite},
                quantiteDiv);
    
            // Suppression
            const suppressionDiv = createDom("div", "", {class: "cart__item__content__settings__delete"}, settingsDiv);
            const supprBtn = createDom("p", "Supprimer", {class: "deleteItem"}, suppressionDiv);
        }
    }
    majTotalPanier(panier);
}

/**
 * -> Fonction de mise à jour du nombre total d'article et du coût total du panier
 * @param {Array} panier
 */
async function majTotalPanier(panier) {
    const totalQuantite = document.getElementById("totalQuantity");
    const totalPrix = document.getElementById("totalPrice");
    let totalArticles = 0;
    let sommePanier = 0;

    for (let i = 0; i < panier.length; i++) {
        const canape = await getProductDetails(panier[i].id);
        totalArticles += panier[i].quantite;
        sommePanier += (canape.price * panier[i].quantite);
    }

    totalQuantite.innerText = totalArticles;
    totalPrix.innerText = sommePanier;
}