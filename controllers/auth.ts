import { Request, Response } from "express"
import Usuario, { IUser } from "../models/usuario"
import bcryptjs from "bcryptjs"
import { ROLES } from "../helpers/constants"
import randomstring from "randomstring"
import { sendEmail } from "../mailer/mailer"
import { generarJWT } from "../helpers/generarJWT"

export const register = async (req: Request, res: Response) => { //el usuario me tiene que mandar data
    const { nombre, email, password, rol }: IUser = req.body //data desestructurada que llega desde el body del usuario. Lo tipo para que no haya errores en lo que debe llegar
    //en postman armar el body y hacer el post a /auth(path en constructor de clase) /register(path en routes). Ir a Collection - + - la nombro - luego armo el body, metodo y url - Save As - selecciono la nueva coleccion - cambio el request name por RegisterUser - guardo
    const usuario = new Usuario({ nombre, email, password, rol }) //armo mi esquema de usuario. creo un usuario con la data desestructurada
    const salt = bcryptjs.genSaltSync() //creo saltos. Sync son 10 por defecto y no supone demora
    usuario.password = bcryptjs.hashSync(password, salt) //hasheo de manera sync el pass con los saltos que generé
    //voy a postman para decirle a mi front que me arme un formulario que ademas del body me mande un Header con un admin-key con la clave para saber si el usuario sera admin o user
    const adminKey = req.headers["admin-key"] //guardo lo que el front me manda como admin-key
    if (adminKey === process.env.KEYFORADMIN) {
        usuario.rol = ROLES.admin
    }
    const newCode = randomstring.generate(6) //genero un codigo random string de 6 caracteres
    usuario.code = newCode //el codigo del usuario(que arme en el modelo va a ser este nuevo codigo random)
    await usuario.save() //guardo el nuevo usuario
    await sendEmail(email, newCode) //envio el mail
    res.status(201).json({
        usuario
    }) //codigo de creacion con exito
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: IUser = req.body
    try {
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            res.status(404).json({
                msg: "No se encontró el mail en la base de datos"
            })
            return
        }
        //Comparo el pass del usuario con el hash de mi base de datos
        const validarPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validarPassword) {
            res.status(401).json({
                msg: "La contraseña es incorrecta"
            })
            return
        }
        const token = await generarJWT(usuario.id)// Le armo un token al usuario
        res.status(202).json({
            usuario, //para que el front use la data en redux
            token //lo tiene que guardar porque se lo voy a pedir mas adelante(por ejemplo en órdenes)
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ //error genérico no previsto
            msg: "Error en el servidor"
        })
    }
}

export const verifyUser = async (req: Request, res: Response) => { //Validaciones del verificado
    const { email, code } = req.body
    try {
        //chequeo que el usuario exista
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            res.status(404).json({
                msg: "No se encontró el mail en la base de datos"
            })
            return
        }
        //chequeo que el usuario no esté verificado
        if (usuario.verified) {
            res.status(400).json({
                msg: "El usuario ya está verificado"
            })
        }
        //chequeo que los códigos coincidan
        if (code !== usuario.code) {
            res.status(401).json({
                msg: "El código ingresado es incorrecto"
            })
            return
        }
        //finalmente actualizo la verificacion del usuario
        await Usuario.findOneAndUpdate(
            { email },
            { verified: true }
        )
        res.status(200).json({
            msg: "Usuario verificado con éxito"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ //error genérico no previsto
            msg: "Error en el servidor"
        })
    }
}