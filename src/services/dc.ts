/**
 * Helper class for managing datacenters
 */
export default class DCService {
  static Alias: Record<number, string> = {
    1: 'pluto',
    2: 'venus',
    3: 'aurora',
    4: 'vesta',
    5: 'flora',
  };

  /** Default datacenter */
  default: number = 2;

  constructor(base?: number) {
    if (base) this.default = base;
  }

  /** Resolve hostname by dc id */
  getHost(id: number = this.default, isCDN: boolean = false) {
    return `${DCService.Alias[id]}${isCDN ? '' : '-1'}.web.telegram.org`;
  }
}
