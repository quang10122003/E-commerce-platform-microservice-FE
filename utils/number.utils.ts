// Rút gọn số lượng theo mốc nghìn, triệu, tỷ và thêm dấu cộng.
export function formatCountThreshold(count: number): string {
  if (!Number.isFinite(count) || count < 0) return "0";

  const units = [
    { value: 1_000_000_000, suffix: "b" },
    { value: 1_000_000, suffix: "m" },
    { value: 1_000, suffix: "k" },
  ];

  // Chọn mốc lớn nhất và làm tròn xuống để không phóng đại số lượng.
  const unit = units.find(({ value }) => count >= value);
  return unit
    ? `${Math.floor(count / unit.value)}${unit.suffix}+`
    : String(Math.floor(count));
}
