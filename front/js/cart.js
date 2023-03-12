import { recupPanier, createDom, setAttributes, getProductDetails, integerChange, letterChange } from "./functions.js";

let panier = recupPanier();

const panierList = document.getElementById("cart__items");
const orderBtn = document.getElementById("order");
class newContact {
    constructor(firstName, lastName, address, city, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}

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
    inputQuantite.addEventListener("keydown", integerChange);
})

// EventListener Bouton Suppression
document.querySelectorAll(".deleteItem").forEach(btnSuppr => {
    btnSuppr.addEventListener("click", async function() {
        const parentArticle = btnSuppr.closest(".cart__item");
        const idProduit = parentArticle.dataset.id;
        const colorProduit = parentArticle.dataset.color;

        for (let i = 0; i < panier.length; i++){
            if (panier[i].id == idProduit && panier[i].couleur == colorProduit) {
                panier.splice(i,1);
            }
        }
        window.localStorage.setItem('panier', JSON.stringify(panier));

        parentArticle.remove();

        if (panier.length === 0) {
            orderBtn.style.visibility = "hidden";
            const emptyCart = createDom("p", "Vous n'avez pour le moment aucun article dans votre panier.", {}, panierList);
        }
        majTotalPanier(panier);
    })
})

// EventListener Validation Commande
const formContact = document.querySelector(".cart__order__form");
formContact.addEventListener("submit", validateForm)

// -------  FONCTIONS LOCALES  --------------
/**
 * -> Fonction d'affichage du panier sur la base des éléments ajoutés/supprimés/modifiés dans le localStorage
 * @param {Array} panier Tableau regroupant les produits ajoutés au panier (récupéré via le LocalStorage) 
 */
async function generateCart(panier) {
    if (panier.length === 0) {
        orderBtn.style.visibility = "hidden";
        const emptyCart = createDom("p", "Vous n'avez pour le moment aucun article dans votre panier.", {}, panierList);
    } else {
        orderBtn.style.visibility = "visible";
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
                {type: "number", class: "itemQuantity", min: 1, max: 100, value: quantite, pattern: "\d"},
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

/**
 * -> Fonction de gestion de validation des saisies du formulaire de commande
 * @param {event} event Event récupère l'événement de click sur le bouton d'envoi du formulaire
 */
async function validateForm(event) {
    event.preventDefault();
    let flagValid = [];
    // Définition des RegEx des champs de saisie
    const lettersOnly = {
        pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ- \']+$/,
        errMsg: "Vous ne pouvez saisir que des lettres, des tirets, des apostrophes ou des espaces"
    };
    const addressOnly = {
        pattern: /\d{0,} ?[\dA-Za-zÀ-ÖØ-öø-ÿ- \']+$/,
        errMsg: "Veuillez entrer une adresse valide"
    }
    const zipCityOnly = {
        pattern: /^[0-9]{5} [A-Za-zÀ-ÖØ-öø-ÿ- ]+$/,
        errMsg: "La ville doit être saisie selon le format suivant : 75000 PARIS"
    }  
    const mailOnly = {
        pattern: /^[\w][\w-_\.]+@[\w]+\.[a-z]{2,8}\.?[a-z]{0,8}$/,
        errMsg: "Le mail doit être saisi selon le format suivant : monsieur.dupont1@gmail.com"
    }

    flagValid.push(validInput("firstName", lettersOnly));
    flagValid.push(validInput("lastName", lettersOnly));
    flagValid.push(validInput("address", addressOnly));
    flagValid.push(validInput("city", zipCityOnly));
    flagValid.push(validInput("email", mailOnly));

    if (!flagValid.includes(false)) {
        await getOrderParams();
    }
}

/**
 * -> Fonction de test de conformité sur les champs d'input, en fonction d'une Regex communiquée
 * @param {string} inputName Transmettre le nom de l'ID HTML utilisé pour identifier l'input et récupérer sa valeur ainsi que son message d'erreur
 * @param {pattern} inputRex Transmettre la RegEx à appliquer au contrôle (sous format de pattern) 
 * @returns {bool} flag : True si l'input est conforme / False s'il ne l'est pas
 */
function validInput(inputName, inputRex) {
    const input = document.getElementById(inputName);
    const saisieVal = input.value;
    const saisieErr = document.getElementById(inputName + "ErrorMsg");
    let flag = true;
    saisieErr.innerText="";

    if (!input.checkValidity()) {
        saisieErr.innerText="Veuillez renseigner ce champ.";
        return flag = false;
    } else if (inputRex["pattern"].test(saisieVal) == false) {
        saisieErr.innerText=inputRex["errMsg"];
        return flag = false;
    } else {
        return flag;
    }
}

/**
 * -> Fonction de récupération des informations du client pour création de l'objet à transmettre à l'API
 */
async function getOrderParams(){
    const formContact = document.querySelector(".cart__order__form");
    const formData = new FormData(formContact);

    const contact = new newContact(
        formData.get("firstName"), 
        formData.get("lastName"), 
        formData.get("address"), 
        formData.get("city"), 
        formData.get("email")
    );
    const products = toOrderCart(panier);
    const orderRequest = {
        "contact": contact,
        "products": products
    }

    let response = await fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequest)
    });
    
    let result = await response.json();
    const orderId = result.orderId;
    window.open("./confirmation.html?id="+orderId, "_self");
}

/**
 * -> Fonction de création d'un Array contenant les ID des produits du panier
 * @param {Object} panier Panier disponible sous le localStorage.
 * @returns {array} Retourne le Array newCart, contenant le nouveau panier
 */
function toOrderCart (panier) {
    let newCart = [];
    for (let i = 0; i < panier.length; i++) {
        if (!newCart.includes(panier[i].id)) {
            newCart.push(panier[i].id);
        }
    }
    return newCart
}