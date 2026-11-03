import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defineConfig } from 'vite';

const readTrimmed = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch {
    return '';
  }
};

const resolveHostDeviceLabel = (): string => {
  const product = readTrimmed('/sys/devices/virtual/dmi/id/product_name');
  const vendor = readTrimmed('/sys/devices/virtual/dmi/id/sys_vendor');
  const board = readTrimmed('/sys/devices/virtual/dmi/id/board_name');

  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
  const productName = normalize(product);
  const vendorName = normalize(vendor);
  const boardName = normalize(board);

  if (vendorName && productName && !productName.toLowerCase().includes(vendorName.toLowerCase())) {
    return `${vendorName} ${productName}`;
  }
  if (productName) return productName;
  if (boardName) return boardName;

  return os.hostname();
};

const HOST_DEVICE_LABEL = resolveHostDeviceLabel();
const HOST_RAM_TOTAL_GB = os.totalmem() / 1024 ** 3;
const HOST_RAM_USED_GB = (os.totalmem() - os.freemem()) / 1024 ** 3;
const HOST_CPU_PERCENT = (os.loadavg()[0] / Math.max(1, os.cpus().length)) * 100;

const formatGb = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  define: {
    __HOST_DEVICE_LABEL__: JSON.stringify(HOST_DEVICE_LABEL),
    __HOST_RAM_TOTAL_GB__: JSON.stringify(formatGb(HOST_RAM_TOTAL_GB)),
    __HOST_RAM_USED_GB__: JSON.stringify(formatGb(HOST_RAM_USED_GB)),
    __HOST_CPU_PERCENT__: JSON.stringify(Math.max(0, Math.min(100, Math.round(HOST_CPU_PERCENT))))
  },
  server: {
    allowedHosts: ['jacksonm.dev'],
  }
});


