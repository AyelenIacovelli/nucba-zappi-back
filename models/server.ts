import express, { Express } from "express"
import cors from "cors"
import authRoutes from "../routes/auth"
import ordersRoutes from "../routes/orders"
import issuesRoutes from "../routes/issues"
import { dbConnection } from "../database/config"

export class Server { //toda clase tiene constructor

    app: Express //tipo la aplicacion
    port: string | number | undefined //tipo el puerto
    authPath: string //tipo el auth
    ordersPath: string
    issuesPath: string

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.authPath = '/auth'
        this.ordersPath = '/orders'
        this.issuesPath = '/issues'
        this.conectarDB()
        this.middlewares()
        this.routes()
    }

    async conectarDB(): Promise<void> {
        await dbConnection()
    }

    middlewares(): void {
        this.app.use(express.json())
        this.app.use(cors()) //me asegura que nadie que yo no quiera se conecte a mi api ni que manden metodos http que no quiera
    }

    routes(): void {
        this.app.use(this.authPath, authRoutes)
        this.app.use(this.ordersPath, ordersRoutes)
        this.app.use(this.issuesPath, issuesRoutes)
    }

    listen(): void { // Levanto la base de datos
        this.app.listen(this.port, () => {
            console.log(`Corriendo en puerto ${this.port}`);

        })
    }
}