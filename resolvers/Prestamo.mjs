import Prestamo from '../models/prestamos.mjs'
import Usuario from "../models/usuario.mjs";
import Item from "../models/itemBiblioteca.mjs";



async function prestamos() {
    try{

        return await Prestamo.find({})
    }catch(error) {
        console.error("Error fetching prestamos:", error);
        throw new Error("Error fetching prestamos");
    }
}

async function prestamosById(parent, args) {
    try{
        return await Prestamo.findById(args.id);
    }catch(error) {
        console.error("Error fetching prestamo by ID:", error);
        throw new Error("Error fetching prestamo by ID");
    }
}

async function prestamosByEstado(parent, args) {
    try{
        return await Prestamo.find({ estado: args.estado });
    }catch(error) {
        console.error("Error fetching prestamos by estado:", error);
        throw new Error("Error fetching prestamos by estado");
    }
}

async function prestamosByItem(parent, args) {
    try{
        return await Prestamo.find({ "item.id": args.id });
    }catch(error) {
        console.error("Error fetching prestamos by item:", error);
        throw new Error("Error fetching prestamos by item");
    }
}

async function prestamosByUsuario(parent, args) {
    try{
        return await Prestamo.find({ "usuario.id": args.id });
    }catch(error) {
        console.error("Error fetching prestamos by usuario:", error);
        throw new Error("Error fetching prestamos by usuario");
    }
}




async function modificarPrestamo(parent, args) {
    try{
        const prestamo = await Prestamo.findById(args.id);
        if (!prestamo) throw new Error("Prestamo no encontrado");
        prestamo.fechaDevolucion = args.fechaDevolucion;
        prestamo.estado = args.estado;;
        prestamo.fechaLimite = args.fechaLimite;
        prestamo.item = args.item;
        prestamo.usuario = args.usuario;
        prestamo.fechaPrestamo = args.fechaPrestamo;
        prestamo.estado = args.estado;
        return await prestamo.save();
    }catch(error) {
        console.error("Error al modificar el prestamo:", error);
        throw new Error("No se pudo modificar el prestamo");
    }
}

async function modificarEstadoPrestamo(parent, args) {
    try{
        const prestamo = await Prestamo.findById(args.id);
        if (!prestamo) throw new Error("Prestamo no encontrado");
        prestamo.estado = args.estado;
        return await prestamo.save();
    }catch(error) {
        console.error("Error al modificar el estado del prestamo:", error);
        throw new Error("No se pudo modificar el estado del prestamo");
    }
}





async function crearPrestamo(parent, args) {
    try{
        const item = await Item.findById(args.itemId);
        if (!item) throw new Error("Item no encontrado");
        const usuario = await Usuario.findById(args.usuarioId);
        if (!usuario) throw new Error("Usuario no encontrado");

        const prestamo = new Prestamo({
            fechaPrestamo: new Date(),
            usuario: usuario._id,
            item: item._id,
            estado: 'ACTIVO',
        });
        item.prestamo = prestamo._id;
        usuario.prestamos.push(prestamo._id);
        return await prestamo.save();

    }catch(error) {
        console.error("Error al crear el prestamo:", error);
        throw new Error("No se pudo crear el prestamo");
    }
}

async function devolverPrestamo(parent, args) {
    try{
        const prestamo = await Prestamo.findById(args.id);
        if (!prestamo) throw new Error("Prestamo no encontrado");

        if (prestamo.estado === 'DEVUELTO') throw new Error("El prestamo ya fue devuelto");
        prestamo.fechaDevolucion = new Date();
        prestamo.estado = 'DEVUELTO';     

        return await prestamo.save();
    } catch(error) {
        console.error("Error al devolver el prestamo:", error);
        throw new Error("No se pudo devolver el prestamo");
    }
}

async function eliminarPrestamo(parent, args) {
    try{
        const prestamo = await Prestamo.findById(args.id);
        if (!prestamo) throw new Error("Prestamo no encontrado");

        const item = Item.findById(prestamo.item.id);
        if (item) {
            item.prestamo = null;
        }
        
        const usuario = Usuario.findById(prestamo.usuario.id);
        if (usuario) {
            const index = usuario.prestamos.indexOf(prestamo.id);
            if (index > -1) {
                usuario.prestamos.splice(index, 1);
            }
        }
        
        return await prestamo.deleteOne();

    }catch(error){
        console.error("Error al eliminar el prestamo:", error);
        throw new Error("No se pudo eliminar el prestamo");
    }
}




async function marcarPrestamoComoPerdido(parent, args) {
    try{
        const prestamo = await Prestamo.findById(args.id);
        if (!prestamo) throw new Error("Prestamo no encontrado");
        if (prestamo.estado === 'PERDIDO') throw new Error("El prestamo ya está marcado como perdido");

        prestamo.estado = 'PERDIDO';
        return await prestamo.save();
    }catch(error) {
        console.error("Error al marcar el prestamo como perdido:", error);
        throw new Error("No se pudo marcar el prestamo como perdido");
    }
}


export {
    prestamos,
    prestamosById,
    prestamosByEstado,
    prestamosByItem,
    prestamosByUsuario,
    modificarPrestamo,
    modificarEstadoPrestamo,
    crearPrestamo,
    devolverPrestamo,
    eliminarPrestamo,
    marcarPrestamoComoPerdido
};


