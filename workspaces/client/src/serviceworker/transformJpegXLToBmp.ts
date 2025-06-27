// @ts-expect-error - This is a workaround for the missing type definition
import jsquashWasmBinary from '@jsquash/jxl/codec/dec/jxl_dec.wasm';
import { init as jsquashInit } from '@jsquash/jxl/decode';
import encodeWebP from '@jsquash/webp/encode';

let decoderInstance: any = null;

export async function transformJpegXLToBmp(response: Response): Promise<Response> {
  if (!decoderInstance) {
    decoderInstance = await jsquashInit(undefined, {
      locateFile: () => {},
      wasmBinary: jsquashWasmBinary,
    });
  }

  const imageData = decoderInstance.decode(await response.arrayBuffer())!;
  const webpBinary = await encodeWebP(imageData, { quality: 80 });

  return new Response(webpBinary, {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'image/webp',
    },
  });
}
