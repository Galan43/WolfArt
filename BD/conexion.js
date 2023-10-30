var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});
var micuenta=admin.firestore();
var conexion=micuenta.collection("usuarios");
var conexionObra=micuenta.collection("obras");
var conexionComen=micuenta.collection("comentarios");


module.exports={
    conexion,
    conexionObra,
    conexionComen,
}