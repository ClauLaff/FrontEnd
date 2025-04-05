import { createWork, createWorkInModalGallery} from "./index.js";
import {getCategories} from "./filters.js";

let modal = null;
let view1 = document.getElementById("view1");
let view2 = document.querySelector("#view2");
let focusView = null;
const focusableSelector= "a, button, input, select";
let focusables = [];
const categories = await getCategories();


/**Vue 1 */

/**Supprime un travail de la base de données, met à jour l'affichage des galeries */
const deleteWork = async function(e){
    try{
        const id = e.target.dataset.id;
        const token = localStorage.getItem("1");
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method:"DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type":"application/json"
            }
        })
        if(response.ok){
            const gal = document.getElementById("gallery");
            const fig = gal.querySelector(`figure[data-id="${id}"]`);
            gal.removeChild(fig);
            const modGal = modal.querySelector("#modal-gallery");
            const modFig = modGal.querySelector(`figure[data-id="${id}"]`);
            modGal.removeChild(modFig);
            closeModal();
        }
    }catch(error){
        console.error("La suppression n'a pu être finalisée", error.message)
    }  
}
function removeButtonsOn(){
    const bins = document.querySelectorAll(".bin");
    for(let i=0;i<bins.length;i++){
        bins[i].addEventListener("click", deleteWork)
    }
}
function removeButtonsOff(){
    const bins = document.querySelectorAll(".bin");
    for(let i=0;i<bins.length;i++){
        bins[i].removeEventListener("click", deleteWork)
    }
}
function ajouterPhotoButtonOn(){
    const ajouterPhoto = document.querySelector("#ajouter-photo");
    ajouterPhoto.addEventListener("click", function(){
        displayView2();
    })
}
function ajouterPhotoButtonOff(){
    const ajouterPhoto = document.querySelector("#ajouter-photo");
    ajouterPhoto.removeEventListener("click", function(){
        displayView2();
    })
}
function displayView1(){
    view2.style.display="none";
    focusables=[]; 
    focusView=view1;
    focusables = Array.from (focusView.querySelectorAll(focusableSelector));
    focusables[0].focus();
    view1.style.display="flex";
}


/** Vue 2 */

function backToView1On(){
    const back = document.getElementById("back-to-view1");
    back.addEventListener("click", function(){
        displayView1();
    })
}
function backToView1Off(){
    const back = document.getElementById("back-to-view1");
    back.removeEventListener("click", function(){
        displayView1();
    })
}
/**Vérifie que les champs requis sont tous renseignés, activation conditionnelle du bouton "valider" */
function checkForm(){
    const explorer = modal.querySelector("#explorer");
    const photos = explorer.files;
    const title = modal.querySelector("#title");
    const tit = title.value;
    const category = modal.querySelector("#category");
    const cat = category.value;
    if ( photos.length !== 0 && tit !== "" && cat !== ""){
       const valider = modal.querySelector("#valider");
        valider.style.backgroundColor="#1D6154";
        
    }else{
        const valider = modal.querySelector("#valider");
        valider.style.backgroundColor="#A7A7A7";
        
    }
}
/**Affiche un apperçu du travail sélectionné avant ajout */
const displayPhoto = function(e){
    const explorer= modal.querySelector("#explorer");
    const photos = explorer.files;
    const preview = modal.querySelector("#preview");
    preview.innerHTML="";
    if (photos[0].size>4194304){
        preview.innerText = "Le fichier ne doit pas excéder 4Mo, votre fichier fait " + photos[0].size + " octets";
        return;
    }
    const infos = modal.querySelector("#ajout-photo-infos");
    infos.style.display="none";
    const photo = document.createElement("img");
    photo.classList.add("photo");
    photo.src = window.URL.createObjectURL(photos[0]);
    preview.appendChild(photo);
    const titre = photos[0].name;
    const title = modal.querySelector("#title");
    title.value = titre;
    checkForm();
}
function explorerOn(){
    const explorer = modal.querySelector("#explorer");
    explorer.addEventListener("change", displayPhoto);
}
function explorerOff(){
    const explorer = modal.querySelector("#explorer");
    explorer.removeEventListener("change", displayPhoto);
}
function checkTitleOn(){
    const title = modal.querySelector("#title");
    title.addEventListener("change",function(){
        checkForm();
    })
}
function checkTitleOff(){
    const title = modal.querySelector("#title");
    title.removeEventListener("change",function(){
        checkForm();
    })
}
function checkCategoryOn(){
    const category = modal.querySelector("#category");
    category.addEventListener("change",function(){
        checkForm();
    })
}
function checkCategoryOff(){
    const category = modal.querySelector("#category");
    category.removeEventListener("change",function(){
        checkForm();
    })
}
function displayView2(){
    view1.style.display="none";
    focusables=[];
    focusView= view2;
    focusables = Array.from (focusView.querySelectorAll(focusableSelector));
    focusables[0].focus();
    view2.style.display="flex";
}
/**Ajout d'un travail dans la base de données, mise à jout de l'affichage des galeries */
const addWork = async (e)=>{
    e.preventDefault();
    const explorer = modal.querySelector("#explorer");
    const photos = explorer.files;
    const photo = photos[0];
    const title = modal.querySelector("#title");
    const titre = title.value;
    const category = modal.querySelector("#category");
    const cat = category.value;
    let idCat = null;
    for (let i=0;i<categories.length;i++){
        if (categories[i].name === cat){
            idCat = categories[i].id;
        }
    }
    const formData = new FormData();
    formData.append("title", titre);
    formData.append("image", photo);
    formData.append("category", idCat);
    try{
        const token = localStorage.getItem("1");
        const response = await fetch("http://localhost:5678/api/works", {
            method:"POST",
            headers: {
                "Authorization": `Bearer ${token}`,  
            },
            body: formData
        })
        if (response.ok){
            const resultat = await response.json();
            createWork(resultat);
            createWorkInModalGallery(resultat);
            const preview = modal.querySelector("#preview");
            const photo = modal.querySelector(".photo");
            preview.removeChild(photo);
            const title = modal.querySelector("#title");
            title.value="";
            const infos = modal.querySelector("#ajout-photo-infos");
            infos.style.display="flex";
            const explorer = modal.querySelector("#explorer");
            closeModal();
        } 
    }catch(error){
        console.error("L'ajout n'a pu être finalisé", error.message)
    }
}
function formOn(){
    const form = modal.querySelector("#ajout-photo-form");
    form.addEventListener("submit", addWork);
}
function formOff(){
    const form = document.getElementById("ajout-photo-form");
    form.removeEventListener("submit", addWork);
}

