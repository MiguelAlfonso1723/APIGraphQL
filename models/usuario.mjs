import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence';


const AutoIncrement = mongooseSequence(mongoose);

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

usuarioSchema.plugin(AutoIncrement, {inc_field: 'usuarioId'})


export default mongoose.model('Usuario', usuarioSchema)