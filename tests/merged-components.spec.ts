import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AlpStatusDot from '../components/alp/AlpStatusDot.vue';
import AlpStatusPill from '../components/alp/AlpStatusPill.vue';
import AlpMetricBar from '../components/alp/AlpMetricBar.vue';
import AlpEmptySection from '../components/alp/AlpEmptySection.vue';
import AlpConfirmDialog from '../components/alp/AlpConfirmDialog.vue';

describe('AlpStatusDot status mapping', () => {
    it('maps online to success and animates', () => {
        const w = mount(AlpStatusDot, { props: { status: 'online' } });
        expect(w.html()).toContain('bg-success-500');
        expect(w.html()).toContain('animate-ping');
    });
    it('maps offline to danger without ping', () => {
        const w = mount(AlpStatusDot, { props: { status: 'offline' } });
        expect(w.html()).toContain('bg-danger-500');
        expect(w.html()).not.toContain('animate-ping');
    });
    it('keeps severity API working', () => {
        const w = mount(AlpStatusDot, { props: { severity: 'warning' } });
        expect(w.html()).toContain('bg-warning-400');
    });
});

describe('AlpStatusPill status mapping', () => {
    it('maps deployed to success and humanizes label', () => {
        const w = mount(AlpStatusPill, { props: { status: 'deployed' } });
        expect(w.html()).toContain('bg-success-100');
        expect(w.text()).toBe('deployed');
    });
    it('humanizes underscores', () => {
        const w = mount(AlpStatusPill, { props: { status: 'on_hold' } });
        expect(w.text()).toBe('on hold');
        expect(w.html()).toContain('bg-warning-100');
    });
    it('unknown status falls back to neutral', () => {
        const w = mount(AlpStatusPill, { props: { status: 'weird_state' } });
        expect(w.html()).toContain('bg-surface-100');
    });
});

describe('AlpMetricBar', () => {
    it('block variant shows label and value', () => {
        const w = mount(AlpMetricBar, { props: { label: 'CPU', value: 42, barColor: 'bg-primary-500' } });
        expect(w.text()).toContain('CPU');
        expect(w.text()).toContain('42%');
    });
    it('inline variant auto-colors by threshold', () => {
        const w = mount(AlpMetricBar, { props: { value: 95, variant: 'inline', autoColor: true } });
        expect(w.html()).toContain('bg-danger-500');
    });
    it('inline variant renders em dash for null', () => {
        const w = mount(AlpMetricBar, { props: { value: null, variant: 'inline' } });
        expect(w.text()).toContain('—');
    });
    it('invertThreshold treats low as bad', () => {
        const w = mount(AlpMetricBar, {
            props: { value: 5, variant: 'inline', autoColor: true, invertThreshold: true }
        });
        expect(w.html()).toContain('bg-danger-500');
    });
});

describe('AlpEmptySection', () => {
    it('renders message and severity icon color', () => {
        const w = mount(AlpEmptySection, {
            props: { message: 'No deployments yet', icon: 'pi pi-inbox', severity: 'info' },
            global: { stubs: { NuxtLink: true } }
        });
        expect(w.text()).toContain('No deployments yet');
        expect(w.html()).toContain('text-info-500');
    });
});

// design.confirm.* keys aren't in i18n/locales/*/design.json yet (Task A9
// adds them) — stub the messages locally, same pattern used to test other
// useI18n()-driven components before their locale entries land.
const confirmI18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            design: { confirm: { cancel: 'Cancel', confirm: 'Confirm', notesPlaceholder: 'Optional note' } }
        }
    }
});

// Local functional stubs for the Volt primitives AlpConfirmDialog composes.
// They mirror just enough of the real Dialog/Button/Textarea/Message
// contracts (props + v-model style events) to drive the merged component's
// own behavior without pulling in PrimeVue's Teleport/focus-trap machinery.
const VoltDialogStub = {
    props: ['visible', 'header', 'closable'],
    emits: ['update:visible'],
    template:
        '<div v-if="visible">' +
        '<header>{{ header }}</header>' +
        '<slot />' +
        '<footer><slot name="footer" /></footer>' +
        '<button data-testid="dialog-x" @click="$emit(\'update:visible\', false)">x</button>' +
        '</div>'
};
const VoltButtonStub = {
    props: ['label', 'severity', 'icon', 'loading', 'disabled'],
    emits: ['click'],
    template:
        '<button :disabled="disabled" :data-severity="severity" :data-loading="loading" @click="$emit(\'click\')">{{ label }}</button>'
};
const VoltTextareaStub = {
    props: ['modelValue', 'rows', 'placeholder'],
    emits: ['update:modelValue'],
    template:
        '<textarea data-testid="notes" :value="modelValue" :placeholder="placeholder" @input="$emit(\'update:modelValue\', $event.target.value)" />'
};
const VoltMessageStub = {
    props: ['severity'],
    template: '<div data-testid="error-message" :data-severity="severity"><slot /></div>'
};

