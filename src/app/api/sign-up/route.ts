import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        // Basic validation (for my understanding)
        if (!username || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Username, email and password are required",
                },
                { status: 400 }
            );
        }

        // Check if username already exists for a verified user
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            );
        }

        // Check if email already exists
        // const existingUserByEmail = await UserModel.findOne({ email });

        // Generate verification code
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Verification code expires in 1 hour
        const verifyCodeExpiry = new Date(
            Date.now() + 60 * 60 * 1000
        );
        /*
        if (existingUserByEmail) {
            // Email already belongs to a verified account
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                );
            }

            // Existing but unverified user:
            // update their password and verification code
            const hashedPassword = await bcrypt.hash(password, 10);

            existingUserByEmail.username = username;
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;

            await existingUserByEmail.save();           
        }  */
        // else {
            // New user
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
        // }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            'bhatdeepti28@gmail.com',
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
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
                message:
                    "User registered successfully. Please verify your email",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);

        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 }
        );
    }
}