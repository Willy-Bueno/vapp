import { Business } from './business'

export interface Survey {
  id: string
  title: string
  description: string
  status: string
  business: Business
}
