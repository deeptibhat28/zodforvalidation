'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

const Page = () => {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {

        setIsSubmitting(true)

        try {

            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password
            })

            if (result?.error) {
                toast.error("Login failed: incorrect username or password")
                return
            }

            if (result?.url) {
                router.replace('/dashboard')
            }

        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent">

            <div className="w-full max-w-md p-8 space-y-6 bg-rose-100/70 backdrop-blur-md border border-rose-200/60 rounded-3xl shadow-xl">

                <div className="text-center">

                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to True Feedback
                    </h1>

                    <p className="mb-4">
                        Sign in to continue your secret conversations
                    </p>

                </div>

                <Form {...form}>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >

                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>

                                    <FormLabel>
                                        Email/Username
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="email/username"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>

                                    <FormLabel>
                                        Password
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="password"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 text-white hover:bg-slate-800"
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>

                    </form>

                </Form>

                <div className="text-center mt-4">

                    <p>
                        Not a member yet?{" "}

                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign up
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    )
}

export default Page