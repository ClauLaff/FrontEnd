import {creerFiltres} from "./filtres.js";
import { activerModal} from "./modale.js";

afficherTousTravaux();
creerFiltres();
gererAffichageModeEdition();
activerLogInOut();
activerModal();

/**Importation depuis l'API et affichage de tous les travaux*/
export async function afficherTousTravaux(){ 
    const travaux = await importerTravaux();
    const galerie = document.getElementById("galerie");
    for(let i=0; i<travaux.length;i++){
        galerie.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><figcaption>${travaux[i].title}</figcaption></figure>`;
    }
    const galerieModale = document.getElementById("galerieModale");
    for(let i=0; i<travaux.length;i++){
        galerieModale.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><button class="bin" data-id="${travaux[i].id}"><img src="assets/icons/bin.png"></button></figure>`;
    }
 }
/**Importation des travaux depuis l'API*/
export async function importerTravaux(){
    const reponse = await fetch("http://localhost:5678/api/works");
    return reponse.json();
}

/**Adapte l'affichage de la page d'accueil selon si l'on est connecté (mode édition) ou déconnecté*/
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
