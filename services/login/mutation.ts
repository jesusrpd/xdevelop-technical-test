import { useFormUserStore } from "@/store/LoginStore";
import { LoginForm } from "@/types/form";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { useRouter } from "next/navigation";

export const loginUser = () => {

	const router = useRouter()
	return useMutation({
		
		mutationFn: async (login: LoginForm) => {
			const res = await axios({
				method: 'post',
				url: process.env.NEXT_PUBLIC_API_REQES,
				headers: {
					'x-api-key': process.env.NEXT_PUBLIC_API_REQES_KEY,
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(login)
			})

			const role = process.env.NEXT_PUBLIC_ADMINS?.split(",").includes(login.email) ? "admin" : "user"

			const dataCookie = {
				token: res.data.token,
				email: login.email,
				role
			}

			const cookieSave = await axios({
				method: 'post',
				url: "/api/login",
				headers: {"Content-Type":"application/json"},
				data: JSON.stringify(dataCookie)
			})
			console.log(cookieSave);
		},
		onSuccess: () => router.push("/dashboard"),
		onError: () => console.log("Error login")
		
	})
}