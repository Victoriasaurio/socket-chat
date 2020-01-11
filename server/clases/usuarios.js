class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };

        this.personas.push(persona); //Agrega la persona al arreglo
        return this.personas; //Personas en el chat
    }

    getPersona(id) {
        //Buscando persona por el ID con la propiedad Filter
        let persona = this.personas.filter(persona => persona.id === id)[0]; //Filter regresa un arreglo
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas;
        return personasEnSala;
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => persona.id != id); //Retorna un nuevo arreglo de personas activas

        return personaBorrada; //Muestra a la persona borrada
    }
}

module.exports = {
    Usuarios
}