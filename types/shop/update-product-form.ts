export type EditableValue = { key: string; id?: number; value: string };
export type EditableAttribute = { key: string; id?: number; name: string; values: EditableValue[] };
export type EditableImage = { key: string; id?: number; url: string; file?: File; primary: boolean };
export type EditableVariant = {
  key: string;
  id?: number;
  sku?: string;
  selections: Record<string, string>;
  price: string;
  stock: string;
  images: EditableImage[];
};
export type UpdateProductFields = { name: string; categoryId: string; brandId: string; description: string };
