// Hàm chia mảng thành các phần con
export function useChunkArray(array: string[], size: number): string[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
}