/** Création, focus, ouvrir et fermer modale */
/**Les éléments sélectionnés ne seront pas affectés par le listener correspondant */
const stopPropagation = function(e){
    e.stopPropagation();
}
/**Permet de gérer le focus à la tabulation pour l'accessibilité de la modale à l'intérieure d'une vue donnée */
const focusInModal = function(e){
    e.preventDefault();
    let index = focusables.findIndex(f=> f === focusView.querySelector(":focus"))
    if (e.shiftKey === true){
        index --
    }else{
        index ++
    }
    if (index >= focusables.length){
        index=0
    }
    if (index < 0){
        index = focusables.length-1
    }
    focusables[index].focus();
}
window.addEventListener("keydown", function(e){
    if(e.key === "Escape" || e.key === "Esc"){
        closeModal(e)
    }if(e.key === "Tab" && modal !== null){
        focusInModal(e)
    }
})
/** Ouvre la modale et active les listeners des boutons */
const openModal = function(){
    displayView1();
    modal=document.getElementById("modal");
    modal.style.display="flex";
    modal.setAttribute("aria-hidden",false);
    modal.setAttribute("aria-modal",true);
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    const closeButtons = document.querySelectorAll(".js-close-modal");
    for(let i=0; i<closeButtons.length; i++){
        closeButtons[i].addEventListener("click", closeModal)
    }
    removeButtonsOn();
    ajouterPhotoButtonOn();
    backToView1On();
    explorerOn();
    checkTitleOn();
    checkCategoryOn();
    formOn() 
}
/**Ferme la modale et désactive les listeners des boutons */
const closeModal = function(){
    modal = document.getElementById("modal");
    if (modal === null) return;
    modal.style.display ="none";
    removeButtonsOff();
    ajouterPhotoButtonOff();
    backToView1Off();
    explorerOff();
    checkTitleOff();
    checkCategoryOff();
    formOff();
    focusables=[];
    modal.setAttribute("aria-hidden", true);
    modal.setAttribute("aria-modal",false);
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    const closeButtons = document.querySelectorAll(".js-close-modal");
    for(let i=0; i<closeButtons.length; i++){
        closeButtons[i].removeEventListener("click", closeModal)
    }
    modal = null;
}

export function createModal(){
    document.querySelector(".js-modal").addEventListener("click", openModal);
    console.log("Modale créée");
}