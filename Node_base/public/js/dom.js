
//Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick


function getMessageContent() {
  return document.getElementById("mensaje").value
};

socket.on("connect", () => {
    console.log("Me conecté a WS");
});
