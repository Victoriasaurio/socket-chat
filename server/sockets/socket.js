const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        //Validación sencilla de los datos 
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        //Une cliente con la sala que le corresponde
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        //Lista las personas conectados o cuando salen del chat
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    //Enviar mensaje a todos los usuarios || obviando el nombre
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje); //Dispara el mensaje
    });

    //Evita que el ID del usuario se duplique
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        //Mensaje que muestra el nombre del usuario que se desconectó
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));
        client.broadcast.to(personaBorrada.sala).emit('listapersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //Mensajes privados || para = id de usuario a enviar mensaje
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});