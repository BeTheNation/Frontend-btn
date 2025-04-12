declare module "react" {
  import React from "react";

  export default React;
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useContext: typeof React.useContext;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useRef: typeof React.useRef;
  export const useReducer: typeof React.useReducer;
  export const createContext: typeof React.createContext;
  export const memo: typeof React.memo;
  export const forwardRef: typeof React.forwardRef;

  export type FC<P = {}> = React.FC<P>;
  export type ReactNode = React.ReactNode;
  export type CSSProperties = React.CSSProperties;
  export type ChangeEvent<T> = React.ChangeEvent<T>;
  export type FormEvent<T> = React.FormEvent<T>;
  export type MouseEvent<T> = React.MouseEvent<T>;

  // Additional types needed for UI components
  export type ElementRef<T> = React.ElementRef<T>;
  export type ComponentPropsWithoutRef<T> = React.ComponentPropsWithoutRef<T>;
  export type ComponentProps<T> = React.ComponentProps<T>;
  export type ReactElement<T> = React.ReactElement<T>;
  export type HTMLAttributes<T> = React.HTMLAttributes<T>;
  export type InputHTMLAttributes<T> = React.InputHTMLAttributes<T>;
  export type ThHTMLAttributes<T> = React.ThHTMLAttributes<T>;
  export type TdHTMLAttributes<T> = React.TdHTMLAttributes<T>;

  // Add className to HTMLAttributes
  export interface HTMLAttributes<T> {
    className?: string;
    [key: string]: any;
  }
}

declare module "recharts";
declare module "wagmi";

declare module "viem" {
  export type Address = `0x${string}`;
  export function parseEther(value: string): bigint;
  export function formatEther(value: bigint): string;
}

declare module "hardhat" {
  import { ContractFactory } from "ethers";

  export const ethers: {
    getContractFactory(name: string): Promise<ContractFactory>;
    parseEther(value: string): bigint;
    getSigners(): Promise<any[]>;
    provider: {
      getBalance(address: string): Promise<any>;
    };
    // Add more types as needed
  };
}

declare module "dotenv";

declare module "chai";

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
