import {ApolloServer} from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import {
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
} from "./resolvers/index.mjs";


const typeDefs = `#graphql

enum EstadoPrestamo {
    ACTIVO
    DEVUELTO
    RETRASADO
    PERDIDO
}

enum CategoriaItem {
    LIBRO
    REVISTA
    AUDIOLIBRO
    EBOOK
}

enum TipoUsuario {
    ESTUDIANTE
    PROFESOR
    INVITADO
}


interface ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categorias: CategoriaItem!
    prestamo: Prestamo
}


type Libro implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categorias: CategoriaItem!
    isbn: String!
    autores: [Autor!]!
    cantidadDisponible: Int!
}

type Revista implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categorias: CategoriaItem!
    issn: String!
    editorial: String!
    numero: Int!
}

type Audiolibro implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categorias: CategoriaItem!
    narrador: String!
    duracion: Int!  # Duración en minutos
}

type Ebook implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categorias: CategoriaItem!
    formato: String!  # Ejemplo: PDF, EPUB
    tamanoArchivo: Int!  # Tamaño en KB
}

type Usuario {
    id: ID!
    nombre: String!
    email: String!
    tipo: TipoUsuario!
    prestamos: [Prestamo!]!
}

type Prestamo {
    id: ID!
    item: ItemBiblioteca!  
    usuario: Usuario!
    fechaPrestamo: String!
    fechaDevolucion: String
    fechaLimite: String!
    estado: EstadoPrestamo!
}

# Queries
type Query {
    items: [ItemBiblioteca!]!  # Retorna libros y revistas
    itemById(id: ID!): ItemBiblioteca
    itemsByCategoria(categoria: CategoriaItem!): [ItemBiblioteca!]!
    prestamos: [Prestamo!]!
    prestamosByEstado(estado: EstadoPrestamo!): [Prestamo!]!
    prestamosByItem(id: ID!): [Prestamo!]!
    prestamosByUsuario(id: ID!): [Prestamo!]!
    usuarios: [Usuario!]!
    usuarioById(id: ID!): Usuario
    usuariosByTipo(tipo: TipoUsuario!): [Usuario!]!
    usuariosByEstado(estado: EstadoPrestamo!): [Usuario!]!
    


}

# Mutations
type Mutation {

    agregarUsuario(
        nombre: String!
        email: String!
        tipo: TipoUsuario!
    ): Usuario!
    agregarItem(
        titulo: String!
        fechaPublicacion: String!
        categorias: [CategoriaItem!]!
        isbn: String
        issn: String
        editorial: String
        numero: Int
    ): ItemBiblioteca!

    agregarLibro(
        titulo: String!
        fechaPublicacion: String!
        categorias: [CategoriaItem!]!
        isbn: String!
        autores: [Autor!]!
        cantidadDisponible: Int!
    ): Libro!

    agregarRevista(
        titulo: String!
        fechaPublicacion: String!
        categorias: [CategoriaItem!]!
        issn: String!
        editorial: String!
        numero: Int!
    ): Revista!

    modificarUsuario(
        usuarioId: ID!
        nombre: String
        email: String
        tipo: TipoUsuario
    ): Usuario!
    modificarItem(
        itemId: ID!
        titulo: String
        fechaPublicacion: String
        categorias: [CategoriaItem!]
        isbn: String
        issn: String
        editorial: String
        numero: Int
    ): ItemBiblioteca!
    modificarPrestamo(
        prestamoId: ID!
        itemId: ID
        usuarioId: ID
        fechaDevolucion: String
        estado: EstadoPrestamo
    ): Prestamo!
    modificarEstadoPrestamo(
        prestamoId: ID!
        estado: EstadoPrestamo!
    ): Prestamo!
    modificarCantidadDisponible(
        itemId: ID!
        cantidad: Int!
    ): ItemBiblioteca!
    

    crearPrestamo(
        itemId: ID!
        usuarioId: ID!
    ): Prestamo!
    devolverPrestamo(
        prestamoId: ID!
    ): Prestamo!
    marcarPrestamoComoPerdido(
        prestamoId: ID!
    ): Prestamo!
    eliminarPrestamo(
        prestamoId: ID!
    ): Prestamo!
    eliminarUsuario(
        usuarioId: ID!
    ): Usuario!
    eliminarItem(
        itemId: ID!
    ): ItemBiblioteca!
    

}
    
`

const resolvers = {
    Query: {
        items: items,
        itemById: itemById,
        itemsByCategoria: itemsByCategory,
        itemByNombre: itemByNombre,
        prestamos: prestamos,
        prestamosByEstado: prestamosByEstado,
        prestamosByItem: prestamosByItem,
        prestamosByUsuario: prestamosByUsuario,
        usuarios: usuarios,
        usuarioById: usuariosById,
        usuariosByTipo: usuariosByTipo,
        usuariosByEstado: usuariosByEstado,
    },
    Mutation: {
        agregarUsuario: agregarUsuario,
        agregarItem: agregarItem,
        eliminarItem: eliminarItem,
        modificarUsuario: modificarUsuario,
        modificarItem: modificarItem,
        modificarPrestamo: modificarPrestamo,
        modificarEstadoPrestamo: modificarEstadoPrestamo,
        modificarCantidadDisponible: modificarCantidadDisponible,
        agregarLibro: agregarLibro,
        agregarRevista: agregarRevista,
        crearPrestamo: crearPrestamo,
        devolverPrestamo: devolverPrestamo,
        eliminarPrestamo: eliminarPrestamo,
        eliminarUsuario: eliminarUsuario,
        marcarPrestamoComoPerdido: marcarPrestamoComoPerdido
    }
    
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const {url} = await startStandaloneServer(server, {
    port: 4000
})

console.log(`🚀  Server ready at: ${url}`)