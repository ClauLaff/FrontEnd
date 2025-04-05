connectionFormOn();

/**Vérificatin des champs: 
 * si champ vide envoie un signal visuel
 * renvoie la valeur du champ saisie */
function checkField(fieldId){
    let field = document.getElementById(`${fieldId}`);
    let fieldTrim = field.value.trim();
    if(fieldTrim === ""){
        field.classList.add(undefined);
        field.addEventListener("change",()=>{
            field.classList.remove(undefined);
            const element = document.getElementById("connection-message");
            element.innerHTML = "";
        })
    }
    else{return fieldTrim}
}

/**Envoi des champs saisis avec POST: 
 * si connexion réussie: enregistre le token dans le local storage et redirige vers la page d'accueil;
 * si échec connexion: affiche le code et le message*/
async function loginRequest(chargeUtile){
   try{
        const response = await fetch ("http://localhost:5678/api/users/login",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body: chargeUtile
        });
        if (response.ok){
            const message = response.status + ": " + response.statusText;
            const result = await response.json();
            const userId = result.userId;
            const token = result.token;
            localStorage.setItem(`${userId}`, `${token}`);
            location.href="index.html";
        }else{
            const message = response.status + ": " + response.statusText;
            const element = document.getElementById("connection-message");
            element.innerHTML = message;
        }
    }catch(error){
        element.innerHTML= "La connexion a échoué" + error.message;
    }
}

/**Activation du formulaire de login : activation du bouton "Se connecter":
 * au click envoie les données du formulaire à l'API pour connexion, 
 * si connxion réussie, enregistre le token dans le local storage,*/
function connectionFormOn(){
    const loginForm = document.querySelector("#login form");
    loginForm.addEventListener ("submit", (event)=>{
        event.preventDefault();
        const email = checkField("email");
        const password = checkField("password");
        if (email!== undefined & password !== undefined){
            const loginDetails = { email: email, password : password};
            const chargeUtile = JSON.stringify(loginDetails);
            loginRequest(chargeUtile);
        }
    })
}