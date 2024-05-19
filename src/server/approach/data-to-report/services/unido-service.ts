import { read, ParquetFiles } from "../data/parquet/read";

export const unidoService = {
  getUnido() {
    return read(ParquetFiles.UNIDO);
  },
};
