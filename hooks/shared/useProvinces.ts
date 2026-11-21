"use client";

import { useEffect, useState } from "react";

export interface Province {
  name: string;
  code: number;
}

export const PROVINCES_API = "https://provinces.open-api.vn/api/v2";

let cachedProvinces: Province[] | null = null;

// Tên tỉnh lấy từ cùng API với địa chỉ shop để giá trị lọc khớp location sản phẩm; provinces null khi đang tải hoặc API lỗi.
export function useProvinces(enabled = true): { provinces: Province[] | null; failed: boolean } {
  const [provinces, setProvinces] = useState<Province[] | null>(cachedProvinces);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || provinces) return;
    const controller = new AbortController();
    fetch(`${PROVINCES_API}/p/`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: Province[]) => {
        cachedProvinces = data.map(({ name, code }) => ({ name, code }));
        setProvinces(cachedProvinces);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [enabled, provinces]);

  return { provinces, failed };
}

const cachedWards: Record<string, string[]> = {};

// Xã/phường lấy theo mã tỉnh của API; failed để form chặn tạo địa chỉ khi không có danh sách hợp lệ.
export function useWards(province: { name: string; code: number } | undefined): { wards: string[]; failed: boolean } {
  const [apiWards, setApiWards] = useState<Record<string, string[]>>(cachedWards);
  const [failedName, setFailedName] = useState<string | null>(null);
  const code = province?.code;
  const name = province?.name;

  useEffect(() => {
    if (code === undefined || name === undefined || apiWards[name]) return;
    const controller = new AbortController();
    fetch(`${PROVINCES_API}/p/${code}?depth=2`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: { wards: { name: string }[] }) => {
        cachedWards[name] = data.wards.map((ward) => ward.name);
        setApiWards({ ...cachedWards });
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailedName(name);
      });
    return () => controller.abort();
  }, [code, name, apiWards]);

  const wards = name === undefined ? [] : apiWards[name] ?? [];
  return { wards, failed: name !== undefined && !apiWards[name] && failedName === name };
}
