import {afficherTousTravaux, importerTravaux}from "./index.js";


/**Création et activation des filtres à partir de la liste des catégories importée par l'API */
export async function creerFiltres(){
    /**importation des catégories*/
    const reponse = await fetch ("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    /**creation des filtres */
    const barreFiltres = document.getElementById("barreFiltres");
    barreFiltres.innerHTML += `<button data-id=0 class="filter">Tous</button>`;
    for(let i=0;i<categories.length; i++){ 
        barreFiltres.innerHTML += `<button data-id=${categories[i].id} class="filter">${categories[i].name}</button>`;  
    }
    /**activation des filtres */
    const filtres = barreFiltres.querySelectorAll("button");
    for(let i=0; i<filtres.length;i++){
        filtres[i].addEventListener("click", async function(event){
            const id = event.target.dataset.id;
            if (id==0){
                effacerGalerie();
                afficherTousTravaux();
            }else{
                effacerGalerie();
                afficherTravauxFiltres(id);
            }
        });
    }
 }
 function effacerGalerie(){
     const galerie = document.getElementById("galerie");
     galerie.innerHTML="";
 }
 async function afficherTravauxFiltres(id){
    const reponse = await importerTravaux();
    const travaux = await reponse.json();
    const travauxFiltres = travaux.filter(function(work){
        return work.categoryId==id;
    });
     for(let i=travauxFiltres.length-1;i>=0;i--){
         galerie.innerHTML+=`<figure><img src="${travauxFiltres[i].imageUrl}" alt="${travauxFiltres[i].title}"><figcaption>${travauxFiltres[i].title}</figcaption></figure>`;
    } 
 }
 