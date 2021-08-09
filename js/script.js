let usuario;
let mensagens = [];
let destinatario = "Todos";
let type = "message";
function perguntarNome(){
 usuario = prompt("Digite o nome de usuario:")
}

perguntarNome();
entrarSala();

function entrarSala(){
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",{name:usuario});
    promisse.then(enviarStatus);
    promisse.then(buscarMensagens);
    promisse.then(recarregarMsg);
    promisse.catch(tratarError);
}

function tratarError(resposta){
    status_code = resposta.response.status;
    if(status_code === 400){
        usuario = prompt("Nome de usuario em uso, digite outro:");
        entrarSala();
    }
}

function enviarStatus(){
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",{name:usuario});
    setInterval(function(){
    promisse.then();
    },5000)

}

function recarregarMsg(){
    setInterval(function(){
        buscarMensagens();
        console.log("recarreguei")
    },3000);
}

function buscarMensagens(){
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages")
    promisse.then(listarMsg);
}


function listarMsg(resposta){
    const divMsg = document.querySelector(".chat");
    mensagens = resposta.data;
    divMsg.innerHTML = "";
   for(let i = 0; i < mensagens.length;i++){
    if(mensagens[i].type === "message"){
        divMsg.innerHTML += ` <div class="msg"><div class="hora">${mensagens[i].time} </div> <div class="nome"><strong>${mensagens[i].from} </strong>para<strong> ${mensagens[i].to}: </strong></div>${mensagens[i].text}</div>`
    }
    else if(mensagens[i].type === "status"){
        divMsg.innerHTML += ` <div class="msg entrar-sair"><div class="hora">${mensagens[i].time}</div> <div class="nome"><strong>${mensagens[i].from}</strong></div>${mensagens[i].text}</div>`
    }
    else if(mensagens[i].type === "private_message" && mensagens[i].to === usuario || mensagens[i].from === usuario){
        divMsg.innerHTML += ` <div class="msg private"><div class="hora">${mensagens[i].time}</div> <div class="nome"><strong>${mensagens[i].from} </strong>reservadamente para ${mensagens[i].to}:</div>${mensagens[i].text}</div>`
    }
}
   divMsg.lastChild.scrollIntoView();
   enviarStatus();
}


function enviarMsg(){
    const msg = document.querySelector(".msg-enviar").value
        const mensagem = {
            from: usuario,
            to: destinatario,
            text: msg,
            type: type,
        }
        const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages",mensagem);
        promisse.then(buscarMensagens);
        mensagens.push(mensagem);
        promisse.catch(errorServer);
}

function errorServer(){
    window.location.reload();
}


function abrirLateral(){
    const menuLat = document.querySelector(".mascara");
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
    promisse.then(listarParticipants);
    if (menuLat.classList.contains("hide")){
        menuLat.classList.remove("hide");
    }
}


function fecharMenu(){
    const menuLat = document.querySelector(".mascara");
    menuLat.classList.add("hide");

}


function listarParticipants(resposta){
     let participantes = resposta.data;
     let listaPart = document.querySelector(".participants");
    for(let i = 0;i < participantes.length;i++){
        listaPart.innerHTML += `<li onclick="selecionarDest(this);"><div class="nome-icone"><ion-icon name="people"></ion-icon><span>${participantes[i].name}</span></div><ion-icon name="checkmark" class="check"></ion-icon></li>`
    }

}

function selecionarDest(dest){
    const selecionado = document.querySelector(".selecionado");
    console.log(selecionado);
    if (selecionado !== null){
        selecionado.classList.remove("selecionado");
    }
    dest.classList.add("selecionado");
    destinatario = dest.querySelector("span").innerHTML;
}

function selecionarReservado(){
    const publico = document.querySelector(".public");
    const private = document.querySelector(".private");
    publico.classList.remove("selecionado");
    private.classList.add("selecionado");
    type = "private_message";
}

function selecionarPublico(){
    const publico = document.querySelector(".public");
    const private = document.querySelector(".private");
    publico.classList.add("selecionado");
    private.classList.remove("selecionado");
    type = "message";
}