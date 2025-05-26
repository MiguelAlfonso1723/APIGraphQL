import data from '../util/connect-db.mjs';




function prestamos() {
    return data.prestamos;
}

function prestamosByEstado(parent, args) {
    return data.prestamos.filter(p => p.estado === args.estado);
}

function prestamosByItem(parent, args) {
    return data.prestamos.filter(p => p.item.id === args.id);
}

function prestamosByUsuario(parent, args) {
    return data.prestamos.filter(p => p.usuario.id === args.id);
}

function usuarios() {
    return data.usuarios;
}

function usuariosById(parent, args) { 
    return data.usuarios.find(u => u.id === args.id);
}

function usuariosByTipo(parent, args) {
    return data.usuarios.filter(u => u.tipo === args.tipo);
}

function usuariosByEstado(parent, args) {
    //return data.usuarios.filter(u => u.estado === args.estado);
}

function agregarUsuario(parent, args) {
    const nuevoUsuario = {
        id: `usuario-${data.usuarios.length + 1}`,
        nombre: args.nombre,
        email: args.email,
        tipo: args.tipo,
        prestamos: []
    };
    data.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
}


function modificarUsuario(parent, args) {
    const usuario = data.usuarios.find(u => u.id === args.id);
    if (!usuario) throw new Error("Usuario no encontrado");

    if (args.nombre) usuario.nombre = args.nombre;
    if (args.email) usuario.email = args.email;
    if (args.tipo) usuario.tipo = args.tipo;

    return usuario;
}

function modificarItem(parent, args) {
    const item = data.libros.find(l => l.id === args.id) || 
                 data.revistas.find(r => r.id === args.id);
    if (!item) throw new Error("Item no encontrado");

    if (args.titulo) item.titulo = args.titulo;
    if (args.fechaPublicacion) item.fechaPublicacion = args.fechaPublicacion;
    if (args.categorias) item.categorias = args.categorias;
    if (args.isbn) item.isbn = args.isbn;
    if (args.issn) item.issn = args.issn;
    if (args.editorial) item.editorial = args.editorial;
    if (args.numero) item.numero = args.numero;

    return item;
}

function modificarPrestamo(parent, args) {
    const prestamo = data.prestamos.find(p => p.id === args.id);
    if (!prestamo) throw new Error("Prestamo no encontrado");

    if (args.estado) prestamo.estado = args.estado;
    if (args.fechaDevolucion) prestamo.fechaDevolucion = args.fechaDevolucion;

    return prestamo;
}

function modificarEstadoPrestamo(parent, args) {
    const prestamo = data.prestamos.find(p => p.id === args.id);
    if (!prestamo) throw new Error("Prestamo no encontrado");

    if (args.estado) prestamo.estado = args.estado;

    return prestamo;
}

function modificarCantidadDisponible(parent, args) {
    const item = data.libros.find(l => l.id === args.id) || 
                 data.revistas.find(r => r.id === args.id);
    if (!item) throw new Error("Item no encontrado");

    if (args.cantidadDisponible) item.cantidadDisponible = args.cantidadDisponible;

    return item;
}

function agregarLibro(parent, args) {
    const nuevoLibro = {
        id: `libro-${data.libros.length + 1}`,
        titulo: args.titulo,
        fechaPublicacion: args.fechaPublicacion,
        categorias: args.categorias,
        isbn: args.isbn,
        autores: args.autores,
        cantidadDisponible: args.cantidadDisponible
    };
    data.libros.push(nuevoLibro);
    return nuevoLibro;
}

function agregarRevista(parent, args) {
    const nuevaRevista = {
        id: `revista-${data.revistas.length + 1}`,
        titulo: args.titulo,
        fechaPublicacion: args.fechaPublicacion,
        categorias: args.categorias,
        issn: args.issn,
        editorial: args.editorial,
        numero: args.numero
    };
    data.revistas.push(nuevaRevista);
    return nuevaRevista;
}