const confirmGlobal = {
    plugins: [confirmI18n],
    components: {
        VoltDialog: VoltDialogStub,
        VoltButton: VoltButtonStub,
        VoltTextarea: VoltTextareaStub,
        VoltMessage: VoltMessageStub
    }
};

describe('AlpConfirmDialog', () => {
    it('emits confirm with an empty string by default (no notes)', async () => {
        const w = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Delete device' },
            global: confirmGlobal
        });
        await w.find('button[data-severity="danger"]').trigger('click');
        expect(w.emitted('confirm')).toEqual([['']]);
    });

    it('emits confirm with the typed notes when withNotes is set', async () => {
        const w = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Set target revision', withNotes: true },
            global: confirmGlobal
        });
        await w.find('[data-testid="notes"]').setValue('rolling out overnight');
        await w.find('button[data-severity="danger"]').trigger('click');
        expect(w.emitted('confirm')).toEqual([['rolling out overnight']]);
    });

    it('emits update:visible=false and cancel when the cancel button is clicked', async () => {
        const w = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Delete device' },
            global: confirmGlobal
        });
        await w.find('button[data-severity="ghost"]').trigger('click');
        expect(w.emitted('update:visible')).toEqual([[false]]);
        expect(w.emitted('cancel')).toHaveLength(1);
    });

    it('suppresses close (no update:visible/cancel) while loading', async () => {
        const w = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Delete device', loading: true },
            global: confirmGlobal
        });
        await w.find('[data-testid="dialog-x"]').trigger('click');
        expect(w.emitted('update:visible')).toBeUndefined();
        expect(w.emitted('cancel')).toBeUndefined();
    });

    it('renders the error message via VoltMessage severity="error"', () => {
        const w = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Delete device', error: 'Delete failed: device is online.' },
            global: confirmGlobal
        });
        const msg = w.find('[data-testid="error-message"]');
        expect(msg.exists()).toBe(true);
        expect(msg.attributes('data-severity')).toBe('error');
        expect(msg.text()).toContain('Delete failed: device is online.');
    });

    it('renders entityName emphasized inside the message', () => {
        const w = mount(AlpConfirmDialog, {
            props: {
                visible: true,
                title: 'Delete device',
                message: 'Delete device',
                entityName: 'edge-node-01'
            },
            global: confirmGlobal
        });
        expect(w.text()).toContain('Delete device');
        expect(w.text()).toContain('edge-node-01?');
        const emphasized = w.findAll('span').find((s) => s.text() === 'edge-node-01');
        expect(emphasized).toBeTruthy();
        expect(emphasized!.classes()).toContain('font-medium');
    });

    it('defaults confirmSeverity to danger and honors an explicit override', () => {
        const w = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Delete device' },
            global: confirmGlobal
        });
        expect(w.find('button[data-severity="danger"]').exists()).toBe(true);

        const action = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Set target', confirmSeverity: 'primary' },
            global: confirmGlobal
        });
        expect(action.find('button[data-severity="primary"]').exists()).toBe(true);
        expect(action.find('button[data-severity="danger"]').exists()).toBe(false);
    });

    it('resets notes when the dialog is re-opened', async () => {
        const w = mount(AlpConfirmDialog, {
            props: { visible: true, title: 'Set target', withNotes: true },
            global: confirmGlobal
        });
        await w.find('[data-testid="notes"]').setValue('draft note');
        expect((w.find('[data-testid="notes"]').element as HTMLTextAreaElement).value).toBe('draft note');

        await w.setProps({ visible: false });
        await w.setProps({ visible: true });

        expect((w.find('[data-testid="notes"]').element as HTMLTextAreaElement).value).toBe('');
    });
});
