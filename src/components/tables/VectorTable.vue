<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {ref, watchEffect} from 'vue';

import draggable from 'vuedraggable';

import * as uuid from 'uuid';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    vectors: {
        type: Object,
        required: true,
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedVectors = ref([]);

watchEffect(() => {

    sortedVectors.value = Object.values(props.vectors).sort((a, b) => a.rank - b.rank);
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const onDragEnd = () => {

    for(let i = 0; i < sortedVectors.value.length; i++)
    {
        const addon = sortedVectors.value[i];

        props.vectors[addon.id].rank = i;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorAppend = () => {

    const id = `vector:${uuid.v4()}`;

    const rank = Date.now();

    props.vectors[id] = {
        id: id,
        rank: rank,
        name: '',
        type: '',
        label: '',
        group: '',
        hints: '',
        state: 'NYX_STATE_OK',
        perm: 'NYX_PERM_RW',
        rule: 'NYX_RULE_ONE_OF_MANY',
        timeout: null,
        message: '',
        disabled: false,
        callback: true,
        defs: {},
    };
};

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorRm = (vector) => {

    delete props.vectors[vector.id];
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="card shadow-sm mb-3">
        <div class="card-header px-3 py-2">
            <i class="bi bi-braces"></i>
            Vectors
            [
            <button class="btn btn-xs btn-primary" type="button" @click="vectorAppend">
                <i class="bi bi-plus-lg"></i>
                Add vector
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
                            Vector name
                        </th>
                        <th class="text-center" style="width: auto;">
                            Vector type
                        </th>
                    </tr>
                </thead>

                <!-- *********************************************************************************************** -->

                <draggable tag="tbody" handle=".drag-handle" item-key="id" v-model="sortedVectors" @end="onDragEnd">
                    <template #item="{element: vector}">
                        <tr :key="vector.id">
                            <td class="text-center">
                                <i class="bi bi-list drag-handle" style="cursor: grab;"></i>
                                <button class="btn btn-sm btn-link" type="button" @click="vectorRm(vector)">
                                    <i class="bi bi-trash2 text-danger"></i>
                                </button>
                            </td>
                            <td class="text-start">
                                <input class="form-control form-control-sm" type="text" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model.trim="vector.name" />
                            </td>
                            <td class="text-start">
                                <select class="form-select form-select-sm" v-model="vector.type">
                                    <option value="number">Number</option>
                                    <option value="text">Text</option>
                                    <option value="light">Light</option>
                                    <option value="switch">Switch</option>
                                    <option value="blob">BLOB</option>
                                    <option value="stream">Stream</option>
                                </select>
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
