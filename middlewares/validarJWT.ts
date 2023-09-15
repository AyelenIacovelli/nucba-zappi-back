import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import Usuario, { IUser } from "../models/usuario"

const validarJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-token"] as string
    //verifico que exista el token
    if (!token) {
        res.status(401).json({
            msg: "No hay token en la petición"
        })
        return
    }
    try {
        const claveSecreta = process.env.ClAVESECRETA as string
        //verifico que el token esté correcto
        const payload = jwt.verify(token, claveSecreta) as JwtPayload
        const { id } = payload
        //para saber quién es mi usuario(llamada a la base de datos):
        const usuarioConfirmado: IUser | null = await Usuario.findById(id)
        if (!usuarioConfirmado) {
            res.status(404).json({
                msg: "El usuario no se encontró en la base de datos"
            })
            return
        }
        req.body.usuarioConfirmado = usuarioConfirmado
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no válido"
        })
    }
}

export default validarJWT