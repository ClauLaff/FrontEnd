let modal = null;
let vue1 = null;
let vue2 = null;
let vue = null;
const focusableSelector="button, a, input, textarea";
let focusables = [];
const travaux = await importerTravaux();
const categories = await importerCategories();

async function importerTravaux(){
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}
async function importerCategories(){
    const reponse = await fetch ("http://localhost:5678/api/categories");
    return await reponse.json();
}

const supprimer = async function(e){
    const id = e.target.dataset.id;
    const token = localStorage.getItem("1");
    await fetch(`http://localhost:5678/api/works/${id}`, {
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
            <div class="modal-header">
                <input type="image" src="assets/icons/xmark.png" alt="fermer-modale" class="js-close-modal">
            </div>
            <h3 id="title-modal">Galerie photo</h3>
            <div id="galerie-modale" class="modal-Gallery"></div>
            <div class="modal-footer">
                <button  id="ajouter-photo" >Ajouter une photo</button>
            </div>
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
    }else{
        desactiverBoutonRetour();
        desactiverExplorateur();
        desactiverVerificationTitre();
        desactiverVerificationCategorie();
        desactiverFormulaire();
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
        <form action="#" method="post" id="formulaire-ajout-photo">
            <label for="explorateur" id="zone-ajout-photo">
                <div>
                    <div id="informations-ajout-photo">
                        <img src="assets/icons/jpg.png" alt="jpg">
                        <label for="explorateur" id="bouton-ajouter-photo">+ Ajouter photo</label>
                        <p>jpg, png : 4mo max</p>
                    </div>
                    <div id="preview">
                    </div>
                </div>
                <input type="file" id="explorateur" accept=".jpg, .png" multiple=false class="invisible">   
            </label>
            <label for="title">Titre</label>
            <input type="text" name="title" id="title" required=true>
            <label for="category">Catégorie</label>
            <select name="category" id="category" required=true></select>
            <div class="modal-footer">
                <input type="submit" value="Valider" id="valider">
            </div>
        </form>     
    </div>`
    modal= document.getElementById("modal");
    const categorie = modal.querySelector("#category");
    categorie.innerHTML+=`<option value=""></option>`;
    for(let i=0; i<categories.length;i++){
        categorie.innerHTML+=`<option value="${categories[i].name}">${categories[i].name}</option>`;
    }
    activerBoutonRetour();
    activerExplorateur();
    activerVerificationTitre();
    activerVerificationCategorie();
    activerFormulaire();
    vue2 = modal.querySelector("#vue2");
    vue = vue2;
    modal.classList.remove("invisible");
}
const affichageVue2 = function(){
    closeModal();
    afficherVue2();
    openModal();
}
function activerBoutonRetour(){
    const retour = modal.querySelector("#retour-vue1");
    retour.addEventListener("click", affichageVue1);
}
function desactiverBoutonRetour(){
    const retour = modal.querySelector("#retour-vue1");
    retour.removeEventListener("click", affichageVue1);
}
const affichagePhoto = function(e){
    const explorateur = modal.querySelector("#explorateur");
    const photos = explorateur.files;
    const informations = modal.querySelector("#informations-ajout-photo");
    informations.style.display="none";
    const preview = modal.querySelector("#preview");
    preview.innerHTML="";
    const photo = document.createElement("img");
    photo.classList.add("photo");
    photo.src = window.URL.createObjectURL(photos[0]); 
    preview.appendChild(photo);
    const titre = photos[0].name;
    const title = modal.querySelector("#title");
    title.value = titre;
    verifierFormulaire();
}
function activerExplorateur(){
    const explorateur = modal.querySelector("#explorateur");
    explorateur.addEventListener("change", affichagePhoto);
}
function desactiverExplorateur(){
    const explorateur = modal.querySelector("#explorateur");
    explorateur.removeEventListener("change", affichagePhoto);
}
function activerVerificationTitre(){
    const title = modal.querySelector("#title");
    title.addEventListener("change",function(){
        verifierFormulaire;
    })
}
function desactiverVerificationTitre(){
    const title = modal.querySelector("#title");
    title.removeEventListener("change",function(){
        verifierFormulaire;
    })
}
function activerVerificationCategorie(){
    const category = modal.querySelector("#category");
    category.addEventListener("change",function(){
        verifierFormulaire();
    })
}
function desactiverVerificationCategorie(){
    const category = modal.querySelector("#category");
    category.removeEventListener("change",function(){
        verifierFormulaire();
    })
}
function verifierFormulaire(){
    const explorateur = modal.querySelector("#explorateur");
    const photos = explorateur.files;
    const title = modal.querySelector("#title");
    const titre = title.value;
    const category = modal.querySelector("#category");
    const categorie = category.value;
    if ( photos.length !== 0 && titre !== "" && categorie !== ""){
       const valider = modal.querySelector("#valider");
        valider.style.backgroundColor="#1D6154";
        
    }else{
        const valider = modal.querySelector("#valider");
        valider.style.backgroundColor="#A7A7A7";
        
    }
}
const ajouter = (e)=>{
    e.preventDefault();
    const explorateur = modal.querySelector("#explorateur");
    const photos = explorateur.files;
    const urlPhoto = window.URL.createObjectURL(photos[0]);
    console.log(urlPhoto)
    const title = modal.querySelector("#title");
    const titre = title.value;
    console.log(titre)
    const category = modal.querySelector("#category");
    const categorie = category.value;
    let idCategorie = null;
    for (let i=0;i<categories.length;i++){
        if (categories[i].name === categorie){
            idCategorie = categories[i].id;
        }
    }
    console.log(idCategorie)
    const body = { id: 0, title: titre, imageUrl: urlPhoto,  categoryId: idCategorie, userId: 1, category:{id: idCategorie, name: categorie}};
    const chargeUtile = JSON.stringify(body);
    console.log(chargeUtile);
    requeteAjoutPhoto(chargeUtile);
    
}
async function requeteAjoutPhoto(chargeUtile){
    const token = localStorage.getItem("1");
    await fetch("http://localhost:5678/api/works", {
        method:"POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body: chargeUtile
    })
    console.log("ajouté")
}
function activerFormulaire(){
    const formulaire = modal.querySelector("#formulaire-ajout-photo");
    formulaire.addEventListener("submit", ajouter);
}
function desactiverFormulaire(){
    const formulaire = modal.querySelector("#formulaire-ajout-photo");
    formulaire.removeEventListener("submit", ajouter);
}