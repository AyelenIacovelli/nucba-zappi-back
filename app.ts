//LLAMO A LA VARIABLE DE ENTORNO
//process.env.PORT y en .env escribo PORT=8080 pero por ahora da undefined, por esto descargo dotenv

import dotenv from "dotenv"
import { Server } from "./models/server"

dotenv.config() //dotenv configurado

const server = new Server() //creo la instancia de mi servidor

server.listen()