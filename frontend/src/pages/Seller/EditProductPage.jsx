import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom" 
import { useFetchUser } from "@components/auth/FetchUser"
import { ProgressBar } from "@/components/product/ProgressBar"
import { WineTypeSelector } from "@/components/product/WineTypeSelector"
import { WineDetailsForm } from "@/components/product/WineDetailsForm"
import { WinePricingForm } from "@/components/product/WinePricingForm"
import { validateStep } from "@/utils/form-validation"

export default function EditProduct() {
  const { id: productId } = useParams();
  const { user, loading } = useFetchUser()
  const [wineTypes, setWineTypes] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    year: "",
    wine_type_id: "",
    description: "",
    price_demanded: "",
    quantity: "",
    image: "",
    user_id: "",
  })
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const [stepValidation, setStepValidation] = useState({
    1: false,
    2: false,
    3: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL
  const formSectionRef = useRef(null)
  const priceSectionRef = useRef(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [touchedFields, setTouchedFields] = useState({})
  const [existingImages, setExistingImages] = useState([])
  // Nuevo estado para rastrear IDs de imágenes eliminadas
  const [removedImageIds, setRemovedImageIds] = useState([])

  // Cargar tipos de vino
  useEffect(() => {
    const fetchWineTypes = async () => {
      const response = await fetch(`${apiUrl}/v1/winetypes`)
      const data = await response.json()
      setWineTypes(data)
    }
    fetchWineTypes()
  }, [apiUrl])

  // Cargar datos del producto existente
  useEffect(() => {
    const fetchProductData = async () => {
      if (!user || !productId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/v1/${user.id}/products/${productId}`);
        
        if (!response.ok) {
          throw new Error("No se pudo obtener la información del producto");
        }
        
        const data = await response.json();
        const productData = data.data || data;
        
        // Configurar datos del formulario
        setFormData({
          name: productData.name || "",
          origin: productData.origin || "",
          year: productData.year || "",
          wine_type_id: productData.wine_type_id?.toString() || "",
          description: productData.description || "",
          price_demanded: productData.price_demanded?.toString() || "",
          quantity: productData.quantity?.toString() || "",
          // Si hay imágenes, el campo image tendrá un valor
          image: productData.images && productData.images.length > 0 ? "existing_images" : "",
          user_id: user.id,
        });
        
        // Si el producto tiene imágenes
        if (productData.images && productData.images.length > 0) {
          setExistingImages(productData.images);
        }
        
        // Inicializar validación de pasos con datos completos
        const step1Valid = !!productData.wine_type_id;
        const step2Valid = !!productData.name && !!productData.origin && 
                          !!productData.year && 
                          (productData.images && productData.images.length > 0);
        const step3Valid = !!productData.price_demanded && !!productData.quantity;
        
        setStepValidation({
          1: step1Valid,
          2: step2Valid,
          3: step3Valid
        });
        
        setTouchedFields({
          name: true,
          origin: true,
          year: true,
          wine_type_id: true,
          description: true,
          price_demanded: true,
          quantity: true,
          image: productData.images && productData.images.length > 0,
        });
        
      } catch (error) {
        // console.error("Error al cargar el producto:", error);
        navigate('/seller/dashboard', { 
          state: { errorMessage: "No se pudo cargar el producto para editar" } 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [user, productId, apiUrl, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user.id,
      }))
    }
  }, [user])

  // Effect para validar el paso actual cuando cambian los datos
  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      // Pasar tanto imágenes nuevas como existentes a la validación
      const { isValid, errors: validationErrors } = validateStep(
        currentStep, 
        formData, 
        [...selectedImages, ...existingImages]
      )
      setErrors(validationErrors)
      setStepValidation((prev) => ({ ...prev, [currentStep]: isValid }))
    }
  }, [formData, selectedImages, existingImages, touchedFields, currentStep])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    })
  }

  const handleWineTypeSelect = (wineTypeId) => {
    setFormData({
      ...formData,
      wine_type_id: wineTypeId.toString(),
    })
    setTouchedFields({
      ...touchedFields,
      wine_type_id: true,
    })

    // Solo avanzar si la selección es válida
    if (wineTypeId) {
      const newErrors = { ...errors }
      delete newErrors.wine_type_id
      setErrors(newErrors)
      setStepValidation((prev) => ({ ...prev, 1: true }))

      if (formSectionRef.current) {
        setTimeout(() => {
          setCurrentStep(2)
          formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 300)
      }
    }
  }

  const handleImageSelect = (e) => {
    if (!e.target.files) return

    const files = Array.from(e.target.files)

    // Crear URLs de vista previa para los archivos seleccionados
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setSelectedImages((prevImages) => [...prevImages, ...newImages])
    setTouchedFields({
      ...touchedFields,
      image: true,
    })

    // Actualizar formData si no había imágenes antes
    if (files.length > 0 && selectedImages.length === 0 && existingImages.length === 0) {
      setFormData({
        ...formData,
        image: "file_upload", // Marcador de posición, el archivo real se enviará en FormData
      })
    }
  }

  // Función para eliminar una imagen nueva
  const removeImage = (index) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages]
      // Revocar la URL del objeto para evitar fugas de memoria
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })

    // Actualizar formData si se eliminan todas las imágenes
    if (selectedImages.length === 1 && existingImages.length === 0) {
      setFormData({
        ...formData,
        image: "",
      })
      
      // Marcar el campo como tocado para que se valide
      setTouchedFields({
        ...touchedFields,
        image: true,
      })
    }
  }

  // Función mejorada para eliminar una imagen existente
  const removeExistingImage = (index) => {
    setExistingImages((prevImages) => {
      const newImages = [...prevImages]
      // Guardar el ID de la imagen eliminada para enviarlo al backend
      const removedImage = newImages[index]
      if (removedImage && removedImage.id) {
        setRemovedImageIds(prev => [...prev, removedImage.id])
      }
      newImages.splice(index, 1)
      return newImages
    })

    // Actualizar formData si se eliminan todas las imágenes
    if (existingImages.length === 1 && selectedImages.length === 0) {
      setFormData({
        ...formData,
        image: "",
      })
      
      // Marcar el campo como tocado para que se valide
      setTouchedFields({
        ...touchedFields,
        image: true,
      })
    }
  }

  const goToNextStep = () => {
    // Marcar todos los campos del paso actual como tocados
    const fieldsForCurrentStep = {}
    if (currentStep === 1) {
      fieldsForCurrentStep.wine_type_id = true
    } else if (currentStep === 2) {
      fieldsForCurrentStep.name = true
      fieldsForCurrentStep.origin = true
      fieldsForCurrentStep.year = true
      fieldsForCurrentStep.description = true
      fieldsForCurrentStep.image = true
    } else if (currentStep === 3) {
      fieldsForCurrentStep.price_demanded = true
      fieldsForCurrentStep.quantity = true
    }

    setTouchedFields({ ...touchedFields, ...fieldsForCurrentStep })

    // Validar el paso actual
    const { isValid } = validateStep(currentStep, formData, [...selectedImages, ...existingImages])

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
      if (currentStep === 2 && priceSectionRef.current) {
        priceSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Método de envío del formulario actualizado
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar el último paso antes de enviar
    const { isValid } = validateStep(3, formData, [...selectedImages, ...existingImages])
    if (!isValid) return

    try {
      // Crear FormData para cargas de archivos
      const formDataObj = new FormData()
      
      // Indicar que es una petición PUT
      formDataObj.append('_method', 'PUT');

      // Añadir todos los campos del formulario a FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          formDataObj.append(key, formData[key])
        }
      })

      // Añadir nuevos archivos de imagen a FormData
      if (selectedImages.length > 0) {
        selectedImages.forEach((img) => {
          formDataObj.append(`images[]`, img.file)
        })
      }
      
      // Añadir IDs de imágenes existentes que se mantienen
      if (existingImages.length > 0) {
        existingImages.forEach((img) => {
          formDataObj.append('existing_images[]', img.id)
        })
      }
      
      // Añadir IDs de imágenes eliminadas
      if (removedImageIds.length > 0) {
        removedImageIds.forEach(id => {
          formDataObj.append('removed_images[]', id)
        })
      }

      const response = await fetch(`${apiUrl}/v1/products/${productId}`, {
        method: "POST", // Usamos POST con _method=PUT para compatibilidad con FormData
        body: formDataObj,
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors)
        } else {
          throw new Error("Error al actualizar el producto")
        }
      } else {
        navigate(`/seller/dashboard`, {
          state: { successMessage: "Producto actualizado correctamente" }
        })
      }
    } catch (error) {
      // console.error("Error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 md:ml-[245px] p-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9A3E50] mx-auto"></div>
          <p className="mt-4 text-gray-700">Carregant producte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 md:ml-[245px] p-4 md:p-8 pb-20 bg-gray-50 min-h-screen">
        {/* Progress bar header */}
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Step 1: Wine Type Selection */}
            {currentStep === 1 && (
              <WineTypeSelector
                wineTypes={wineTypes}
                selectedTypeId={formData.wine_type_id}
                onSelect={handleWineTypeSelect}
                error={errors.wine_type_id?.[0]}
              />
            )}

            {/* Step 2: Wine Details Form */}
            <div ref={formSectionRef}>
              {currentStep === 2 && (
                <WineDetailsForm
                  formData={formData}
                  onChange={handleChange}
                  selectedImages={selectedImages}
                  existingImages={existingImages}
                  onImageSelect={handleImageSelect}
                  onImageRemove={removeImage}
                  onExistingImageRemove={removeExistingImage}
                  errors={errors}
                  touchedFields={touchedFields}
                  onPrevious={goToPreviousStep}
                  onNext={goToNextStep}
                  isNextEnabled={stepValidation[2]}
                  isEditMode={true}
                />
              )}
            </div>

            {/* Step 3: Wine Pricing Form */}
            <div ref={priceSectionRef}>
              {currentStep === 3 && (
                <WinePricingForm
                  formData={formData}
                  onChange={handleChange}
                  selectedImages={[...selectedImages, ...existingImages]}
                  errors={errors}
                  touchedFields={touchedFields}
                  onPrevious={goToPreviousStep}
                  isSubmitEnabled={stepValidation[3]}
                  isEditMode={true}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}