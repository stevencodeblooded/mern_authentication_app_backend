import bcrypt from 'bcrypt'
import User from "../models/userModal.js"
import jwt from 'jsonwebtoken'

//Login user 
const login = async (req, res, next) => {
    const { email, password } = req.body

    const userExists = await User.findOne({ email })
    if (!userExists) {
        const error = new Error('Invalid credentials, Could not log in');
        error.status = 401;
        return next(error);
    }
    
    const isValidPassword = await bcrypt.compare(password, userExists.password)
    if (!isValidPassword) {
        const err = new Error('Wrong Credentials, Try again later')
        err.status = 401
        return next(err)
    }
    
    if (!userExists && !isValidPassword) {
        const error = new Error('No User! Sign Up');
        error.status = 401;
        return next(error);
    }

    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET)
    const { password:pass, ...userNoPassword } = userExists._doc
    res
        .cookie('access_token', token, { httpOnly: true } )
        .status(200)
        .json({ userNoPassword, message: 'Logged in successfully' })
}

//Signup user
const signup = async (req, res, next) => {
    const { name, email, password} = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        const err = Error('User already exists, Log in!')
        err.status = 400
        return next(err)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    let newUser
    try {
        newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

    } catch (error) {
        const err = new Error('Something went wrong')
        err.status = 400
        next(err)
    }

    if (newUser) {
        res.status(201).json({newUser, message: 'Signup was successfully'})
    }
}


//Logout user
const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json({ message: "Successfully logged Out!"})
    } catch (error) {
        next(error)
    }
}


//Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        await User.findByIdAndDelete(id)
    } catch (error) {
        const err = new Error('Could not delete User')
        err.status = 404
        next(err)
    }

    res.status(200).json({ message: 'Successfully deleted User'})
}


//Update User
const updateUser = async (req, res, next) => {
    const userId = req.params.id
    const { name, email, password } = req.body

    let updatedUserData = {
        name,
        email,
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 12)
        updatedUserData.password = hashedPassword
    }

    let newUser
    try {
        newUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true })
    } catch (error) {
        const err = new Error('Update Failed! Could not find user with the specified id')
        err.status = 401
        next(err)
    }

    res.status(200).json({ message: 'Updated User successfully', newUser })
}

export { login, signup, updateUser, logout, deleteUser}