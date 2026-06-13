export const LIMITE_NOME = 50;
export const LIMITE_EMAIL = 50;
export const LIMITE_SENHA = 16;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValido(email: string) {
  const emailNormalizado = email.trim().toLowerCase();

  return emailNormalizado.length <= LIMITE_EMAIL && EMAIL_REGEX.test(emailNormalizado);
}
