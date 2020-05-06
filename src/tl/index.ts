import { default as buildMtproto } from './mtproto/builder';
import { default as parseMtproto } from './mtproto/parser';
import { default as buildLayer } from './layer113/builder';
import { default as parseLayer } from './layer113/parser';
import { Reader32, Writer32 } from '../serialization';
import { MethodDeclMap as MtprotoMethodDeclMap } from './mtproto/types';
import { MethodDeclMap as LayerMethodDeclMap } from './layer113/types';

// types
export {
  ResPQ, BadMsgNotification, NewSession, RpcResult, Req_DH_params,
  Set_client_DH_params, Server_DH_inner_data,
} from './mtproto/types';

export {
  UpdateDeclMap,
  AuthBindTempAuthKey,
  InputCheckPasswordSRP,
  AccountPassword,
} from './layer113/types';

export interface MethodDeclMap extends MtprotoMethodDeclMap, LayerMethodDeclMap {
}

export const parse = (reader: Reader32) => parseMtproto(reader, parseLayer);

const sharedBuffer = new Uint32Array(128 * 1024);
const writer = new Writer32(sharedBuffer);

export const build = (o: any) => {
  writer.pos = 0;
  buildMtproto(writer, o, () => buildLayer(writer, o));
  return writer.buf.subarray(0, writer.pos);
};
