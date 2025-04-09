export interface Product {
  id: number | string
  name: string
  description?: string
  price_demanded: number
  origin: string
  year: number
  wine_type_id: number
  status: "in_stock" | "out_of_stock" | string
  image?: string
  images?: string[]
  created_at: string
}

export interface WineType {
    id: number
    name: string
    image?: string
  }
  
  export interface ProductFormData {
    name: string
    origin: string
    year: string
    wine_type_id: string
    description: string
    price_demanded: string
    quantity: string
    image: string
    user_id: string
  }
  
  export interface FormErrors {
    [key: string]: string[]
  }
  
  export interface SelectedImage {
    file: File
    preview: string
  }

  export interface Request {
    id: number | string
    product_id: number | string
    quantity: number
    price_restaurant: number
    status: "pending" | "accepted" | "rejected" | string
  }
  
  export interface FilterOptions {
    status: string
    minPrice: string
    maxPrice: string
    minQuantity: string
    maxQuantity: string
  }
  
  