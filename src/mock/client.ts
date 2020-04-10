import { ClientInterface, defaultClientConfig } from '../client/types';
import tl from './tl';
import dc from './client_dc_service';
import updates from './client_updates';

const ClientMock: ClientInterface = {
  cfg: defaultClientConfig,
  tl,
  dc,
  updates,
  plainCall: () => {},
  call: () => {},
  send: () => {},
};

export default ClientMock;
