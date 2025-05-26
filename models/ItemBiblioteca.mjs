import mongoose from 'mongoose'


const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    categorias: [{
        type: String,
        enum: ['LIBRO', 'REVISTA', 'AUDIOLIBRO', 'EBOOK'],
        required: true
    }],
    prestamo: {
        type: Schema.Types.ObjectId,
        ref: 'Prestamo'
    },

}, {timestamps: true})

itemBibliotecaSchema.plugin(AutoIncrement, {inc_field: 'itemId'})

const item = mongoose.model('ItemBiblioteca', itemBibliotecaSchema) 

const libroItem = item.discriminator('Libro', new Schema({
    isbn: {
        type: String,
        required: true
    },
    autores: [{
        type: String,
        required: true
    }],
    
}))

const revistaItem = item.discriminator('Revista', new Schema({
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

const audiolibroItem = item.discriminator('Audiolibro', new Schema({
    narrador: {
        type: String,
        required: true
    },
    duracion: {
        type: Number, // Duración en minutos
        required: true
    }
}))

const ebookItem = item.discriminator('Ebook', new Schema({
    formato: {
        type: String,
        enum: ['PDF', 'EPUB', 'MOBI'],
        required: true
    },
    tamanoArchivo: {
        type: Number, // Tamaño en MB
        required: true
    }
}))

export{
    item,
    libroItem,
    revistaItem,
    audiolibroItem,
    ebookItem
}
