import {
  Item,
  LibroItem,
  RevistaItem,
  AudiolibroItem,
  EbookItem,
} from "../models/ItemBiblioteca.mjs";

import Prestamo from "../models/Prestamo.mjs";

async function items() {
  try {
    const resultado = await Item.find({});
    return resultado;
  } catch (error) {
    console.error("Error al obtener los items:", error);
    throw new Error("No se pudieron obtener los items");
  }
}

async function itemById(parent, args) {
  try {
    return await Item.findById(args.id);
  } catch (error) {
    console.error("Error al obtener el item por ID:", error);
    throw new Error("No se pudo encontrar el item con el ID proporcionado");
  }
}

async function itemsByCategory(parent, args) {
  try {
    let resultado;
    switch (args.categoria) {
      case "LIBRO":
        resultado = await LibroItem.find({});
        break;
      case "REVISTA":
        resultado = await RevistaItem.find({});
        break;
      case "AUDIOLIBRO":
        resultado = await AudiolibroItem.find({});
        break;
      case "EBOOK":
        resultado = await EbookItem.find({});
        break;
      default:
        throw new Error("Categoría no válida");
    }
    return resultado;
  } catch (error) {
    console.error("Error al obtener los items por categoría:", error);
    throw new Error("No se pudieron obtener los items por categoría");
  }
}

async function itemByTitulo(parent, args) {
  try {
    const resultado = await Item.findOne({ titulo: args.titulo });
    if (!resultado) {
      throw new Error("No se encontró ningún item con el nombre proporcionado");
    }
    return resultado;
  } catch (error) {
    console.error("Error al obtener el item por nombre:", error);
    throw new Error("No se pudo encontrar el item con el nombre proporcionado");
  }
}

function agregarItem(parent, args) {
  try {
    if (
      itemByTitulo(args.titulo) != null ||
      itemByTitulo(args.titulo).categoria != args.categoria
    ) {
      switch (args.categoria) {
        case "LIBRO":
          if (itemByNombre(null, { titulo: args.titulo }) === null) {
            const nuevoLibro = new LibroItem({
              titulo: args.titulo,
              fechaPublicacion: args.fechaPublicacion,
              categorias: args.categorias,
              isbn: args.isbn,
              autores: args.autores
            });
            return nuevoLibro.save();
          }
        case "REVISTA":
          const nuevaRevista = new RevistaItem({
            titulo: args.titulo,
            fechaPublicacion: args.fechaPublicacion,
            categorias: args.categorias,
            issn: args.issn,
            editorial: args.editorial,
            numero: args.numero,
          });
          return nuevaRevista.save();
        case "AUDIOLIBRO":
          const nuevoAudiolibro = new AudiolibroItem({
            titulo: args.titulo,
            fechaPublicacion: args.fechaPublicacion,
            categorias: args.categorias,
            narrador: args.narrador,
            duracion: args.duracion,
          });
          return nuevoAudiolibro.save();
        case "EBOOK":
          const nuevoEbook = new EbookItem({
            titulo: args.titulo,
            fechaPublicacion: args.fechaPublicacion,
            categorias: args.categorias,
            autor: args.autor,
            formato: args.formato,
          });
          return nuevoEbook.save();
        default:
          throw new Error("Categoría no válida");
        }
    }else{
        return null;
    }
  } catch (error) {
    console.error("Error al agregar el item:", error);
    throw new Error("No se pudo agregar el item");
  }
}

async function eliminarItem(parent, args) {

    try{
        const item = await Item.findById(args.id);
    if (itemIndex === -1) throw new Error("Item no encontrado");

    
    if (item) {
        const prestamo = await Item.findById(item.prestamo._id)
        return await prestamo.deleteOne();
        
    }

    return item;
    }catch(error){
        console.error("Error al eliminar el item:", error);
        throw new Error("No se pudo eliminar el item");
    }

    
}

async function actualziarItem(parent, args){
    try{
        const item = await Item.findById(args.id);
        if(item){
            
        }
    }catch(err){

    }
}
