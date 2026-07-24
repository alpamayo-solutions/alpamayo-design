import { describe, expect, it } from 'vitest';

import workbenchLayer from '../layers/workbench/nuxt.config';

describe('workbench Nuxt layer', () => {
    it('registers only its scoped stylesheet', () => {
        expect(workbenchLayer.css).toHaveLength(1);
        expect(String(workbenchLayer.css?.[0])).toContain('workbench.css');
    });
});
