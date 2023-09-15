import jwt from "jsonwebtoken"

export const generarJWT = (id: string = ""): Promise<string> => { //Al front le paso el id
    return new Promise((res, rej) => {
        const payload = { id }
        jwt.sign(
            payload, //payload
            process.env.CLAVESECRETA as string,//clave secreta
            {
                expiresIn: "4h"
            },//objeto de config
            (err: Error | null, token: string | undefined) => { //callback de resolución
                if (err) {
                    console.log(err);
                    rej("No se pudo generar el JWT")
                } else {
                    res(token as string)
                }
            }
        )
    })
}