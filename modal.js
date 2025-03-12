let modal = null;
let vue1 = null;
let vue2 = null;
let vue = null;
const focusableSelector="button, a, input, textarea";
let focusables = [];
const travaux = await importerTravaux();

async function importerTravaux(){
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}

const supprimer = async function(e){
    const id = e.target.dataset.id;
    const token = localStorage.getItem("1");
    const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
        method:"DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type":"application/json"
        }
    })
}

function activerBoutonsSuppression(){
    const bins = document.querySelectorAll(".bin");
    for(let i=0;i<bins.length;i++){
        bins[i].addEventListener("click", supprimer)
    }
}
function desactiverBoutonsSuppresion(){
    const bins = document.querySelectorAll(".bin");
    for(let i=0;i<bins.length;i++){
        bins[i].removeEventListener("click", supprimer)
    }
}

function activerBoutonAjouterPhoto(){
    const ajouterPhoto = modal.querySelector("#ajouter-photo");
    ajouterPhoto.addEventListener("click", affichageVue2)
}
function desactiverBoutonAjouterPhoto(){
    const ajouterPhoto = modal.querySelector("#ajouter-photo");
    ajouterPhoto.removeEventListener("click", affichageVue2)
}

function afficherVue1(){
    const wrapper = document.getElementById("modal-wrapper");
    wrapper.innerHTML=
        `<div id="vue1">
            <input type="image" src="assets/icons/xmark.png" alt="fermer-modale" class="js-close-modal">
            <h3 id="title-modal">Galerie photo</h3>
            <div id="galerie-modale" class="modal-Gallery"></div>
            <button  id="ajouter-photo" >Ajouter une photo</button>
        </div>`
    modal = document.getElementById("modal");
    const galerieModale = modal.querySelector("#galerie-modale");
    for(let i=0; i<travaux.length;i++){
        galerieModale.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><input type="image" src="assets/icons/bin.png" alt ="supprimer" class="bin js-modal-stop" data-id="${travaux[i].id}"></input></figure>`;
    }
    activerBoutonsSuppression();
    activerBoutonAjouterPhoto();
    modal.classList.remove("invisible");
    vue1 = modal.querySelector("#vue1");
    vue=vue1;
}
export const affichageVue1 = function(){
    if (modal !== null){closeModal()}
    afficherVue1();
    openModal();
}


const stopPropagation = function(e){
    e.stopPropagation();
}

const focusInModal = function(e){
    e.preventDefault();
    let index = focusables.findIndex(f=> f === vue.querySelector(":focus"))
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

const openModal = function(){
    focusables = Array.from (vue.querySelectorAll(focusableSelector));
    focusables[0].focus();
    modal.setAttribute("aria-hidden",false);
    modal.setAttribute("aria-modal",true);
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").addEventListener("click",closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation); 
}

const closeModal = function(){
    if (modal === null) return;
    modal.classList.add("invisible");
    if (vue === vue1){
        const galerieModale = document.getElementById("galerie-modale");
        galerieModale.innerHTML =``;
        desactiverBoutonsSuppresion();
        desactiverBoutonAjouterPhoto();
    }
    focusables=[];
    modal.setAttribute("aria-hidden", true);
    modal.setAttribute("aria-modal",false);
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal.querySelector("#modal-wrapper").innerHTML=``;
    modal = null;
}

export function creerModale(){
    document.querySelector(".js-modal").addEventListener("click", affichageVue1);
    console.log("Modale créée");
}

function afficherVue2(){
    closeModal();
    const wrapper = document.getElementById("modal-wrapper");
    wrapper.innerHTML=
    `<div id="vue2">
        <div class="modal-header">
            <input type="image" src="assets/icons/backward.png" alt="retour galerie photo" id="retour-vue1">
            <input type="image" src="assets/icons/xmark.png" alt="fermer modale" class="js-close-modal">
        </div>
        <h3 id = "title-modal" >Ajout photo</h3>
        <form action="#" method="post">
            <input type="file" id="explorateur" accept="jpg, png">
            <label for="title">Titre</label>
            <input type="text" name="title" id="title">
            <label for="category">Catégorie</label>
            <input type"text" name="category" id="category">
            <input type="submit" value="Valider">
        </form>
    </div>`
    modal= document.getElementById("modal");
    modal.classList.remove("invisible");
    vue2 = modal.querySelector("#vue2");
    vue = vue2;
    /**activerBoutonValider();*/
}

const affichageVue2 = function(){
    closeModal();
    afficherVue2();
    openModal();
}
/**function activerBoutonValider(){
    modal.querySelector("#valider");
}*/