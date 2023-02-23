// Récupération de l'URL de la page pour en extraire l'id du produit
const urlPage = new URL(window.location.href);
const idProduit = urlPage.searchParams.get("id");

// Récupération des informations du produit
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

// --- Affichage nom produit (Titre) ---
const nomProduit = canape.name;
document.getElementById("title").textContent = nomProduit;

// --- Affichage prix produit ---
const prixProduit = canape.price;
document.getElementById("price").textContent = prixProduit;

// --- Affchage description produit ---
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

// EventListener sur le champ de saisie de la quantité de canapés pour restreindre la quantité entre 1 et 100
const nbrProduits = document.getElementById("quantity");
nbrProduits.addEventListener("change", function() {
    if(nbrProduits.value > 100) {
        alert("La quantité ne peut pas être supérieure à 100")
        nbrProduits.value = 100;
    } else if (nbrProduits.value < 1){
        alert("La quantité ne peut pas être inférieure à 1")
        nbrProduits.value = 1;
    }
})

// TODO
/* 
* // OK Tester si une couleur a bien été choisie
* // OKTester si la quantité est différente de 0
* // OK Tester si panier existant ou non dans le localStorage
* // OK Rajouter la quantité si produit déjà présent
* -> filter pour vérifier si concordance ID + couleur OU test de chaque objet déjà présent
* // ! A VOIR --> ATTENTION : nbr de produits limité à 100
*/

class newOrder {
    constructor(id, couleur, quantite) {
        this.id = id;
        this.couleur = couleur;
        this.quantite = quantite;
    }
}
const boutonAjout = document.getElementById("addToCart");
/**
 * Remplissage du panier au clic sur le bouton d'Ajout
 * @param {string} idProduit
 * @param {Array} tabCart 
 */
boutonAjout.addEventListener("click", function() {
    const idProduit = urlPage.searchParams.get("id");
    const couleur = document.getElementById("colors").value;
    const quantite = parseInt(document.getElementById("quantity").value);

    if (couleur != "" && quantite >0) {
        let panier = recupPanier();
        console.log(panier);
        let choixProduit = new newOrder(idProduit, couleur, quantite);
        let existant = false;
        
        // TODO -- A voir pour optimiser la condition sans flag 'existant'        
        for (let i = 0; i < panier.length; i++) {
            if (panier[i].id == idProduit && panier[i].couleur == couleur) {
                panier[i].quantite += quantite;

                // ! A VOIR SI NECESSAIRE 
                if (panier[i].quantite > 100) {
                    panier[i].quantite = 100;
                    alert("Il n'est pas possible de commander plus de 100 produits identiques.")
                }
                existant = true;
            }
        }
        if (existant == false) {
            panier.push(choixProduit);
        }
        console.log(panier);
    
        window.localStorage.setItem('panier', JSON.stringify(panier));
    } else if(couleur==""){
        alert("Veuillez sélectionner une couleur");
    } else{
        alert("La quantité doit être différente de 0");
    };
})

export function recupPanier() {
    let panier = window.localStorage.getItem('panier');

    if (panier === null) {
        return [];
    } else{
        return JSON.parse(panier);
    }
}

// créer fonction de récup du panier pour exporter sur la page panier (utilisé plusieurs fois)

// Passage commande : faire un objet des informations saisies
// Numéro commande passé via l'URL