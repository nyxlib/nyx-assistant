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
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const vectors = computed(() => {

    const result = Object.values(props.vectors);

    result.sort((x, y) => x.rank - y.rank);

    return result;
});

/*--------------------------------------------------------------------------------------------------------------------*/

let rank = 0;

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorAppend = () => {

    const id = uuid.v4();

    props.vectors[id] = {
        id: id,
        rank: rank,
        name: '',
        type: '',
        label: '',
        group: '',
        state: 'Ok',
        perm: 'rw',
        rule: 'OneOfMany',
        timeout: null,
        message: '',
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

    const array = vectors.value;

    const index = array.findIndex((vector2) => vector2.id === vector1.id);

    if(index > 0x0000000000)
    {
        const vector2 = array[index - 1];

        vector1.rank--;
        vector2.rank++;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const vectorUp = (vector1) => {

    const array = vectors.value;

    const index = array.findIndex(vector2 => vector2.id === vector1.id);

    if(index < array.length)
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

    <div class="card">
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
                    <tr v-for="vector in vectors">
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
                        <td class="text-center">
                            <input class="form-control form-control-sm" type="text" v-model="vector.name" />
                        </td>
                        <td class="text-center">
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
