import {
  Item,
  LibroItem,
  RevistaItem,
  AudiolibroItem,
  EbookItem,
} from "../models/itemBiblioteca.mjs";



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
    return await Item.findOne({id: args.itemId});
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
      return null;
    }
    return resultado;
  } catch (error) {
    console.error("Error al obtener el item por nombre:", error);
    throw new Error("No se pudo encontrar el item con el nombre proporcionado");
  }
}

async function agregarItem(parent, args) {
  try {
    switch (args.categoria) {
        case "LIBRO":
          const nuevoLibro = await new LibroItem({
              titulo: args.titulo,
              fechaPublicacion: args.fechaPublicacion,
              categoria: args.categoria,
              isbn: args.isbn,
              autores: args.autores
            });
            return await nuevoLibro.save();
        case "REVISTA":
          const nuevaRevista = await new RevistaItem({
            titulo: args.titulo,
            fechaPublicacion: args.fechaPublicacion,
            categoria: args.categoria,
            issn: args.issn,
            editorial: args.editorial,
            numero: args.numero,
          });
          return await nuevaRevista.save();
        case "AUDIOLIBRO":
          const nuevoAudiolibro = await new AudiolibroItem({
            titulo: args.titulo,
            fechaPublicacion: args.fechaPublicacion,
            categoria: args.categoria,
            narrador: args.narrador,
            duracion: args.duracion,
          });
          return await nuevoAudiolibro.save();
        case "EBOOK":
          const nuevoEbook = await new EbookItem({
            titulo: args.titulo,
            fechaPublicacion: args.fechaPublicacion,
            categoria: args.categoria,
            formato: args.formato,
            tamanoArchivo: args.tamanoArchivo
          });
          return await nuevoEbook.save();
        default:
          throw new Error("Categoría no válida");
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

async function actualizarItem(parent, args){
    try{
        const item = await Item.findOne({id: args.itemId});
        if (!item) throw new Error("Item no encontrado");

        let itemN = new Item({
            titulo: item.titulo,
            fechaPublicacion: item.fechaPublicacion,
            categorias: item.categorias,
        })
        switch (item.categoria) {
            case "LIBRO":
                itemN = new LibroItem({
                    itemN,
                    isbn: item.isbn,
                    autores: item.autores
                });
                break;
            case "REVISTA":
                itemN = new RevistaItem({
                    itemN,
                    issn: item.issn,
                    editorial: item.editorial,
                    numero: item.numero
                });
                break;
            case "AUDIOLIBRO":
                itemN = new AudiolibroItem({
                    itemN,
                    narrador: item.narrador,
                    duracion: item.duracion
                });
                break;
            case "EBOOK":
                itemN = new EbookItem({
                    itemN,
                    formato: item.formato
                });
                break;
            default:
                throw new Error("Categoría no válida");
        }

        itemN.prestamo = item.prestamo;

        await item.owerwrite(itemN);
        itemN._id = item._id; 
        itemN.createdAt = item.createdAt; 
        
        return await item.save();

    }catch(err){
        console.error("Error al actualizar el item:", err);
        throw new Error("No se pudo actualizar el item");
    }
}

export {
  items,
  itemById,
  itemsByCategory,
  itemByTitulo,
  agregarItem,
  eliminarItem,
  actualizarItem
};
