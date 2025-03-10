import {creerFiltres} from "./filtres.js";
import { creerModale} from "./modale.js";


const travaux = await importerTravaux();

afficherTousTravaux();
creerFiltres();
gererAffichageModeEdition();
activerLogInOut();
creerModale();
afficherGalerieModale();


/**Importation des travaux depuis l'API, retourne la liste des travaux*/
export async function importerTravaux(){
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();;
}

/**Affichage de tous les travaux dans la galerie*/
export async function afficherTousTravaux(){
    const galerie = document.getElementById("galerie");
    for(let i=0; i<travaux.length;i++){
        galerie.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><figcaption>${travaux[i].title}</figcaption></figure>`;
    }
 }

/**Adapte l'affichage de la page d'accueil selon que l'on est connecté (mode édition) ou déconnecté*/
function gererAffichageModeEdition(){
    const token = localStorage.getItem("1");
    if(token !== null){
        const bandeau = document.getElementById("bandeauEdition");
        bandeau.classList.remove("invisible");
        const logInOut = document.getElementById("logInOut");
        logInOut.innerText="logout";
        const modifier = document.getElementById("modifier");
        modifier.classList.remove("invisible");
    }else{
        const bandeau = document.getElementById("bandeauEdition");
        bandeau.classList.add("invisible");
        const logInOut = document.getElementById("logInOut");
        logInOut.innerText = "login";
        const modifier = document.getElementById("modifier");
        modifier.classList.add("invisible");
        const filtres = document.getElementById("barreFiltres");
        filtres.classList.remove("invisible");
    }
 }

/**Login envoie vers la page de login, logout efface le token en mémoire et recharge la page d'accueil*/
 function activerLogInOut(){
    const logInOut = document.getElementById("logInOut");
    logInOut.addEventListener("click",function(){
        if(logInOut.textContent==="login"){
            location.href="login.html";
        }else{
            localStorage.removeItem("1");
            location.href="index.html";
        }
    })
 }

 /** Modale */

/**Crée les éléments html de la modale */
function creerElementsModale(){
    const modalWrapper = document.getElementById("modal-wrapper");
    modalWrapper.innerHTML = 
        `<input type="image" src="assets/icons/xmark.png" alt="fermer-modale" class="js-close-modal"></input>
            <h3 id="title-modal">Galerie photo</h3>
            <div id="galerieModale" class="modalGallery"></div>
            <button id="ajouterPhoto">Ajouter une photo</button>`;
}
/**Le click sur les boutons de suppression déclenche la suppression des travaux dans l'API*/
function activerBoutonsSuppression(){
const boutonsSuppression = document.querySelectorAll(".bin");
    for(let i=0;i<boutonsSuppression.length;i++){
        boutonsSuppression[i].addEventListener("click", async function(e){
            const id = e.target.dataset.id;
            const token = localStorage.getItem("1");
            const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
                method:"DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type":"application/json"
                }
            })
        })
    }
}
/**Affiche les travaux dans la modale et active les boutons de suppression */
function afficherGalerieModale(){
    creerElementsModale();
    const galerieModale = document.getElementById("galerieModale");
    for(let i=0; i<travaux.length;i++){
        galerieModale.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><input type="image" src="assets/icons/bin.png" alt ="supprimer" class="bin js-modal-stop" data-id="${travaux[i].id}"></input></figure>`;
    }
    activerBoutonsSuppression();
}