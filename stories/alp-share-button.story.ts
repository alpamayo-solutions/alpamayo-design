import { defineStory } from './_types';

export default defineStory({
    component: 'AlpShareButton',
    group: 'Signature',
    title: 'Share Button',
    description:
        'Presentational share-link shell — trigger button + anchored popover with a TTL-days input, an optional password, and a create/copy/revoke flow. No network or clipboard: the caller creates the link, writes the clipboard, and reflects loading/copied/error/shareUrl back as props.',
    variants: [
        {
            name: 'idle',
            props: {}
        },
        {
            name: 'loading',
            props: {
                loading: true
            }
        },
        {
            name: 'copied',
            props: {
                shareUrl: 'https://example.com/s/a1b2c3d4',
                copied: true
            }
        },
        {
            name: 'error',
            props: {
                error: 'Share link failed.'
            }
        }
    ],
    snippet:
        '<AlpShareButton\n  :share-url="shareUrl"\n  :loading="creating"\n  :copied="copied"\n  :error="shareError"\n  :max-ttl-days="7"\n  @create="onCreate"\n  @copy="onCopy"\n  @revoke="onRevoke"\n/>',
    sourcePath: 'components/alp/AlpShareButton.vue'
});
