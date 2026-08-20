"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/app/model/User";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message || "Message deleted successfully");
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete message"
      );
    }
  };

  const formattedDate = message.createdAt
    ? new Date(message.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <Card className="bg-white/80 border border-rose-200/80 shadow-sm rounded-xl">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold pr-2">
            {message.content}
          </CardTitle>
          {formattedDate && (
            <CardDescription className="mt-1 text-xs text-muted-foreground">
              {formattedDate}
            </CardDescription>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 w-8">
            <X className="w-4 h-4" />
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-rose-50 text-gray-900 border-rose-200 hover:bg-rose-50 hover:text-gray-900">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent />
    </Card>
  );
};

export default MessageCard;
