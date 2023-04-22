import { Principal } from "@dfinity/principal";
import { assert, describe, expect, it } from 'vitest';

import { shrine_backend_anony, shrine_backend_authed } from './actors';




describe('whoami', () => {
    it('returns anonymous user', async () => {
      const result = await shrine_backend_anony.whoami() as unknown as Principal;
      expect(result.toString()).toEqual('2vxsx-fae');
    });
    it('returns authed user', async () => {
        const result = await shrine_backend_authed.whoami() as unknown as Principal;
        expect(result.toString()).toEqual("lsmxf-qps3b-dfjhw-njhat-2enm6-iysq5-gflw4-5c2as-i7r4s-37pfu-pae");
    });
  });