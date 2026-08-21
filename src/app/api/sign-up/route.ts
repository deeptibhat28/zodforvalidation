import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return Response.json(
                { success: false, message: "Username, email and password are required" },
                { status: 400 }
            );
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Check if user already exists
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json(
                    { success: false, message: "Username is already taken" },
                    { status: 400 }
                );
            } else {
                // User exists but is unverified! Update info and resend code.
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.email = email;
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifyCodeExpiry = verifyCodeExpiry;
                await existingUser.save();

  
                const emailResponse = await sendVerificationEmail(
                    'bhatdeepti28@gmail.com',
                    username,
                    verifyCode
                );

                if (!emailResponse.success) {
                    return Response.json(
                        { success: false, message: emailResponse.message },
                        { status: 500 }
                    );
                }

                // Return success: true so your frontend router automatically pushes you to the verify page!
                return Response.json(
                    { 
                        success: true, 
                        message: "User already exists but is unverified. A new verification code has been sent." 
                    },
                    { status: 200 }
                );
            }
        }

        // Brand new user registration
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry,
            isVerified: false,
            isAcceptingMessage: true,
            messages: [],
        });

        await newUser.save();

        const emailResponse = await sendVerificationEmail(
            'bhatdeepti28@gmail.com',
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email",
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json(
            { success: false, message: "Error registering user" },
            { status: 500 }
        );
    }
}