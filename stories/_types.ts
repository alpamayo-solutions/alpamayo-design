export interface StoryVariant {
    name: string;
    props?: Record<string, unknown>;
    slots?: Record<string, string>;
}

export interface Story {
    /** Registered component name (VoltButton, AlpKpiCard). null for foundation cards. */
    component: string | null;
    group: 'Foundations' | 'Components' | 'Signature';
    title: string;
    description: string;
    variants: StoryVariant[];
    /** Copy-paste usage snippet shown in the card footer */
    snippet: string;
    /** Repo-relative source path of the component (or tokens file for foundations) */
    sourcePath: string;
}

export function defineStory(story: Story): Story {
    return story;
}
