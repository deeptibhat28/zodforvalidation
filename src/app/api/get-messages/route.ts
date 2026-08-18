import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
        const user: User = session?.user
    
        if (!session || !session.user){
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, { status : 401}
        )
        }
    
         const userId = new mongoose.Types.ObjectId(user._id); // if user._Id is in string then it will get converted to mongoose object id before getting into userId
         try {
            const user = await UserModel.aggregate([
                { $match: {_id: userId}},
                { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true }},
                { $sort: {'messages.createdAt': -1}},
                { $group: {_id: '$_id', messages: {$push: '$messages'}}}, // 1 object(bcz id was same) is created and the messages are sorted and pushed in it
                
            ])
            if(!user || user.length === 0){
                 return Response.json(
                    {
                       success: false,
                       message: "User not found"
            }, 
            { status : 401}
        )
            }

            return Response.json(
                    {
                       success: true,
                       messages: user[0].messages
            }, 
            { status : 200}
        )
            
         } catch (error) {
            console.log("An unexpected error occured", error)
             return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status : 500}
    )
         }
}