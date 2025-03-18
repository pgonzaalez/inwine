import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useFetchUser } from "@components/auth/FetchUser"
import { ProgressBar } from "@/components/product/progress-bar"
import { WineTypeSelector } from "@/components/product/wine-type-selector"
import { WineDetailsForm } from "@/components/product/wine-details-form"
import { WinePricingForm } from "@/components/product/wine-pricing-form"
import { validateStep } from "@/utils/form-validation"

export default function CreateProduct() {
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
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL
  const formSectionRef = useRef(null)
  const priceSectionRef = useRef(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [touchedFields, setTouchedFields] = useState({})

  useEffect(() => {
    const fetchWineTypes = async () => {
      const response = await fetch(`${apiUrl}/v1/winetypes`)
      const data = await response.json()
      setWineTypes(data)
    }
    fetchWineTypes()
  }, [apiUrl])

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user.id,
      }))
    }
  }, [user])

  // Effect to validate the current step when data changes
  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      const { isValid, errors: validationErrors } = validateStep(currentStep, formData, selectedImages)
      setErrors(validationErrors)
      setStepValidation((prev) => ({ ...prev, [currentStep]: isValid }))
    }
  }, [formData, selectedImages, touchedFields, currentStep])

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

    // Only advance if the selection is valid
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

    // Create preview URLs for the selected files
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setSelectedImages((prevImages) => [...prevImages, ...newImages])
    setTouchedFields({
      ...touchedFields,
      image: true,
    })

    // Update the form data with the first image file for backend compatibility
    if (files.length > 0 && selectedImages.length === 0) {
      setFormData({
        ...formData,
        image: "file_upload", // This is a placeholder, the actual file will be sent in FormData
      })
    }
  }

  // Function to remove an image
  const removeImage = (index) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages]
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })

    // Update form data if all images are removed
    if (selectedImages.length === 1) {
      setFormData({
        ...formData,
        image: "",
      })
    }
  }

  const goToNextStep = () => {
    // Mark all fields for the current step as touched
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

    // Validate the current step
    const { isValid } = validateStep(currentStep, formData, selectedImages)

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate the last step before sending
    const { isValid } = validateStep(3, formData, selectedImages)
    if (!isValid) return

    try {
      // Create FormData object for file uploads
      const formDataObj = new FormData()

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          formDataObj.append(key, formData[key])
        }
      })

      // Add image files to FormData
      selectedImages.forEach((img) => {
        formDataObj.append(`images[]`, img.file) // Changed to images[] for Laravel
      })

      const response = await fetch(`${apiUrl}/v1/products`, {
        method: "POST",
        body: formDataObj, // Send FormData instead of JSON
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors)
        } else {
          throw new Error("Error en crear el producto")
        }
      } else {
        navigate("/")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 md:ml-[245px] p-4 md:p-8 pb-20 bg-gray-50 min-h-screen">
        {/* Progress bar header */}
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-5">Que vols vendre?</h1>
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
                  onImageSelect={handleImageSelect}
                  onImageRemove={removeImage}
                  errors={errors}
                  touchedFields={touchedFields}
                  onPrevious={goToPreviousStep}
                  onNext={goToNextStep}
                  isNextEnabled={stepValidation[2]}
                />
              )}
            </div>

            {/* Step 3: Wine Pricing Form */}
            <div ref={priceSectionRef}>
              {currentStep === 3 && (
                <WinePricingForm
                  formData={formData}
                  onChange={handleChange}
                  selectedImages={selectedImages}
                  errors={errors}
                  touchedFields={touchedFields}
                  onPrevious={goToPreviousStep}
                  isSubmitEnabled={stepValidation[3]}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

