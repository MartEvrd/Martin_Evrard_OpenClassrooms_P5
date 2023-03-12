import { recupPanier, createDom, deleteChilds } from "./functions.js";

const urlPage = new URL(window.location.href);
const orderId = urlPage.searchParams.get("id");

let panier = recupPanier();
if (panier.length != 0) {
    localStorage.clear();
}

const spanId = document.getElementById("orderId");
if (orderId != null) {
    spanId.innerText = orderId;
} else {
    const divConfirmation = document.querySelector(".confirmation");
    deleteChilds(".confirmation");
    const errMsg = createDom(
        "p", 
        "ERREUR - Aucune commande n'a été passée.\nRendez-vous sur le store pour effectuer vos achats.",
        "",
        divConfirmation);
}