import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence';


const AutoIncrement = mongooseSequence(mongoose);

const {Schema} = mongoose

const prestamosSchema = new Schema({
    fechaPrestamo: {
        type: Date,
        default: Date.now
    },
    fechaDevolucion: {
        type: Date,
    },
    fechaLimite: {
        type: Date,
        default: function() {
            const fecha = new Date(this.fechaPrestamo);
            fecha.setDate(fecha.getDate() + 14); // 14 días de préstamo
            return fecha;
        }
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    itemBiblioteca: {
        type: Schema.Types.ObjectId,
        ref: 'ItemBiblioteca',
        required: true
    },
    estado: {
        type: String,
        enum: ['ACTIVO', 'DEVUELTO', 'RETRASADO', 'PERDIDO'],
        default: 'ACTIVO'
    }
}, {timestamps: true})

prestamosSchema.plugin(AutoIncrement, {inc_field: 'id'})

export default mongoose.model('Prestamo', prestamosSchema);