function modificarCantidadDisponible(parent, args) {
    const item = data.libros.find(l => l.id === args.itemId) || 
                 data.revistas.find(r => r.id === args.itemId);
    if (!item) throw new Error("Item no encontrado");

    if (args.cantidadDisponible) item.cantidadDisponible += args.cantidadDisponible;

    return item;
}

function crearPrestamo(parent, args) {
    const item = data.libros.find(l => l.id === args.itemId) || 
                 data.revistas.find(r => r.id === args.itemId);
    if (!item) throw new Error("Item no encontrado");
    if (item.cantidadDisponible <= 0) throw new Error("No hay disponibilidad del item");
    item.cantidadDisponible -= 1;
    
    const usuario = data.usuarios.find(u => u.id === args.usuarioId);

    if (!usuario) throw new Error("Usuario no encontrado");
    const nuevoPrestamo = {
        id: `prestamo-${data.prestamos.length + 1}`,
        item: item,
        usuario: usuario,
        fechaPrestamo: new Date().toISOString(),
        fechaDevolucion: args.fechaDevolucion,
        estado: 'ACTIVO'
    };
    data.prestamos.push(nuevoPrestamo);
    return nuevoPrestamo;
}

function devolverPrestamo(parent, args) {
    const prestamo = data.prestamos.find(p => p.id === args.id);
    if (!prestamo) throw new Error("Prestamo no encontrado");
    if (prestamo.estado === 'DEVUELTO') throw new Error("El prestamo ya fue devuelto");

    prestamo.estado = 'DEVUELTO';
    prestamo.fechaDevolucion = new Date().toISOString();

    const item = data.libros.find(l => l.id === prestamo.item.id) || 
                 data.revistas.find(r => r.id === prestamo.item.id);
    if (item) item.cantidadDisponible += 1;

    return prestamo;
}

function eliminarPrestamo(parent, args) {
    const prestamoIndex = data.prestamos.findIndex(p => p.id === args.id);
    if (prestamoIndex === -1) throw new Error("Prestamo no encontrado");

    const prestamo = data.prestamos[prestamoIndex];
    data.prestamos.splice(prestamoIndex, 1);

    const item = data.libros.find(l => l.id === prestamo.item.id) || 
                 data.revistas.find(r => r.id === prestamo.item.id);
    if (item) item.cantidadDisponible += 1;

    return prestamo;
}

function eliminarUsuario(parent, args) {
    const usuarioIndex = data.usuarios.findIndex(u => u.id === args.id);
    if (usuarioIndex === -1) throw new Error("Usuario no encontrado");

    const usuario = data.usuarios[usuarioIndex];
    data.usuarios.splice(usuarioIndex, 1);

    return usuario;
}



function marcarPrestamoComoPerdido(parent, args) {
    const prestamo = data.prestamos.find(p => p.id === args.id);
    if (!prestamo) throw new Error("Prestamo no encontrado");
    if (prestamo.estado === 'PERDIDO') throw new Error("El prestamo ya fue marcado como perdido");

    prestamo.estado = 'PERDIDO';
    const item = data.libros.find(l => l.id === prestamo.item.id) || 
                 data.revistas.find(r => r.id === prestamo.item.id);
    if (item) item.cantidadDisponible -= 1;

    return prestamo;
}





export{
    ItemBiblioteca,
    items,
    itemById,
    itemsByCategory,
    prestamos,
    prestamosByEstado,
    prestamosByItem,
    prestamosByUsuario,
    usuarios,
    usuariosById,
    usuariosByTipo,
    usuariosByEstado,
    agregarUsuario,
    agregarItem,
    modificarUsuario,
    modificarItem,
    modificarPrestamo,
    modificarEstadoPrestamo,
    modificarCantidadDisponible,
    agregarLibro,
    agregarRevista,
    crearPrestamo,
    devolverPrestamo,
    eliminarPrestamo,
    eliminarUsuario,
    eliminarItem,
    marcarPrestamoComoPerdido
}