import {creerFiltres} from "./filtres.js";
import {creerModale} from "./modal.js";

const travaux = JSON.parse(localStorage.getItem("listeTravaux"));


/**Importation des travaux depuis l'API, enregistre la liste des travaux dans le localStorage*/
export async function importerTravaux(){ 
    const reponse = await fetch("http://localhost:5678/api/works");
    const result =  await reponse.json();
    const list = JSON.stringify(result);
    localStorage.setItem("listeTravaux", `${list}`);
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

if (travaux === null || travaux === undefined){
    importerTravaux()
}
afficherTousTravaux();
creerFiltres();
gererAffichageModeEdition();
activerLogInOut();
creerModale();