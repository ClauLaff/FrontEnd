import {afficherTousTravaux, importerTravaux}from "./index.js";

const categories = await importerCategories();
const travaux = await importerTravaux();

/**Importation des catégories depuis l'API, renvoie la liste des catégories */
async function importerCategories(){
    const reponse = await fetch ("http://localhost:5678/api/categories");
    return await reponse.json();
}

/**Création et activation des filtres à partir des catégories importées depuis l'API*/
export async function creerFiltres(){
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
    /**affichage conditionné des filtres en fonction de la connexion*/
    const token = localStorage.getItem("1");
    if(token !== null){
        const filtres = document.querySelectorAll(".filter");
        for (let i=0; i<filtres.length; i++){
            filtres[i].classList.add("invisible");
    }
    }else{
        const filtres = document.querySelectorAll(".filter");
        for (let i=0; i<filtres.length; i++){
            filtres[i].classList.remove("invisible");
        }
    }
 }

 function effacerGalerie(){
     const galerie = document.getElementById("galerie");
     galerie.innerHTML="";
 }
 
 async function afficherTravauxFiltres(id){
    const travauxFiltres = travaux.filter(function(work){
        return work.categoryId==id;
    });
     for(let i=travauxFiltres.length-1;i>=0;i--){
         galerie.innerHTML+=`<figure><img src="${travauxFiltres[i].imageUrl}" alt="${travauxFiltres[i].title}"><figcaption>${travauxFiltres[i].title}</figcaption></figure>`;
    } 
 }
 
