<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {computed} from 'vue';

import * as uuid from 'uuid';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    defs: {
        type: Object,
        required: true,
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const defs = computed(() => {

    const result = Object.values(props.defs);

    result.sort((x, y) => x.rank - y.rank);

    return result;
});

/*--------------------------------------------------------------------------------------------------------------------*/

let rank = 0;

/*--------------------------------------------------------------------------------------------------------------------*/

const defAppend = () => {

    const id = uuid.v4();

    props.defs[id] = {
        id: id,
        rank: rank,
        name: '',
        label: '',
        value: null,
        format: '%f',
        min: 0,
        max: 0,
        step: 0,
    };

    rank++;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const defRm = (def) => {

    delete props.defs[def.id];
};

/*--------------------------------------------------------------------------------------------------------------------*/

const defDw = (def1) => {

    const array = defs.value;

    const index = array.findIndex((def2) => def2.id === def1.id);

    if(index > 0x0000000000)
    {
        const def2 = array[index - 1];

        def1.rank--;
        def2.rank++;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const defUp = (def1) => {

    const array = defs.value;

    const index = array.findIndex(def2 => def2.id === def1.id);

    if(index < array.length)
    {
        const def2 = array[index + 1];

        def1.rank++;
        def2.rank--;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="card">
        <div class="card-header px-3 py-2">
            <i class="bi bi-code"></i>
            Defs
            [
            <button class="btn btn-xs btn-primary" type="button" @click="defAppend">
                <i class="bi bi-plus-lg"></i>
                Add def
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
                            Def
                        </th>
                    </tr>
                </thead>

                <!-- *********************************************************************************************** -->

                <tbody>
                    <tr v-for="def in defs">
                        <td class="text-center">
                            <button class="btn btn-sm btn-link" type="button" @click="defDw(def)">
                                <i class="bi bi-caret-up-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-link" type="button" @click="defUp(def)">
                                <i class="bi bi-caret-down-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-link" type="button" @click="defRm(def)">
                                <i class="bi bi-trash2 text-danger"></i>
                            </button>
                        </td>
                        <td class="text-center">

                            <!--************************************************************************************ -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" for="D18B255D">Name</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" id="D18B255D" v-model="def.name" />
                                        </div>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" for="FB921875">Label<sup class="text-secondary">opt</sup></label>
                                        <div class="col-sm-10">

                                            <input class="form-control form-control-sm" type="text" id="FB921875" v-model="def.label" />

                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div :class="['row', {'mb-2': type !== 'number'}]">
                                        <label class="col-form-label col-sm-2 py-1" for="C12596CE">Value</label>
                                        <div class="col-sm-10">

                                            <input class="form-control form-control-sm" type="number" id="C12596CE" v-model="def.value" v-if="type === 'number'" />

                                            <input class="form-control form-control-sm" type="text" id="C12596CE" v-model="def.value" v-if="type === 'text'" />

                                            <select class="form-select form-select-sm" id="C12596CE" v-model="def.value" v-if="type === 'light'">
                                                <option value="Idle">Idle</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Busy">Busy</option>
                                                <option value="Alert">Alert</option>
                                            </select>

                                            <select class="form-select form-select-sm" id="C12596CE" v-model="def.value" v-if="type === 'switch'">
                                                <option value="On">On</option>
                                                <option value="Off">Off</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="row mb-2" v-if="type === 'number'">
                                        <label class="col-form-label col-sm-2 py-1" for="A5704230">Format</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" id="A5704230" v-model="def.format" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="row" v-if="type === 'number'">
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" for="D18B255D">Min</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" id="D18B255D" v-model="def.min" />
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" for="F340D803">Max</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" id="F340D803" v-model="def.max" />
                                        </div>
                                    </div>

                                    <div class="mb-0 row">
                                        <label class="col-form-label col-sm-2 py-1" for="CF0F2894">Step</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" id="CF0F2894" v-model="def.step" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

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
