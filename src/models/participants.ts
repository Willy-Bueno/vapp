export interface Participant {
  id: string
  first_name: string
  last_name: string
  address: string
  complement?: string
  tags?: string
  lat: number
  lng: number
}
