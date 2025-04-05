import {createFilters, getCategories} from "./filters.js";
import {createModal} from "./modal.js";

export const works = await getWorks();
const categories = await getCategories();

/**Importation des travaux depuis l'API, renvoie le résultat*/
export async function getWorks(){ 
    const reponse = await fetch("http://localhost:5678/api/works");
    const result =  await reponse.json();
    return result;
}

/**Création des travaux dans la gallerie principale*/
export function createAllWorks(){
    for(let i=0; i<works.length;i++){
        createWork(works[i]);
   }
 }
/** Création d'un travail dans la galerie principale*/
export function createWork(work){
    const gallery = document.getElementById("gallery");
    const fig = document.createElement("figure");
    fig.setAttribute("data-id", `${work.id}`);
    fig.setAttribute("data-cat", `${work.categoryId}`);
    const image = document.createElement("img");
    image.src = `${work.imageUrl}`;
    const figCap = document.createElement("figcaption");
    figCap.innerText = `${work.title}`;
    fig.appendChild(image);
    fig.appendChild(figCap);
    gallery.appendChild(fig);
}
/**Création d'un travail dans la galerie modale */
export function createWorkInModalGallery(work){
    const modGal= document.querySelector("#modal-gallery");
    const fig = document.createElement("figure");
    fig.setAttribute("data-id", `${work.id}`);
    const image = document.createElement("img");
    image.src=`${work.imageUrl}`;
    image.alt = `${work.title}`;
    const input = document.createElement("input");
    input.type="image";
    input.src="assets/icons/bin.png";
    input.alt="supprimer";
    input.setAttribute("class","bin js-modal-stop");
    input.setAttribute("data-id",`${work.id}`);
    fig.appendChild(image);
    fig.appendChild(input);
    modGal.appendChild(fig);
}
/**Création du menu déroulant "catégorie" dans le formulaire de la modale */
async function createCategoriesInModalGallery(){
    const category = document.querySelector("#category");
    const option = document.createElement("option");
    option.value="";
    category.appendChild(option);
    for(let i=0; i<categories.length;i++){
        const option = document.createElement("option");
        option.value =`${categories[i].name}`;
        option.innerText = `${categories[i].name}`;
        category.appendChild(option);
    }
}
/**Adapte l'affichage de la page d'accueil en mode édition selon que l'on est connecté ou déconnecté*/
function adaptEditionModeDisplay(){
    const token = localStorage.getItem("1");
    if(token !== null){
        const banner = document.getElementById("edition-banner");
        banner.classList.remove("invisible");
        const logInOut = document.getElementById("logInOut");
        logInOut.innerText="logout";
        const modifier = document.getElementById("modifier");
        modifier.classList.remove("invisible");
    }else{
        const banner = document.getElementById("edition-banner");
        banner.classList.add("invisible");
        const logInOut = document.getElementById("logInOut");
        logInOut.innerText = "login";
        const modifier = document.getElementById("modifier");
        modifier.classList.add("invisible");
        const filters= document.getElementById("filtersBar");
        filters.classList.remove("invisible");
    }
 }

/**"Login" envoie vers la page de login, "logout" efface le token en mémoire et envoie vers la page d'accueil*/
 function LogInOutOn(){
    const logInOut = document.getElementById("logInOut");
    logInOut.addEventListener("click", function(){
        if(logInOut.textContent==="login"){
            location.href="login.html";
        }else{
            localStorage.removeItem("1");
            location.href="index.html";
        }
    })
 }

createAllWorks();
createFilters();
adaptEditionModeDisplay();
LogInOutOn();
for(let i=0; i<works.length;i++){
    createWorkInModalGallery(works[i]);
}
createCategoriesInModalGallery();
createModal();