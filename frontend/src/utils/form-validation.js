export const validateStep = (step, formData, selectedImages) => {
    let isValid = true
    const errors = {}
  
    if (step === 1) {
      if (!formData.wine_type_id) {
        errors.wine_type_id = ["Has de seleccionar un tipus de vi"]
        isValid = false
      }
    } else if (step === 2) {
      if (!formData.name) {
        errors.name = ["El nom és obligatori"]
        isValid = false
      }
      if (!formData.origin) {
        errors.origin = ["L'origen és obligatori"]
        isValid = false
      }
      if (!formData.year) {
        errors.year = ["L'any és obligatori"]
        isValid = false
      } else if (Number.parseInt(formData.year) < 1900 || Number.parseInt(formData.year) > new Date().getFullYear()) {
        errors.year = ["L'any ha de ser vàlid"]
        isValid = false
      }
      if (!formData.description) {
        errors.description = ["La descripció és obligatòria"]
        isValid = false
      } else if (formData.description.length > 255) {
        errors.description = ["La descripció no pot superar els 255 caràcters"]
        isValid = false
      }
      if (selectedImages.length === 0) {
        errors.image = ["Has de pujar almenys una imatge"]
        isValid = false
      }
    } else if (step === 3) {
      if (!formData.price_demanded) {
        errors.price_demanded = ["El preu és obligatori"]
        isValid = false
      } else if (Number.parseFloat(formData.price_demanded) <= 0) {
        errors.price_demanded = ["El preu ha de ser major que 0"]
        isValid = false
      }
      if (!formData.quantity) {
        errors.quantity = ["La quantitat és obligatòria"]
        isValid = false
      } else if (Number.parseInt(formData.quantity) <= 0) {
        errors.quantity = ["La quantitat ha de ser major que 0"]
        isValid = false
      }
    }
  
    return { isValid, errors }
  }
  
  