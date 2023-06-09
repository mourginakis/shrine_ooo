import { assert, describe, expect, it, test } from 'vitest';

import { shrine_backend_anony, shrine_backend_authed } from './actors';


describe('createTrove', () => {

    it('returns error on anonymous user', async () => {
        const result = await shrine_backend_anony.createTrove(
            'testTrove', 'test', ['tag1', 'tag2']
        );
        expect(result).toEqual({ 'err': 'Error: You must be logged in to create a trove.' });
    });


    it('succeeds on authed user', async () => {
        const result = await shrine_backend_authed.createTrove(
            'testTrove', 'test', ['tag1', 'tag2']
        );
        expect(result).toEqual({ 'ok': 'Trove successfully created.' });
    });

    
});



describe('revalueTrove', () => {
    it.skip('test not yet implemented', async () => {
        expect(true).toEqual(false);
    });
});



describe('dissolveTrove', () => {
    it.skip('test not yet implemented', async () => {
        expect(true).toEqual(false);
    });
});



describe('listTroves', () => {
    it.skip('test not yet implemented', async () => {
        expect(true).toEqual(false);
    });
});

