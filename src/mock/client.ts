import { ClientInterface, defaultClientConfig } from '../client/types';
import dc from './client_dc_service';
import updates from './client_updates';

const ClientMock: ClientInterface = {
  cfg: defaultClientConfig,
  dc,
  updates,
  plainCall: () => {},
  call: () => {},
  send: () => {},
  authorize: () => {},
};

export default ClientMock;
