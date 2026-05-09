import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInMonths, differenceInYears } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcularIdade(dataNascimento: string): string {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  const anos = differenceInYears(hoje, nascimento);
  const meses = differenceInMonths(hoje, nascimento) % 12;

  if (anos === 0) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  if (meses === 0) return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${meses === 1 ? "mês" : "meses"}`;
}

export function calcularIdadeEmMeses(dataNascimento: string): number {
  return differenceInMonths(new Date(), new Date(dataNascimento));
}

export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR");
}
