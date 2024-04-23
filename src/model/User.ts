import mongoose, {Schema, Document, Mongoose} from "mongoose";


// ? The Message interface defines the properties that a Message document will have.
// ? Document type is a generic type that represents a MongoDB document, and it provides a number of useful methods for working with documents.
export interface Message extends Document{
    content: string;
    createdAt: Date
}

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}


// ? The MessageSchema is a Mongoose schema that defines the structure of a Message document. 
const MessageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserSchema:Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required!"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required!"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required!"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        default: true
    },
    messages: [MessageSchema]
})

// ? UserModel is a Mongoose model that wraps the UserSchema and provides an interface to interact with the database.
// ! The first argument is the name of the model if it already exists in the database, it will return the existing model with the type User
// ! If the model does not exist, it will create a new model with the name "User" and the UserSchema
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel;