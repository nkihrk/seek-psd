import { validate as uuidValidate } from 'uuid';

export function validateFormat($file: File, $regExp: string): boolean {
  const regex = new RegExp($regExp);
  return $file.type ? regex.test($file.type) : regex.test($file.name);
}

export function validateUuid($uuid: string): boolean {
  return uuidValidate($uuid);
}
