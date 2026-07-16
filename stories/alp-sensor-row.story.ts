import { defineStory } from './_types';

export default defineStory({
    component: 'AlpSensorRow',
    group: 'Signature',
    title: 'Sensor Row',
    description: 'Single sensor readout row — icon, name, type, online state, value/unit.',
    variants: [
        {
            name: 'online',
            props: {
                name: 'Temp Sensor 1',
                type: 'Temperature',
                online: true,
                icon: 'pi pi-sun',
                value: 42.5,
                unit: '°C'
            }
        },
        {
            name: 'offline',
            props: {
                name: 'Vibration Sensor 2',
                type: 'Vibration',
                online: false,
                icon: 'pi pi-bolt',
                value: '--',
                unit: 'mm/s'
            }
        }
    ],
    snippet:
        '<AlpSensorRow name="Temp Sensor 1" type="Temperature" :online="true" icon="pi pi-sun" :value="42.5" unit="°C" />',
    sourcePath: 'components/alp/AlpSensorRow.vue'
});
