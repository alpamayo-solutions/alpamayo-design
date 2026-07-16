import { describe, expect, it } from 'vitest';
import skeletonPreset from './index.js';

const preset = skeletonPreset as any;

describe('Skeleton preset', () => {
    it('uses the shimmer sweep, not a flat pulse fade, when animation is not disabled', () => {
        const root = preset.root({ props: { shape: 'rectangle', animation: undefined } });

        expect(root.class).toContain('skeleton-shimmer');
        expect(root.class).not.toContain('animate-pulse');
        expect(root.class).not.toContain('bg-surface-200 dark:bg-surface-700');
    });

    it('falls back to a static flat color when animation is explicitly "none"', () => {
        const root = preset.root({ props: { shape: 'rectangle', animation: 'none' } });

        expect(root.class).not.toContain('skeleton-shimmer');
        expect(root.class).toContain('bg-surface-200 dark:bg-surface-700');
    });

    it('rounds fully for circle shape, softly for rectangle', () => {
        const circle = preset.root({ props: { shape: 'circle', animation: undefined } });
        const rectangle = preset.root({ props: { shape: 'rectangle', animation: undefined } });
        const roundingEntry = (result: any) =>
            result.class.find(
                (entry: unknown) =>
                    typeof entry === 'object' &&
                    entry !== null &&
                    ('rounded-full' in entry || 'rounded-md' in entry)
            );

        expect(roundingEntry(circle)).toMatchObject({ 'rounded-full': true, 'rounded-md': false });
        expect(roundingEntry(rectangle)).toMatchObject({ 'rounded-full': false, 'rounded-md': true });
    });
});
