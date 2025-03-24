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
  
  