import { validate as uuidValidate } from 'uuid';

export function validateFormat($fileName: string, $regExp: string): boolean {
  const regex = new RegExp($regExp);
  return regex.test($fileName);
}

export function validateUuid($uuid: string): boolean {
  return uuidValidate($uuid);
}
