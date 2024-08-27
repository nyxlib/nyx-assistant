<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {computed} from 'vue';

import * as uuid from 'uuid';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    devices: {
        type: Object,
        required: true,
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedDevices = computed(() => [...Object.values(props.devices)].sort((x, y) => x.rank - y.rank));

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

let rank = 0;

/*--------------------------------------------------------------------------------------------------------------------*/

const templateAppend = () => {

    alert('To be implemented');
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deviceAppend = () => {

    const id = `device:${uuid.v4()}`;

    props.devices[id] = {
        id: id,
        rank: rank,
        name: '',
        disabled: false,
        vectors: {},
    };

    rank++;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deviceRm = (device) => {

    delete props.devices[device.id];
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deviceDw = (device1) => {

    const array = sortedDevices.value;

    const index = array.findIndex((device2) => device2.id === device1.id);

    if(index > 0x00000000000000)
    {
        const device2 = array[index - 1];

        device1.rank--;
        device2.rank++;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deviceUp = (device1) => {

    const array = sortedDevices.value;

    const index = array.findIndex((device2) => device2.id === device1.id);

    if(index < array.length - 1)
    {
        const device2 = array[index + 1];

        device1.rank++;
        device2.rank--;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="card">
        <div class="card-header px-3 py-2">
            <i class="bi bi-cpu"></i>
            Devices
            [
            <button class="btn btn-xs btn-primary me-1" type="button" @click="deviceAppend()">
                <i class="bi bi-plus-lg"></i>
                Add device
            </button>
            <button class="btn btn-xs btn-primary me-0" type="button" @click="templateAppend()">
                <i class="bi bi-plus-lg"></i>
                Add from template
            </button>
            ]
        </div>
        <div class="card-body px-3 py-2">

            <!-- *************************************************************************************************** -->

            <table class="table table-sm table-striped">

                <!-- *********************************************************************************************** -->

                <thead>
                    <tr>
                        <th class="text-center" style="width: 105px;">
                            Tools
                        </th>
                        <th class="text-center" style="width: auto;">
                            Device name
                        </th>
                    </tr>
                </thead>

                <!-- *********************************************************************************************** -->

                <tbody>
                    <tr v-for="device in sortedDevices" :key="device.id">
                        <td class="text-center">
                            <button class="btn btn-sm btn-link" type="button" @click="deviceDw(device)">
                                <i class="bi bi-caret-up-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-link" type="button" @click="deviceUp(device)">
                                <i class="bi bi-caret-down-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-link" type="button" @click="deviceRm(device)">
                                <i class="bi bi-trash2 text-danger"></i>
                            </button>
                        </td>
                        <td class="text-start">
                            <input class="form-control form-control-sm" type="text" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model="device.name" />
                        </td>
                    </tr>
                </tbody>

                <!-- *********************************************************************************************** -->

            </table>

            <!-- *************************************************************************************************** -->

        </div>
    </div>

    <!-- *********************************************************************************************************** -->

</template>
