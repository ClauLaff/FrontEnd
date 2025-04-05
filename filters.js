import {getWorks}from "./index.js";

const categories = await getCategories();
const travaux = await getWorks();

/**Importation des catégories depuis l'API, enregistre la liste des catégories dans le local strorage */
export async function getCategories(){
    const reponse = await fetch ("http://localhost:5678/api/categories");
    const result = await reponse.json();
    return result;
}

async function displayFilteredWorks(filterId){
    const gallery = document.getElementById("gallery");
    const figures = gallery.querySelectorAll("figure");
    if (filterId==0){
        for(let i=0; i<figures.length;i++){
            figures[i].style.display="block";
        }
    }else{
        for(let i=0;i<figures.length;i++){
            if(figures[i].dataset.cat!==filterId){
                figures[i].style.display="none";
            }else{
                figures[i].style.display="block";
            }
        } 
    }   
}

/**Création et activation des filtres à partir des catégories importées depuis l'API*/
export function createFilters(){
    /**creation des filtres */
    const filtBar = document.getElementById("filtersBar");
    const filtAll = document.createElement("button");
    filtAll.setAttribute("data-id", "0");
    filtAll.classList.add("filter");
    filtAll.innerText = "Tous";
    filtBar.appendChild(filtAll);
    for(let i=0;i<categories.length; i++){ 
        const filter = document.createElement("button");
        filter.setAttribute("data-id",`${categories[i].id}`);
        filter.classList.add("filter");
        filter.innerText = `${categories[i].name}`;
        filtBar.appendChild(filter);
    }
    /**activation des filtres */
    const filters = filtBar.querySelectorAll("button");
    for(let i=0; i<filters.length;i++){
        filters[i].addEventListener("click", function(event){
            const filterId = event.target.dataset.id;
            displayFilteredWorks(filterId);
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