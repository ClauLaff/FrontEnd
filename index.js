import {creerFiltres} from "./filtres.js";

/**Récupération des travaux depuis l'API*/
export async function importerTravaux(){
        const reponse = await fetch("http://localhost:5678/api/works");
        return reponse;
    }
export async function afficherTousTravaux(){ 
    const reponse = await importerTravaux();
    const travaux = await reponse.json();
    const galerie = document.getElementById("galerie");
    for(let i=0; i<travaux.length;i++){
        galerie.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><figcaption>${travaux[i].title}</figcaption></figure>`;
    }
 }

afficherTousTravaux();
creerFiltres();