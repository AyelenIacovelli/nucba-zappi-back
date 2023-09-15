import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({ //creo un transport
    service: 'gmail',
    auth: {
        user: 'iacovelli.ayelen@gmail.com',
        pass: '42071131' //generar autenticacion en 2 pasos en support.google.com/accounts/answer... seguridad - verif en 2 pasos - msj texto - activar - contraseña de apps - select app (otro) - nombre:NucbaZappi2717 - genero contraseña. copio y pego la contra aqui guandandola en una variable de entorno
    },
    from: 'iacovelli.ayelen@gmail.com'
})

export const sendEmail = async (to: string, code: string): Promise<void> => { //funcion que va a mandar el mail
    const mailOptions = {
        from: '"Nucbazappi" iacovelli.ayelen@gmail.com',
        to,
        subject: 'Código de verificación para NucbaZappi',
        text: `
            Llegó tu código para NucbaZappi.
            El código es ${code}
        `
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log("Correo electrónico enviado");

    } catch (error) {
        console.log("Error al enviar el correo electrónico:", error);
    }
}