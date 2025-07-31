// cloudinary.ts

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_APP_CLOUDFLARE_NAME
  const unsignedPreset = import.meta.env.VITE_APP_INSIGNED_PRESET_NAME // nom du preset non signé

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', unsignedPreset)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Échec de l’upload vers Cloudinary.')
    }

    const data = await response.json()
    return data.secure_url as string
  } catch (error) {
    console.error('Erreur lors de l’upload vers Cloudinary :', error)
    throw error
  }
}
