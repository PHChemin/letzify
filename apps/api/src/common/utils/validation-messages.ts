export const ValidationMessages = {
  IsString: (property: string) => `O campo ${property} deve ser uma string.`,
  IsNotEmpty: (property: string) => `O campo ${property} é obrigatório.`,
  MinLength: (property: string, min: number) =>
    `O campo ${property} deve ter pelo menos ${min} caracteres.`,
  MaxLength: (property: string, max: number) =>
    `O campo ${property} deve ter no máximo ${max} caracteres.`,
  IsEnum: (property: string) => `O campo ${property} deve ser um valor válido.`,
  IsInt: (property: string) =>
    `O campo ${property} deve ser um número inteiro.`,
  IsNumber: (property: string) => `O campo ${property} deve ser um número.`,
  Min: (property: string, min: number) =>
    `O campo ${property} deve ser maior ou igual a ${min}.`,
  Max: (property: string, max: number) =>
    `O campo ${property} deve ser menor ou igual a ${max}.`,
  IsEmail: (property: string) =>
    `O campo ${property} deve ser um e-mail válido.`,
  IsUUID: (property: string) => `O campo ${property} deve ser um UUID válido.`,
  IsDate: (property: string) => `O campo ${property} deve ser uma data válida.`,
  IsOptional: (property: string) => `O campo ${property} é opcional.`,
  IsBoolean: (property: string) => `O campo ${property} deve ser booleano.`,
  IsHexCode: (property: string) =>
    `O campo ${property} deve ser um código hexadecimal válido.`,
};
