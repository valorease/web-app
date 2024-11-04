import { Target } from "@/types/target";

// [TODO]: Modificar o slugify para ML e AZ verificando como é utilizado nos
// sites de ambos. Atualmente, ambos são apensa genéricos,

const slugifyML = (original: string) => {
  return original
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const slugifyAZ = (original: string) => {
  return slugifyML(original);
};

export const slugify = (original: string, target: Target) => {
  return { ML: slugifyML, AZ: slugifyAZ }[target](original);
};

export const getURL = (name: string, target: Target): string => {
  if (target === "AZ") {
    return `https://amazon.com.br/s?k=iphone+15`;
    return `https://amazon.com.br/s?k=${slugifyAZ(name)}`;
  }

  if (target === "ML") {
    return `https://lista.mercadolivre.com.br/${slugifyML(name)}`;
  }

  return "";
};
