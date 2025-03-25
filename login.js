activerFormulaire();

/**Vérificatin des champs: 
 * si champ vide envoie un signal visuel
 * ou renvoie la valeur du champ saisie */
function verificationSaisie(idChamp){
    let champ = document.getElementById(`${idChamp}`);
    let champTrim = champ.value.trim();
    if(champTrim === ""){
        champ.classList.add(undefined);
        champ.addEventListener("change",()=>{
            champ.classList.remove(undefined);
            const balise = document.getElementById("message-connexion");
            balise.innerHTML = "";
        })
    }
    else{return champTrim}
}

/**Envoi des champs saisis avec POST: 
 * si connexion réussie: enregistre le token dans le local storage;
 * si échec connexion: affiche le code et le descriptif*/
async function requeteLogin(chargeUtile){
   try{
        const reponse = await fetch ("http://localhost:5678/api/users/login",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body: chargeUtile
        });
        if (reponse.ok){
            const message = reponse.status + ": " + reponse.statusText;
            const resultat = await reponse.json();
            const userId = resultat.userId;
            const token = resultat.token;
            localStorage.setItem(`${userId}`, `${token}`);
            location.href="index.html";
        }else{
            const message = reponse.status + ": " + reponse.statusText;
            const balise = document.getElementById("message-connexion");
            balise.innerHTML = message;
        }
    }catch(error){
        console.error("La connexion a échoué", error.message)
    }
}

/**Activation du formulaire de login : activation du bouton "Se connecter":
 * au click envoie les données du formulaire à l'API pour connexion, 
 * si connxion réussie, enregistre le token dans le local storage,
* renvoie true ou false selon réussite ou échec de connexion*/
function activerFormulaire(){
    const formulaireLogin = document.querySelector("#login form");
    formulaireLogin.addEventListener ("submit", (event)=>{
        event.preventDefault();
        const email = verificationSaisie("email");
        const password = verificationSaisie("password");
        if (email!== undefined & password !== undefined){
            const loginDetails = { email: email, password : password};
            const chargeUtile = JSON.stringify(loginDetails);
            requeteLogin(chargeUtile);
        }
    })
}