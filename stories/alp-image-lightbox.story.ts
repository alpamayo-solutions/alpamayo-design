import { defineStory } from './_types';

export default defineStory({
    component: 'AlpImageLightbox',
    group: 'Components',
    title: 'Image Lightbox',
    description:
        'Thumbnail grid that opens a fullscreen lightbox with keyboard navigation (arrow keys cycle, Escape closes).',
    variants: [
        {
            name: 'gallery',
            props: {
                images: [
                    { id: '1', url: 'https://placehold.co/200x200', filename: 'edge-node-04-front.jpg' },
                    { id: '2', url: 'https://placehold.co/200x200', filename: 'edge-node-04-side.jpg' },
                    { id: '3', url: 'https://placehold.co/200x200', filename: 'edge-node-04-back.jpg' }
                ]
            }
        },
        {
            name: 'single-image',
            props: {
                images: [{ id: '1', url: 'https://placehold.co/200x200', filename: 'edge-node-07.jpg' }]
            }
        },
        {
            name: 'empty',
            props: {
                images: []
            }
        }
    ],
    snippet:
        "<AlpImageLightbox :images=\"[{ id: '1', url: '/photo.jpg', filename: 'edge-node-04.jpg' }]\" />",
    sourcePath: 'components/alp/AlpImageLightbox.vue'
});
