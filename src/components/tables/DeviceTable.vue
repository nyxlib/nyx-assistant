<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {ref, toRaw, reactive, watchEffect, onMounted} from 'vue';

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

const state = reactive({
    templates: {},
});

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedDevices = ref([]);

watchEffect(() => {

    sortedDevices.value = Object.values(props.devices).sort((a, b) => a.rank - b.rank);
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
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

    return id;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const templateAppend = (template) => {

    for(const device of Object.values(state.templates[template]))
    {
        const id = `device:${uuid.v4()}`;

        const rank = Date.now();

        props.devices[id] = structuredClone(toRaw(device));
        props.devices[id].id = id;
        props.devices[id].rank = rank;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deviceRm = (device) => {

    delete props.devices[device.id];
};

/*--------------------------------------------------------------------------------------------------------------------*/
/* INITIALIZED                                                                                                        */
/*--------------------------------------------------------------------------------------------------------------------*/

onMounted(() => {

    /*----------------------------------------------------------------------------------------------------------------*/

    const ctx = require.context('../../assets/templates', false, /\.json$/);

    /*----------------------------------------------------------------------------------------------------------------*/

    for(const key of ctx.keys())
    {
        const mod = ctx(key);

        const data = mod.default ?? mod;

        state.templates[data.nodeName] = data.devices;
    }

    /*----------------------------------------------------------------------------------------------------------------*/
});

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="card shadow-sm mb-3">
        <div class="card-header px-3 py-2">
            <i class="bi bi-cpu"></i>
            Devices
            [
            <button class="btn btn-xs btn-primary me-1" type="button" @click="deviceAppend()">
                <i class="bi bi-plus-lg"></i>
                Add device
            </button>
            <div class="btn-group">
                <button class="btn btn-xs btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-plus-lg"></i>
                    Add from template
                </button>
                <ul class="dropdown-menu">
                    <li v-for="name in Object.keys(state.templates)" :key="name">
                        <a class="dropdown-item" href="#/assistant" @click="templateAppend(name)">{{ name }}</a>
                    </li>
                </ul>
            </div>
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
                                <input class="form-control form-control-sm" type="text" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model.trim="device.name" />
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
