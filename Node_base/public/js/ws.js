const IP = "ws://localhost:3000";
const socket = io(IP);

socket.on("connect", () => {
    console.log("Me conecté a WS");
});

socket.on("server-message", data => {
    console.log("Me llego del servidor", data);
});


/*
io.on("connection", socket => {

    socket.join("some room");
    
    io.to("some room").emit("server-message", { mensaje: data.mensaje, user: req.session.Dato });
});*/
