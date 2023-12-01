class Comentario {
    constructor(id, data) {
        this.bandera = 0;
        this.id = id;
        this.usuario = data.usuario;
        this.comentario = data.comentario;
        this.obra = data.obra;
    }

    set id(id) {
        if (id != null) id.length > 0 ? (this._id = id) : (this.bandera = 1);
    }
    set usuario(usuario) {
        if (usuario != null) usuario.length > 0 ? (this._usuario = usuario) : (this.bandera = 1);
    }
    set comentario(comentario) {
        if (comentario != null) comentario.length > 0 ? (this._comentario = comentario) : (this.bandera = 1);
    }
    set obra(obra) {
        if (obra != null) obra.length > 0 ? (this._obra = obra) : (this.bandera = 1);
    }
    get id() {
        return this._id;
    }
    get usuario() {
        return this._usuario;
    }
    get comentario() {
        return this._comentario;
    }
    get obra() {
        return this._obra;
    }

    get obtenerDatos() {
        if (this._id != null) {
            return {
                id: this.id,
                usuario: this.usuario,
                comentario: this.comentario,
                obra: this.obra,
            };
        } else {
            return {
                usuario: this.usuario,
                comentario: this.comentario,
                obra: this.obra,
 
            };
        }
    }
}

module.exports = Comentario;
