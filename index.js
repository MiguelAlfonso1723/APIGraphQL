import {ApolloServer} from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import{
    items,
    itemById,
    itemsByCategory,
    itemByTitulo,
    agregarItem,
    eliminarItem,
} from "./resolvers/ItemBiblioteca.mjs";

import {
    prestamos,
    prestamosById,
    prestamosByEstado,
    prestamosByItem,
    prestamosByUsuario,
    modificarPrestamo,
    modificarEstadoPrestamo,
    crearPrestamo,
    devolverPrestamo,
    marcarPrestamoComoPerdido,
    eliminarPrestamo
} from "./resolvers/Prestamo.mjs";

import{
    usuarios,
    usuariosById,
    usuariosByTipo,
    agregarUsuario,
    modificarUsuario,
    eliminarUsuario,
    usuariobyName,
    usuarioByIdBd
} from "./resolvers/Usuario.mjs";

import 'dotenv/config'
import './util/connect-db.mjs'

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
    categoria: CategoriaItem!
    prestamo: Prestamo
}


type Libro implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categoria: CategoriaItem!
    isbn: String!
    autores: [String!]!
    cantidadDisponible: Int!
    prestamo: Prestamo
}

type Revista implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categoria: CategoriaItem!
    issn: String!
    editorial: String!
    numero: Int!
    prestamo: Prestamo
}

type Audiolibro implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categoria: CategoriaItem!
    narrador: String!
    duracion: Int!  
    prestamo: Prestamo
}

type Ebook implements ItemBiblioteca {
    id: ID!
    titulo: String!
    fechaPublicacion: String!
    categoria: CategoriaItem!
    formato: String!  
    tamanoArchivo: Int!  
    prestamo: Prestamo
}

type Usuario {
    id: ID!
    nombre: String!
    email: String!
    tipo: TipoUsuario!
    prestamos: [Prestamo]
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
    items: [ItemBiblioteca!]!  
    itemById(id: ID!): ItemBiblioteca
    itemsByCategoria(categoria: CategoriaItem!): [ItemBiblioteca!]!
    itemByTitulo(titulo: String!): ItemBiblioteca
    prestamos: [Prestamo!]!
    prestamosById(id: ID!): Prestamo
    prestamosByEstado(estado: EstadoPrestamo!): [Prestamo!]!
    prestamosByItem(id: ID!): [Prestamo!]!
    prestamosByUsuario(id: ID!): [Prestamo!]!
    usuarios: [Usuario!]!
    usuarioById(id: ID!): Usuario
    usuariosByTipo(tipo: TipoUsuario!): [Usuario!]!
    usuariosByEstado(estado: EstadoPrestamo!): [Usuario!]!
    usuariobyName(nombre: String!): Usuario
    usuarioByIdBd(id: ID!): Usuario
    
}

# Mutations
type Mutation {

    agregarUsuario(
        nombre: String!
        email: String!
        tipo: TipoUsuario!
    ): Usuario!


    agregarLibro(
        titulo: String!
        fechaPublicacion: String!
        categoria: CategoriaItem!
        isbn: String!
        autores: [String!]!
    ): Libro!

    agregarRevista(
        titulo: String!
        fechaPublicacion: String!
        categoria: CategoriaItem!
        issn: String!
        editorial: String!
        numero: Int!
    ): Revista!

    agregarAudiolibro(
        titulo: String!
        fechaPublicacion: String!
        categoria: CategoriaItem!
        narrador: String!
        duracion: Int!
    ): Audiolibro!

    agregarEbook(
        titulo: String!
        fechaPublicacion: String!
        categoria: CategoriaItem!
        formato: String!
        tamanoArchivo: Int!
    ): Ebook!

    modificarUsuario(
        usuarioId: ID!
        nombre: String
        email: String
        tipo: TipoUsuario
    ): Usuario!

    modificarLibro(
        titulo: String!
        fechaPublicacion: String
        categoria: CategoriaItem!
        isbn: String
        autores: [String!]
    ): Libro!

    modificarRevista(
        titulo: String!
        fechaPublicacion: String
        categorias: CategoriaItem!
        issn: String
        editorial: String
        numero: Int
    ): Revista!

    modificarAudiolibro(
        titulo: String!
        fechaPublicacion: String
        categoria: CategoriaItem!
        narrador: String
        duracion: Int
    ): Audiolibro!

    modificarEbook(
        titulo: String!
        fechaPublicacion: String
        categoria: CategoriaItem!
        formato: String
        tamanoArchivo: Int
    ): Ebook!

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
        itemByTitulo: itemByTitulo,
        prestamos: prestamos,
        prestamosById: prestamosById,
        prestamosByEstado: prestamosByEstado,
        prestamosByItem: prestamosByItem,
        prestamosByUsuario: prestamosByUsuario,
        usuarios: usuarios,
        usuarioById: usuariosById,
        usuariosByTipo: usuariosByTipo,
        usuariobyName: usuariobyName,
        usuarioByIdBd: usuarioByIdBd
    },
    Mutation: {
        agregarUsuario: agregarUsuario,
        agregarLibro: agregarItem,
        agregarRevista: agregarItem,
        agregarAudiolibro: agregarItem,
        agregarEbook: agregarItem,
        eliminarItem: eliminarItem,
        modificarUsuario: modificarUsuario,
        modificarPrestamo: modificarPrestamo,
        modificarEstadoPrestamo: modificarEstadoPrestamo,
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