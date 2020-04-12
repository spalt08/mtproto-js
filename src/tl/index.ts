import { default as buildMtproto } from './mtproto/builder';
import { default as parseMtproto } from './mtproto/parser';
import { default as buildLayer105 } from './layer105/builder';
import { default as parseLayer105 } from './layer105/parser';
import { Reader32, Writer32 } from '../serialization';
import { MethodDeclMap as MtprotoMethodDeclMap } from './mtproto/types';
import { MethodDeclMap as Layer105MethodDeclMap } from './layer105/types';

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
} from './layer105/types';

export interface MethodDeclMap extends MtprotoMethodDeclMap, Layer105MethodDeclMap {
}

export const parse = (reader: Reader32) => parseMtproto(reader, parseLayer105);

const sharedBuffer = new Uint32Array(128 * 1024);
const writer = new Writer32(sharedBuffer);

export const build = (o: any) => {
  writer.pos = 0;
  buildMtproto(writer, o, () => buildLayer105(writer, o));
  return writer.buf.subarray(0, writer.pos);
};
