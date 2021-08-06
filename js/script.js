let usuario;
let mensagens = [];
function perguntarNome(){
 usuario = prompt("Digite o nome de usuario:")
}

perguntarNome();
entrarSala();

function entrarSala(){
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",{name:usuario});
    promisse.catch(error);
    promisse.then(enviarStatus);
    promisse.then(buscarMensagens);
}

function error(resposta){
    if(resposta.reponse.status==400){
        perguntarNome();
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
    else if(mensagens[i].type === "private_message"){
        divMsg.innerHTML += ` <div class="msg private"><div class="hora">${mensagens[i].time}</div> <div class="nome"><strong>${mensagens[i].from}</strong>reservadamente para ${mensagens[i].to}:</div>${mensagens[i].text}</div>`
    }
}
   divMsg.lastChild.scrollIntoView();
   enviarStatus();
   recarregarMsg();
}


function enviarMsg(){
    const msg = document.querySelector(".msg-enviar").value
    const mensagem = {
        from: usuario,
        to: "Todos",
        text: msg,
        type: "message",
    }
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages",mensagem);
    promisse.then(buscarMensagens);
}
