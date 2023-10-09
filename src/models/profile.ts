import { Business } from "./business"

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
  business?: Business
  created_at: string
}
