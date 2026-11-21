// Bỏ dấu cách, chấm, gạch và đổi đầu số +84/84 về 0 vì BE chỉ nhận dạng 0xxxxxxxxx.
export function normalizePhone(value: string) {
  return value.replace(/[\s.-]/g, "").replace(/^(\+84|84)/, "0");
}

// Di động 10 số đầu 03/05/07/08/09, cố định 11 số đầu 02.
export const PHONE_PATTERN = /^(0[35789]\d{8}|02\d{9})$/;
