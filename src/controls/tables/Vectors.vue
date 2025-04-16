<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {computed} from 'vue';

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

const sortedVectors = computed(() => [...Object.values(props.vectors)].sort((x, y) => x.rank - y.rank));

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

let rank = 0;

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorAppend = () => {

    const id = `vector:${uuid.v4()}`;

    props.vectors[id] = {
        id: id,
        rank: rank,
        name: '',
        type: '',
        label: '',
        group: '',
        state: 'NYX_STATE_OK',
        perm: 'NYX_PERM_RW',
        rule: 'NYX_RULE_ONE_OF_MANY',
        timeout: null,
        message: '',
        disabled: false,
        callback: true,
        defs: {},
    };

    rank++;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorRm = (vector) => {

    delete props.vectors[vector.id];
};

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorDw = (vector1) => {

    const array = sortedVectors.value;

    const index = array.findIndex((vector2) => vector2.id === vector1.id);

    if(index > 0x00000000000000)
    {
        const vector2 = array[index - 1];

        vector1.rank--;
        vector2.rank++;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorUp = (vector1) => {

    const array = sortedVectors.value;

    const index = array.findIndex((vector2) => vector2.id === vector1.id);

    if(index < array.length - 1)
    {
        const vector2 = array[index + 1];

        vector1.rank++;
        vector2.rank--;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="card mb-3">
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

                <tbody>
                    <tr v-for="vector in sortedVectors" :key="vector.id">
                        <td class="text-center">
                            <button class="btn btn-sm btn-link" type="button" @click="vectorDw(vector)">
                                <i class="bi bi-caret-up-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-link" type="button" @click="vectorUp(vector)">
                                <i class="bi bi-caret-down-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-link" type="button" @click="vectorRm(vector)">
                                <i class="bi bi-trash2 text-danger"></i>
                            </button>
                        </td>
                        <td class="text-start">
                            <input class="form-control form-control-sm" type="text" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model="vector.name" />
                        </td>
                        <td class="text-start">
                            <select class="form-select form-select-sm" v-model="vector.type">
                                <option value="number">Number</option>
                                <option value="text">Text</option>
                                <option value="light">Light</option>
                                <option value="switch">Switch</option>
                                <option value="blob">BLOB</option>
                            </select>
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
