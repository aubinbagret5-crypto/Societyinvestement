// ==== Utilisateurs simulés via localStorage ====
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// ==== Elements ====
const authContainer = document.getElementById("auth-container");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const dashboard = document.getElementById("dashboard");
const balanceEl = document.getElementById("balance");
const planList = document.getElementById("plan-list");

// ==== Navigation Auth ====
document.getElementById("go-login").onclick = () => {signupForm.style.display="none"; loginForm.style.display="block";}
document.getElementById("go-signup").onclick = () => {loginForm.style.display="none"; signupForm.style.display="block";}

// ==== Inscription ====
document.getElementById("signup-btn").onclick = () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const parrain = document.getElementById("parrain").value;

  if(users.find(u=>u.email===email)){ alert("Email déjà utilisé"); return;}
  const codeParrainage = Math.random().toString(36).substring(2,8).toUpperCase();
  const newUser = {name,email,password,balance:0,history:[],codeParrainage,parrainageBonus:0};
  
  // bonus parrainage
  if(parrain){
    const parrainUser = users.find(u=>u.codeParrainage===parrain);
    if(parrainUser){ parrainUser.parrainageBonus += 40; }
  }

  users.push(newUser);
  localStorage.setItem("users",JSON.stringify(users));
  currentUser = newUser;
  localStorage.setItem("currentUser",JSON.stringify(currentUser));

  alert(`${name}, votre compte a été créé avec succès`);
  showDashboard();
}

// ==== Connexion ====
document.getElementById("login-btn").onclick = () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user){ alert("Email ou mot de passe incorrect"); return; }
  currentUser = user;
  localStorage.setItem("currentUser",JSON.stringify(currentUser));
  showDashboard();
}

// ==== Affichage Dashboard ====
function showDashboard(){
  authContainer.style.display="none";
  dashboard.style.display="block";
  updateBalance();
  loadPlans();
}

// ==== Solde ====
function updateBalance(){
  balanceEl.innerText = currentUser.balance;
  localStorage.setItem("currentUser",JSON.stringify(currentUser));
}

// ==== Plans VIP ====
const plansData = [
  {name:"Plan 2500",amount:2500,daily:600,duration:30},
  {name:"Plan 5000",amount:5000,daily:1200,duration:30},
  {name:"Plan 10000",amount:10000,daily:2400,duration:30}
  // tu peux rajouter tous les autres plans ici
];

function loadPlans(){
  planList.innerHTML="";
  plansData.forEach(plan=>{
    const div = document.createElement("div");
    div.className="plan-item";
    div.innerHTML=`<h3>${plan.name}</h3>
      <p>Investissement : ${plan.amount} FCFA</p>
      <p>Revenus quotidiens : ${plan.daily} FCFA</p>
      <p>Total : ${plan.daily*plan.duration} FCFA</p>
      <button class="invest-btn">Investir</button>`;
    div.querySelector(".invest-btn").onclick = ()=>{
      if(currentUser.balance<plan.amount){ alert("Solde insuffisant, veuillez recharger"); return;}
      currentUser.balance -= plan.amount;
      updateBalance();
      alert(`Vous avez investi ${plan.amount} FCFA dans ${plan.name}`);
    }
    planList.appendChild(div);
  });
}

// ==== Recharge ====
document.getElementById("recharge-btn").onclick = ()=>{
  const montant = parseInt(prompt("Montant à recharger (min 2000 FCFA)"));
  if(montant>=2000){
    currentUser.balance += montant;
    updateBalance();
    currentUser.history.push({type:"recharge",amount:montant,date:new Date().toLocaleString()});
    localStorage.setItem("currentUser",JSON.stringify(currentUser));
    alert("Recharge validée !");
  } else { alert("Montant trop faible"); }
}

// ==== Retrait ====
document.getElementById("withdraw-btn").onclick = ()=>{
  const montant = parseInt(prompt("Montant à retirer (min 1500 FCFA, max 500000 FCFA)"));
  if(montant<1500 || montant>500000 || montant>currentUser.balance){
    alert("Montant invalide ou solde insuffisant"); return;
  }
  currentUser.balance -= montant;
  updateBalance();
  currentUser.history.push({type:"retrait",amount:montant,date:new Date().toLocaleString()});
  localStorage.setItem("currentUser",JSON.stringify(currentUser));
  alert("Retrait effectué !");
}

// ==== Déconnexion ====
document.getElementById("logout-btn").onclick = ()=>{
  currentUser=null;
  localStorage.setItem("currentUser",JSON.stringify(currentUser));
  dashboard.style.display="none";
  authContainer.style.display="block";
}<script src="script.js"></script>
