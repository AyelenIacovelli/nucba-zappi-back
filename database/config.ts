import mongoose from "mongoose"

export const dbConnection = async (): Promise<void> => {
    try {
        const dbURL = process.env.DB_URL //tengo que asegurarme que la url no de undefined
        if (!dbURL) {
            throw new Error("La URL no esta correctamente definida en la variable de entorno")
        }
        await mongoose.connect(dbURL)
    } catch (error) {
        console.log(error);
        throw new Error("Error al iniciar la base de datos")
    }
}