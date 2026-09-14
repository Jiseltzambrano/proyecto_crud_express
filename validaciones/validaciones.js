function validarAprendiz(req, res, next) {
    // Si req.body es undefined o no es un objeto, asignamos un objeto vacío
    const body = req.body || {};

    const { nombre, edad, correo } = body;
    const errores = [];

    // Validar nombre (> 3 letras)
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length <= 3) {
        errores.push('El nombre es obligatorio y debe tener más de 3 letras.');
    }

    // Validar correo con expresión regular
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || !regexCorreo.test(correo)) {
        errores.push('Ingrese un correo electrónico válido.');
    }

    // Validar edad
    if (!edad || isNaN(Number(edad))) {
        errores.push('La edad debe ser un número válido.');
    }

    // Si existen errores, detiene la petición
    if (errores.length > 0) {
        return res.status(400).json({ ok: false, errores });
    }

    next();
}

module.exports = { validarAprendiz };