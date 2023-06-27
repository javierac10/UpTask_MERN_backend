import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const registrar = async(req, res) => {

    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({email});
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save(); // const usuarioAlmacenado = 

        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        //res.json(usuarioAlmacenado);
        res.json({msg: 'Usuario Creado Correctamente, revisa tu email para confirmar la cuenta'});
    } catch (error) {
        console.log(error);
    }
    
}

const autenticar = async(req, res) => {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({email})

    if (!usuario) {
        const error = new Error('El usuario no exite');
        return res.status(404).json({ msg: error. message});
    }

    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmado');
        return res.status(404).json({ msg: error. message});
    }

    if (await usuario.comprobarPassword(password)) {
        res.json({ _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario._id)
    });
    } else {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({ msg: error. message});
    }
}

const confirmar =  async(req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Usuario.findOne({ token });
    if (!usuarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(403).json({ msg: error.message});
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario confirmado correctamente' });
    } catch (error) {
        
    }

}

const olvidePassword = async(req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        usuario.token = generarId();
        await usuario.save();

        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        return res.status(200).json({ msg: 'Hemos enviado un email con las intrucciones' });
    } catch (error) {
        
    }
}

const comprobarToken = async(req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token });

    if (tokenValido) {
        res.json({ msg: 'Token válido y el Usuario existe' })
    } else {
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }
}

const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password;
        usuario.token = '';
        await usuario.save();
        res.json({ msg: 'Password modificado correctamente' })
    } else {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }
}

const perfil = async(req, res) => {
    const { usuario } = req;
    res.json(usuario);
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}