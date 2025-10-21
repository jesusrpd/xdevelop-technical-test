'use client'
import { useFormUserStore } from "@/store/LoginStore";
import { loginUser } from "@/services/login/mutation";
import Image from "next/image";

export default function Login(){

  const form = {
    email: useFormUserStore(state => state.email),
    password: useFormUserStore(state => state.password),
    updateEmail: useFormUserStore(state => state.updateEmail),
    updatePassword: useFormUserStore(state => state.updatePassword)
  }

  const { mutate } = loginUser()

  return(
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-[linear-gradient(rgba(10,25,47,0.95),rgba(10,25,47,0.95))]">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image src="/img/xdevelop-icon.png" width={100} height={100} alt="icon xdevelop" className="mx-auto h-10 w-auto rounded-full"/>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Technical Test XDEVELOP</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
            <div className="mt-2">
              <input id="email" type="email" name="email" required autoComplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm/6" onChange={e=> form.updateEmail(e.currentTarget.value)} value={form.email}/>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
            </div>
            <div className="mt-2">
              <input id="password" type="password" name="password" required autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm/6" onChange={e => form.updatePassword(e.currentTarget.value)} value={form.password}/>
            </div>
          </div>

          <div>
            <button className="flex w-full justify-center rounded-md bg-teal-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-transparent transition-all border-2 border-teal-500 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" onClick={()=> mutate(form)}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  )
}