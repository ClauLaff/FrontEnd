import {creerFiltres} from "./filtres.js";

afficherTousTravaux();
creerFiltres();
gererAffichageModeEdition();
activerLogInOut();

/**Importation depuis l'API et affichage de tous les travaux*/
export async function afficherTousTravaux(){ 
    const travaux = await importerTravaux();
    const galerie = document.getElementById("galerie");
    for(let i=0; i<travaux.length;i++){
        galerie.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><figcaption>${travaux[i].title}</figcaption></figure>`;
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
        const log = document.getElementById("logInOut");
        log.innerText="logout";
        const modifier = document.getElementById("modifier");
        modifier.classList.remove("invisible");
    }else{
        const bandeau = document.getElementById("bandeauEdition");
        bandeau.classList.add("invisible");
        const log = document.getElementById("logInOut");
        log.innerText = "login";
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
