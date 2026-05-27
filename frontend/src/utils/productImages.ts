import productAccessories from "../assets/productHubUSB-C7en1.jpg";
import productHeadphones from "../assets/productWH-1000XM5.jpg";
import productLaptop from "../assets/productMacBookProM3.jpg";
import productPhone from "../assets/productGalaxyS24Ultra.jpg";
import productSpeaker from "../assets/productJBLCharge5.jpg";

const productImageModules = import.meta.glob("../assets/product*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const normalizeImageKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const imageByProductName = Object.fromEntries(
  Object.entries(productImageModules).map(([path, src]) => {
    const filename = path.split("/").pop()?.replace(/\.(jpg|jpeg|png)$/i, "") || "";
    return [normalizeImageKey(filename), src];
  })
);

const imageByCategory: Record<string, string> = {
  Celulares: productPhone,
  Computadores: productLaptop,
  Laptops: productLaptop,
  Audifonos: productHeadphones,
  "Audífonos": productHeadphones,
  Bafles: productSpeaker,
  Accesorios: productAccessories,
  Tablets: productPhone,
};

export const getProductImage = (name: string, category: string) => {
  const key = normalizeImageKey(`product ${name}`);
  return imageByProductName[key] || imageByCategory[category] || productAccessories;
};

export const getImagesForCombo = (description: string) => {
  const lowerDescription = description.toLowerCase();
  const images = [
    lowerDescription.includes("laptop") ? productLaptop : null,
    lowerDescription.includes("tablet") ? productPhone : null,
    lowerDescription.includes("celular") ? productPhone : null,
    lowerDescription.includes("audifonos") ? productHeadphones : null,
    lowerDescription.includes("bafle") ? productSpeaker : null,
    lowerDescription.includes("cable") || lowerDescription.includes("cargador") || lowerDescription.includes("hub")
      ? productAccessories
      : null,
  ].filter(Boolean) as string[];

  return images.length > 0 ? images.slice(0, 3) : [productPhone, productHeadphones, productAccessories];
};
