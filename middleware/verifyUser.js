import jwt  from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token

    console.log(req.cookies);

    if (!token) {
        const error = new Error('Unathorised, No token provided!')
        error.status = 401
        next(error)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const error = new Error('Forbidden, Invalid Token!')
            error.status = 401
            next(error)
        }

        req.user = user
        console.log("USER:", user);
        console.log("TOKEN:", token);
        next()
    })
    
}