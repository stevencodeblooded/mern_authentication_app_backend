import bcrypt from 'bcrypt'
import User from "../models/userModal.js"

//Login user 
const login = async (req, res) => {
    const { email, password } = req.body

    const userExists = await User.findOne({ email })
    if (!userExists) {
        res.status(401)
        throw new Error('Invalid credentials, Could not log in')
    }

    let isValidPassword
    try {
        isValidPassword = await bcrypt.compare(password, userExists.password)
    } catch (error) {
        res.status(401)
        throw new Error('Wrong Credentials, Try again later')
    }
    
    if (userExists && isValidPassword) {
        res.status(200).json({ userExists, message: 'Logged in successfully' })
    }

}

//Signup user
const signup = async (req, res) => {
    const { name, email, password} = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists, Log in!')
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
        res.status(400)
        throw new Error('Something went wrong')
    }

    if (newUser) {
        res.status(201).json({newUser, message: 'Signup was successfully'})
    }

}


//Logout user
const logout = async () => {
    res.status(200).json({ message: "Logout Works"})
}

//Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        await User.findByIdAndDelete(id)
    } catch (error) {
        res.status(404)
        throw new Error('Could not delete User')
    }

    res.status(200).json({ message: 'Successfully deleted User'})
}


//Get user data
const getProfile = async (req, res) => {
    const userId = req.params.id

    let userProfile
    try {
        userProfile = await User.findById(userId)
    } catch (error) {
        res.status(401)
        throw new Error('Something went wrong, Could not find user')
    }

    res.status(200).json({ userProfile })
}

//Update User
const updateUser = async (req, res) => {
    const userId = req.params.id
    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 12)

    let updatedUser = {
        name,
        email,
        password:hashedPassword
    }

    let newUser
    try {
        newUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true })
    } catch (error) {
        res.status(401)
        throw new Error('Update Failed! Could not find user with the specified id')
    }

    res.status(200).json({ message: 'Updated User successfully', newUser })
}

export { login, signup, getProfile, updateUser, logout, deleteUser}