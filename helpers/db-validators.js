const categoria = require("../models/categoria");
const producto = require("../models/producto");
const role = require("../models/role");
const usuario = require("../models/usuario");

const esRoleValido = async(rol = '') => {
    const existeRol = await role.findOne({ rol });
    if ( !existeRol ) {
      throw new Error(` El rol ${ rol } no está registrado `);
    };
}

const emailExiste = async(correo = '') => {
  const existeEmail = await usuario.findOne({ correo });
  if ( existeEmail ) {
    throw new Error(` El correo ${ correo } ya está registrado`);
  }
}

const existeUsuarioPorId = async(id = '') => {
  const existeId = await usuario.findById(id);
  if ( !existeId ) {
    throw new Error(` El id ${ id } no existe`);
  }
}

const existeCategoriaPorId = async(id = '') => {
  const existeId = await categoria.findById(id);
  if ( !existeId ) {
    throw new Error(` La categoría con id ${ id } no existe`);
  }
}

const existeProductoPorId = async(id = '') => {
  const existeId = await producto.findById(id);
  if ( !existeId ) {
    throw new Error(` El producto con id ${ id } no existe`);
  }
}

// validar colecciones permitidas 
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(` La colección ${ coleccion } no es permitida, ${colecciones}`);
  }

  return true;

}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}