import mongoose from 'mongoose'


const AutoIncrement = require('mongoose-sequence')(mongoose);


const {Schema} = mongoose

const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tipo:{
        type: String,
        enum: ['ESTUDIANTE', 'PROFESOR', 'INVITADO'],
        required: true
    },
    prestamos:[{
        type: Schema.Types.ObjectId,
        ref: 'Prestamo'
    }]
})


export default mongoose.model('Usuario', usuarioSchema)