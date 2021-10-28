/**
 * Clase mensaje, para generar un mensaje
 */
class Mensaje {
  constructor(usuario, texto, fecha) {
    this.texto = texto;
    this.usuario = usuario;
    if (fecha == null) {
      this.fecha = new Date();
    } else {
      this.fecha = new Date(Date.parse(fecha));
    }
  }

  toString() {

    return this.usuario + ": " + this.texto + "   ---" + this.fecha.toDateString();
  }

  getTexto() {
    return this.texto
  }

  getUsuario() {
    return this.usuario
  }

  getFecha() {
    return this.fecha;
  }
}

/**
 * Clase chat, para generar un chat
 */
class Chat {
  constructor(nombreChat) {
    this.nombreChat = nombreChat;
    this.mensajes = [];
  }

  getNombreChat() {
    return this.nombreChat;
  }

  setNombreChat(nombreChat) {
    this.nombreChat = nombreChat;
  }

  addMensajeChat(mensaje) {
    this.mensajes.push(mensaje);
  }

  getMensajesChat() {
    return this.mensajes;
  }
}

class Usuario {
  constructor(nombre, conectado) {
    this.nombre = nombre;
    this.conectado = conectado;
  }

  getNombre() {
    return this.nombre;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }

  isConectado() {
    return this.conectado;
  }

  setConectado(conectado) {
    this.conectado = conectado;
  }
}

/*
* EventListener para la tecla enter
*/
window.addEventListener("keypress", function (event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    enviarMensaje(user, document.getElementById("texto").value.replace(/\n*$/, ""))
  }
});
/*
 * Declaracion de variables
 */

let chats = [];
let usuarios = [];
let user = setUsuario();
let chatActivo = null;
/*
 * Funciones
 *
 */
function setUsuario() {
  let user = prompt("Introduce tu nombre");
  if (user === null || user.replace(/\s*$/,"") === "") {
    setUsuario();
  } else {
    alert("Bienvenido " + user + "!!!");
    usuarios.push(new Usuario(user, true));
  }
  return user;
}

function enviarMensaje(usuario, texto) {
  if (usuario === "" && texto === "") {
    alert("Inserta el usuario y el mensaje a enviar");
  } else if (usuario === "") {
    alert("Inserta el usuario");
  } else if (texto === "") {
    alert("Escribe un mensaje");
  } else {
    let mensaje = new Mensaje(usuario, texto);
    chatActivo.addMensajeChat(mensaje);
    document.getElementById("mensajes").innerHTML += "<pre class = 'mensaje izquierda texto'><b>" +
      mensaje.getUsuario() + ": </b>" + mensaje.getTexto() + "<span class='mensaje fecha'> Enviado el: " + mensaje.getFecha().toLocaleString() + "</span></pre>";
  }
  document.getElementById("texto").value = "";
}

function cambiarChat(nombreChat) {
  document.getElementById("chat_seleccionado").innerText = nombreChat;
  document.getElementById("mensajes").innerHTML = "";
  chats.forEach(function (valor, indice) {
    if (valor.getNombreChat() === nombreChat) {
      chatActivo = chats[indice];
    }
  });
  chatActivo.getMensajesChat().forEach(function (valor, indice) {
    let mensaje = valor;
    document.getElementById("mensajes").innerHTML += "<pre class = 'mensaje izquierda texto'><b>" +
      mensaje.getUsuario() + ": </b>" + mensaje.getTexto() + "<span class='mensaje fecha'> Enviado el: " + mensaje.getFecha().toLocaleString() + "</span></pre>";
  });

}

function devolverChats() {
  document.getElementById("listado_chats").innerHTML = ""
  if (chats != null) {
    chats.forEach(function (valor, indice) {
      document.getElementById("listado_chats").innerHTML += "<li id='" + valor.getNombreChat() + "' class='enlace_chat' onclick=cambiarChat('" + valor.getNombreChat() + "')>" + valor.getNombreChat() + "</li>"
    });
  }

}

function usuariosConectados() {
  usuarios.sort((o1, o2) => {
    if (o1.nombre.toLowerCase() < o2.nombre.toLowerCase()) {
      return -1
    } else if (o1.usuario > o2.usuario) {
      return 1
    } else {
      return 0
    }
  });
  document.getElementById("listado_usuarios").innerHTML = ""
  usuarios.forEach(function (valor, indice) {
    document.getElementById("listado_usuarios").innerHTML += "<li id='" + valor.getNombre() + "' class='usuarios'>" + valor.getNombre() + "</li>"
  });
}

function mostrarChats() {
  document.getElementById("chats").style.visibility = "visible";
  document.getElementById("mostrar_chat").style.visibility = "hidden";
  document.getElementById("cerrar_pestana_chats").style.visibility = "visible";
  cerrarUsuarios();
}

function cerrarChats() {
  document.getElementById("chats").style.visibility = "hidden";
  document.getElementById("mostrar_chat").style.visibility = "visible";
  document.getElementById("cerrar_pestana_chats").style.visibility = "hidden";
}

function mostrarUsuarios() {
  document.getElementById("usuarios").style.visibility = "visible";
  document.getElementById("mostrar_usuarios").style.visibility = "hidden";
  document.getElementById("cerrar_pestana_usuarios").style.visibility = "visible";
  cerrarChats();
}

function cerrarUsuarios() {
  document.getElementById("usuarios").style.visibility = "hidden";
  document.getElementById("mostrar_usuarios").style.visibility = "visible";
  document.getElementById("cerrar_pestana_usuarios").style.visibility = "hidden";
}

function leerJSONMensajes() {
  chats = []
  let url = "./js/mensajes.json";
  let jsonFile = new XMLHttpRequest();
  jsonFile.open("GET", url, true);
  jsonFile.send();
  jsonFile.onreadystatechange = function () {
    if (jsonFile.readyState === 4 && jsonFile.status === 200) {
      let jsonChats = JSON.parse(jsonFile.responseText);
      jsonChats.forEach(function (valor, indice) {
        let chat = new Chat(valor["nombreChat"]);
        let arrayMensajes = valor["mensajes"];
        arrayMensajes.forEach(function (valor, indice) {
          chat.addMensajeChat(new Mensaje(valor["usuario"], valor["texto"], valor["fecha"],))
        });
        chats.push(chat);
      });
      devolverChats();
      if(chatActivo == null){
        chatActivo = chats[0];
      }
      cambiarChat(chatActivo.getNombreChat())
    }
  }

}

function leerJSONUsuarios() {
  usuarios = []
  let url = "./js/usuarios.json";
  let jsonFile = new XMLHttpRequest();
  jsonFile.open("GET", url, true);
  jsonFile.send();

  jsonFile.onreadystatechange = function () {
    if (jsonFile.readyState === 4 && jsonFile.status === 200) {
      let jsonUsuarios = JSON.parse(jsonFile.responseText);
      jsonUsuarios.forEach(function (valor, indice) {

        let usuario = new Usuario(valor["usuario"], valor["conectado"]);
        if (usuario.isConectado()) {
          usuarios.push(usuario);
        }
      });
      usuariosConectados();
    }
  }

}

/*
 * Lectura ficheros
*/

leerJSONMensajes()
leerJSONUsuarios()

/*
 *Estas dos lineas de abajo llaman a los metodos de leer JSON
 */
setInterval(leerJSONUsuarios, 1000);
//setInterval(leerJSONMensajes, 1000);




