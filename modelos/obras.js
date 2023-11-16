class obras {
    constructor(id, data) {
      this.bandera = 0;
      this.id = id;
      this.nombre = data.nombre;
      this.artista = data.artista;
      this.descripcion = data.descripcion;
      this.anio = data.anio;
      this.foto = data.foto;
      this.calificacion = data.calificacion || null; // Nuevo campo para la calificación
    }
    set id(id) {
      if (id != null) id.length > 0 ? (this._id = id) : (this.bandera = 1);
    }
    set nombre(nombre) {
      nombre.length > 0 ? (this._nombre = nombre) : (this.bandera = 1);
    }
    set artista(artista) {
      artista.length > 0 ? (this._artista = artista) : (this.bandera = 1);
    }
    set foto(foto) {
      foto.length > 0 ? (this._foto = foto) : (this.bandera = 1);
    }
    set descripcion(descripcion) {
      descripcion.length > 0 ? (this._descripcion = descripcion) : (this.bandera = 1);
    }
    set anio(anio) {
      anio.length > 0 ? (this._anio = anio) : (this.bandera = 1);
    }
    set calificacion(calificacion) {
      calificacion.length > 0 ? (this._calificacion = calificacion) : (this.bandera = 1);
    }
    get id() {
      return this._id;
    }
    get nombre() {
      return this._nombre;
    }
    get artista() {
      return this._artista;
    }
    get foto() {
      return this._foto;
    }
    get descripcion() {
      return this._descripcion;
    }
    get anio() {
      return this._anio;
    }

    get calificacion() {
      return this._calificacion;
    }
   obtenerDatos() {
      if (this._id != null) {
        return {
          id: this.id,
          nombre: this.nombre,
          artista: this.artista,
          foto: this.foto,
          anio: this.anio,
          descripcion: this.descripcion,
          calificacion: this.calificacion,
        };
      } else {
        return {
          nombre: this.nombre,
          artista: this.artista,
          foto: this.foto,
          anio: this.anio,
          descripcion: this.descripcion,
          calificacion: this.calificacion,
        };
      }
    }
  }
  
  module.exports = obras;
  