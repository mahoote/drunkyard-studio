import { supabase, supabaseGame } from '../supabaseClient'

export async function uploadImageFile(
    image: File,
    bucketName: string,
    tableName: string,
    gameId: number
) {
    if (!image) {
        console.error('No image provided')
        return
    }

    const fileName = `${Date.now()}_${image.name}` // Unique name for the file

    // Upload image to Supabase storage
    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, image)

    if (uploadError) {
        console.error(`Failed to upload image to the database: ${uploadError.message}`)
        return
    }

    // Fetch the public URL of the uploaded image
    const imageUrl = supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl

    if (imageUrl) {
        // Extract only the filename part from the URL
        const imageFileName = new URL(imageUrl).pathname.split('/').pop()

        // Update the row in the database with the image URL
        const { error: updateError } = await supabaseGame
            .from(tableName)
            .update({ custom_rules_image: imageFileName })
            .eq('id', gameId)

        if (updateError) {
            console.error(`Failed to update the game with the image: ${updateError.message}`)
        }
    }
}
