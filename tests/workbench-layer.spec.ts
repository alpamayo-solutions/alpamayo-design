import { describe, expect, it } from 'vitest';

import designPackage from '../package.json';
import workbenchLayer from '../layers/workbench/nuxt.config';

describe('workbench Nuxt layer', () => {
    it('has an explicit package subpath export', () => {
        expect(designPackage.exports['./layers/workbench']).toBe('./layers/workbench/nuxt.config.ts');
    });

    it('registers only its scoped stylesheet', () => {
        expect(workbenchLayer.css).toHaveLength(1);
        expect(String(workbenchLayer.css?.[0])).toContain('workbench.css');
    });
});
