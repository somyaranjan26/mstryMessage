import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect();

    try {

        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                success: false,
                message: "Username already exists.",
                },
                { status: 400 }
            );
        }

        if (existingUserByEmail) {
            
            // Check if the user is already verified
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                    success: false,
                    message: "Email already exists.",
                    },
                    { status: 400 }
                );
            } 
            // Hash the password and update the user
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                // Set expiration date to 1 hour from now
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                // Save the updated user to the database
                await existingUserByEmail.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const experyDate = new Date();

            // Set expiration date to 1 hour from now
            experyDate.setDate(experyDate.getHours() + 1);

            // Create a new user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: experyDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            // Save the user to the database
            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        // Check if the email was sent successfully
        if(!emailResponse.success){
            return  Response.json(
                {
                success: false,
                message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
            success: true,
            message: "User created successfully. Please check your email to verify your account.",
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating user: ", error);
        return Response.json(
            {
            success: false,
            message: "Error creating user. Please try again later.",
            },
            { status: 500 }
    );
    }

}