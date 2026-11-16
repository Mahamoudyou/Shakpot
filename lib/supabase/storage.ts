import { createClient } from "./client";

/**
 * Téléverse directement une image vers Supabase Storage dans le bucket 'restaurant-media'.
 * Si Supabase n'est pas encore joignable, génère une URL de secours (Data URL).
 */
export async function uploadProductImage(
  file: File,
  folder: "products" | "categories" | "logos" = "products"
): Promise<{ url: string; error?: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isMock = !supabaseUrl || supabaseUrl.includes("votre-projet") || supabaseUrl.includes("mock.supabase.co");

    // Si Supabase n'est pas encore configuré avec une URL valide, fallback local direct
    if (isMock) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ url: "", error: "Erreur lors de la lecture du fichier en local." });
        };
        reader.readAsDataURL(file);
      });
    }

    const supabase = createClient();
    
    // Nettoyer et générer un nom de fichier unique et sécurisé
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const sanitizedBase = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);

    const fileName = `${folder}/${Date.now()}_${sanitizedBase}.${fileExt}`;

    // Téléversement direct dans le bucket 'restaurant-media'
    const { data, error } = await supabase.storage
      .from("restaurant-media")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || `image/${fileExt}`,
      });

    if (error) {
      console.warn("Supabase Storage upload warning:", error.message);
      // Fallback local si le bucket n'est pas encore créé
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string, error: `Upload distant échoué (${error.message}), aperçu local utilisé.` });
        };
        reader.readAsDataURL(file);
      });
    }

    // Récupérer l'URL publique directe
    const { data: publicUrlData } = supabase.storage
      .from("restaurant-media")
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.error("Upload error:", err);
    return { url: "", error: err?.message || "Erreur inconnue lors du téléversement." };
  }
}

