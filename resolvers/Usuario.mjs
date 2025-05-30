import Usuario from "../models/usuario.mjs";

async function usuarios() {
  try {
    return await Usuario.find({});
  } catch {
    console.error("Error al obtener los usuarios:", error);
    throw new Error("No se pudieron obtener los usuarios");
  }
}

async function usuariosById(parent, args) {
  try {
    return await Usuario.findOne({id: args.usuarioId});
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw new Error("No se pudo encontrar el usuario con el ID proporcionado");
  }
}

async function usuarioByIdBd(parent, args) {
    try {
    return await Usuario.findById(args.id);
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw new Error("No se pudo encontrar el usuario con el ID proporcionado");
  }
}

async function usuariosByTipo(parent, args) {
  try {
    return await Usuario.find({ tipo: args.tipo });
  } catch (error) {
    console.error("Error al obtener los usuarios por tipo:", error);
    throw new Error("No se pudieron obtener los usuarios por tipo");
  }
}

async function usuariobyName(parent, args) {
    try {
        return await Usuario.findOne({ nombre: args.nombre });
    } catch (error) {
        console.error("Error al obtener el usuario por nombre:", error);
        throw new Error("No se pudo encontrar el usuario con el nombre proporcionado");
    }
}

async function agregarUsuario(parent, args) {
  try {
    const { nombre, email, tipo } = args;
    const nuevoUsuario = new Usuario({
        nombre,
        email,
        tipo,
      prestamos: [],
    });
    console.log("Nuevo usuario:", nuevoUsuario);
    await nuevoUsuario.save();
    return nuevoUsuario;
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    throw new Error("No se pudo agregar el usuario");
  }
}

async function modificarUsuario(parent, args) {
  try {
    const usuario = await Usuario.find((u) => u.id === args.usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    usuario.nombre = args.nombre;
    usuario.email = args.email;
    usuario.tipo = args.tipo;
    return await usuario.save();
  } catch (error) {
    console.error("Error al modificar el usuario:", error);
    throw new Error("No se pudo modificar el usuario");
  }
}

async function eliminarUsuario(parent, args) {
  try {
    const usuario = await Usuario.find((u) => u.id === args.id);
    return await usuario.deleteOne();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
  }
}

export {
  usuarios,
  usuariosById,
  usuarioByIdBd,
  usuariosByTipo,
  agregarUsuario,
  modificarUsuario,
  eliminarUsuario,
  usuariobyName
};
