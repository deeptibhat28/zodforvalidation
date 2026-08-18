'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ApiResponse } from '@/types/ApiResponse';
import { MessageSchema } from '@/schemas/messageSchema';

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? '';

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = form.watch('content');

  // Submit anonymous message
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: data.content,
      });

      toast.success('Success', {
        description: response.data.message || 'Message sent successfully!',
      });
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description:
          axiosError.response?.data.message || 'Failed to send message',
      });
    } finally {
      setIsSending(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post<{ success: boolean; message: string }>(
        '/api/suggest-messages'
      );

      const rawText = response.data.message || '';
      const messagesArray = rawText
        .split('||')
        .map((msg) => msg.trim())
        .filter((msg) => msg.length > 0);

      setSuggestedMessages(messagesArray);
    } catch (error) {
      toast.error('Failed to generate suggested messages');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue('content', message, { shouldValidate: true });
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here..."
                    rows={4}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSending || !messageContent?.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send It'
              )}
            </Button>
          </div>
        </form>
      </Form>

  
      <div className="my-8">
        <Button
          onClick={fetchSuggestedMessages}
          disabled={isSuggestLoading}
          variant="outline"
          className="my-4"
        >
          {isSuggestLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
              Suggest Messages (AI)
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground mb-4">
          Click on any message below to select it.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestedMessages.length > 0 ? (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left whitespace-normal h-auto py-3 justify-start font-normal"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Click &quot;Suggest Messages&quot; to generate AI suggestions!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
