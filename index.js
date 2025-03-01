import {creerFiltres} from "./filtres.js";

afficherTousTravaux();
creerFiltres();

/**Importation des travaux depuis l'API*/
export async function importerTravaux(){
    const reponse = await fetch("http://localhost:5678/api/works");
    return reponse;
}

/**Importation depuis l'API et affichage de tous les travaux*/
export async function afficherTousTravaux(){ 
    const reponse = await importerTravaux();
    const travaux = await reponse.json();
    const galerie = document.getElementById("galerie");
    for(let i=0; i<travaux.length;i++){
        galerie.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><figcaption>${travaux[i].title}</figcaption></figure>`;
    }
 }

