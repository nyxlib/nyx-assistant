<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {ref, watchEffect} from 'vue';

import draggable from 'vuedraggable';

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

const sortedDevices = ref([]);

watchEffect(() => {

    sortedDevices.value = [...Object.values(props.devices)].sort((a, b) => a.rank - b.rank);
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const templateAppend = () => {

    alert('To be implemented');
};

/*--------------------------------------------------------------------------------------------------------------------*/

const onDragEnd = () => {

    for(let i = 0; i < sortedDevices.value.length; i++)
    {
        const addon = sortedDevices.value[i];

        props.devices[addon.id].rank = i;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deviceAppend = () => {

    const id = `device:${uuid.v4()}`;

    const rank = Date.now();

    props.devices[id] = {
        id: id,
        rank: rank,
        name: '',
        parentClass: '',
        additionalHeaders: '',
        disabled: false,
        vectors: {},
    };
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deviceRm = (device) => {

    delete props.devices[device.id];
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="card mb-3">
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

                <draggable tag="tbody" handle=".drag-handle" item-key="id" v-model="sortedDevices" @end="onDragEnd">
                    <template #item="{element: device}">
                        <tr :key="device.id">
                            <td class="text-center">
                                <i class="bi bi-list drag-handle" style="cursor: grab;"></i>
                                <button class="btn btn-sm btn-link" type="button" @click="deviceRm(device)">
                                    <i class="bi bi-trash2 text-danger"></i>
                                </button>
                            </td>
                            <td class="text-start">
                                <input class="form-control form-control-sm" type="text" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model="device.name" />
                            </td>
                        </tr>
                    </template>
                </draggable>

                <!-- *********************************************************************************************** -->

            </table>

            <!-- *************************************************************************************************** -->

        </div>
    </div>

    <!-- *********************************************************************************************************** -->

</template>
