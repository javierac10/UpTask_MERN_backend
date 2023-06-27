import nodemailer from 'nodemailer';

export const emailRegistro = async(datos) => {

    const { email, nombre, token } = datos;

    const transport = getTransport();

      // Información del email

      await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
                <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace</p>
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
      })
}

export const emailOlvidePassword = async(datos) => {

    const { email, nombre, token } = datos;

    const transport = getTransport();

      // Información del email

      await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Restablece tu password",
        text: "Restablece tu password en UpTask",
        html: `<p>Hola: ${nombre} has solicitado restablecer tu password</p>
                <p>Siguiente el siguiente enlace para generar un nuevo password</p>
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
                <p>Si tu no solicitaste ese email, puedes ignorar el mensaje</p>
        `
      })
}

function getTransport() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
}