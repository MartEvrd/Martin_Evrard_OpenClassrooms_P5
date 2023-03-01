/**
 * -> Fonction de récupération du panier dans le local storage (retourne un objet vide si inexistant)
 * @returns le panier sous forme d'objet
 */
export function recupPanier() {
    let panier = window.localStorage.getItem('panier');

    if (panier === null) {
        return [];
    } else{
        return JSON.parse(panier);
    }
}

/**
 * -> Fonction de création d'un nouveau noeud dans le DOM
 * @param {string} tag Balise HTML
 * @param {string} text Texte éventuel à afficher dans la balise ("" si vide)
 * @param {Array} attributes Attributs à affecter à la balise (class, id, value, src, ...)
 * @param {string} prevTag Balise HTML parente à laquelle rattacher le nouveau noeud
 * @returns {HTMLElement} Noeud HTML créé dans le DOM retourné dans la variable d'appel
 */
export function createDom (tag, text, attributes, prevTag) {
    let element = document.createElement(tag);
    setAttributes(element, text, attributes);
    prevTag.appendChild(element);
    return element;
}

/**
 * -> Fonction de détermination des différents attributs à intégrer à un élément HTML
 * @param {var} element Variable (constante) détenant le sélecteur HTML (par sa classe ou ID) sur lequel affecter les attributs
 * @param {string} text Chaîne de caractères détenant le texte à afficher dans la balise HTML. Doit être spécifiée dans l'appel à la fonction au minimum par "", auquel cas la balise n'aura pas de texte.
 * @param {string} attributes Chaîne de caractères sous forme de liste, regroupant les attributs et leurs propriétés.
 */
export function setAttributes(element, text="", attributes) {
    for(var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    if (text != "") {
        element.innerText = text;
    }
}

/**
 * -> Fonction de suppression de tous les éléments enfants d'un parent dans le DOM
 * @param {HTMLElement} parent  indiquant le nom de la classe (précédée d'un ".") ou de l'ID (précédé d'un "#") parent duquel on souhaite retirer tous les enfants dans le DOM.
 */
function deleteChilds (parent) {
    const parentElement = document.querySelector(parent);
    let firstChild = parentElement.firstElementChild;
    while (firstChild) {
        firstChild.remove();
        firstChild = parentElement.firstElementChild;
    }
}

/**
 * -> Fonction de récupération des caractéristiques d'un produit dans l'API, grâce à son ID
 * @param {string} idProduit
 */
export async function getProductDetails (idProduit) {
    const reponseProduit = await fetch("http://localhost:3000/api/products/"+idProduit);
    return await reponseProduit.json();
}