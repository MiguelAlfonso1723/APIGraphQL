import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence';


const AutoIncrement = mongooseSequence(mongoose);

const {Schema} = mongoose
const itemBibliotecaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    fechaPublicacion: {
        type: Date,
        required: true
    },
    categoria: {
        type: String,
        enum: ['LIBRO', 'REVISTA', 'AUDIOLIBRO', 'EBOOK'],
        required: true
    },
    prestamo: {
        type: Schema.Types.ObjectId,
        ref: 'Prestamo'
    },

}, {timestamps: true})

itemBibliotecaSchema.plugin(AutoIncrement, {inc_field: 'itemId'})

const Item = mongoose.model('ItemBiblioteca', itemBibliotecaSchema) 

const LibroItem = Item.discriminator('Libro', new Schema({
    isbn: {
        type: String,
        required: true
    },
    autores: [{
        type: String,
        required: true
    }],
    
}))

const RevistaItem = Item.discriminator('Revista', new Schema({
    issn: {
        type: String,
        required: true
    },
    editorial: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: true
    }
}))

const AudiolibroItem = Item.discriminator('Audiolibro', new Schema({
    narrador: {
        type: String,
        required: true
    },
    duracion: {
        type: Number, 
        required: true
    }
}))

const EbookItem = Item.discriminator('Ebook', new Schema({
    formato: {
        type: String,
        enum: ['PDF', 'EPUB', 'MOBI'],
        required: true
    },
    tamanoArchivo: {
        type: Number,
        required: true
    }
}))

export{
    Item,
    LibroItem,
    RevistaItem,
    AudiolibroItem,
    EbookItem
}

export default Item;
