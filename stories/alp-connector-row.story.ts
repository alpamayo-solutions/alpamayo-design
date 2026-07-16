import { defineStory } from './_types';

export default defineStory({
    component: 'AlpConnectorRow',
    group: 'Signature',
    title: 'Connector Row',
    description: 'Datatag connector row with name, config path, type, and status pill.',
    variants: [
        {
            name: 'active',
            props: {
                name: 'temperature-sensor',
                path: 'line4/sander2/temp',
                type: 'OPC UA',
                status: 'Active',
                severity: 'success',
                pulse: true
            }
        },
        {
            name: 'error',
            props: {
                name: 'vibration-sensor',
                path: 'line4/sander3/vib',
                type: 'Modbus',
                status: 'Error',
                severity: 'danger',
                pulse: false
            }
        }
    ],
    snippet:
        '<AlpConnectorRow name="temperature-sensor" path="line4/sander2/temp" type="OPC UA" status="Active" severity="success" :pulse="true" />',
    sourcePath: 'components/alp/AlpConnectorRow.vue'
});
