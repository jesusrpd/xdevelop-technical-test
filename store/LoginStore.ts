
import { create } from 'zustand';
import { LoginForm } from '../types/form';

type Action = {
  updateEmail: (email: LoginForm['email']) => void
  updatePassword: (password: LoginForm['password']) => void
}

export const useFormUserStore = create<LoginForm & Action>(set => ({
  email: '',
  password: '',
  updateEmail: (email) => set(() => ({email})),
  updatePassword: (password) => set(() => ({password}))
}))