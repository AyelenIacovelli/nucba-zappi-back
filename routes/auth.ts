// AUTORIZACION
import { Router } from "express";
import { login, register, verifyUser } from "../controllers/auth";
import { check } from "express-validator";
import { recolectarErrores } from "../middlewares/recolectarErrores";
import { existeEmail } from "../helpers/validacionesDB";

const router = Router()

router.post("/register",
    [
        check("nombre", "el nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatotrio").isEmail(),
        check("password", "El password debe tener 6 mínimo caracteres").isLength({
            min: 6
        }),
        check("email").custom(existeEmail), //checkeo el email con mi funcion personalizada
        recolectarErrores
    ],
    register) //se queda escuchando el post a register y que reaccione con la funcion indicada. en el medio van los middlewares con las validaciones
//Armo el postman y lo guardo en save - Save as - como RegisterUser

router.post("/login",
    [
        check("email", "El mail es obligatorio").isEmail(),
        check("password", "El password debe tener 6 mínimo caracteres").isLength({
            min: 6
        }),
        recolectarErrores
    ],
    login)
//en Postman armo el body con email y pass y mando el post - lo guardo como LoginUser

router.patch("/verify",
    [
        check("email", "El mail es obligatorio").isEmail(),
        check("code").not().isEmpty(),
        recolectarErrores
    ],
    verifyUser)
//Armo en postman el body con los datos y lo guardo como VerifyUser

export default router