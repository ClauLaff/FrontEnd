/**
 * Récupération des travaux puis affichage dynamique
 */
async function afficherTravaux(){
    /**Récupération dans constante travaux*/
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();
    /**Création des nouveaux éléments et rattachement au DOM*/
    const gallerie = document.createElement("div");
    for(let i=0; i<travaux.length;i++){
        gallerie.innerHTML+=`<figure><img src="${travaux[i].imageUrl}" alt="${travaux[i].title}"><figcaption>${travaux[i].title}</figcaption></figure>`
    }
    const portfolio = document.getElementById("portfolio");
    portfolio.appendChild(gallerie);  
    /**Ajout de la classe pour mise en page css de la div */
    gallerie.classList.add("gallery");
}
afficherTravaux();
