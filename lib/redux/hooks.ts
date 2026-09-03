"use client";

import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./store";

// Hook dispatch có kiểu dữ liệu của store hiện tại.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Hook selector có kiểu dữ liệu state của store hiện tại.
export const useAppSelector = useSelector.withTypes<RootState>();
