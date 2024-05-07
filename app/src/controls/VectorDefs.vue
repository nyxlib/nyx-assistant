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
        callback: false,
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
            Vector defs
            [
            <button class="btn btn-xs btn-primary" type="button" @click="defAppend">
                <i class="bi bi-plus-lg"></i>
                Add vector def
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
                    <tr v-for="(def, idx) in defs" :key="idx">
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
                        <td class="text-start">

                            <!--************************************************************************************ -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" :for="`D18B255D_${idx}`">Name</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" :id="`D18B255D_${idx}`" v-model="def.name" />
                                        </div>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" :for="`FB921875_${idx}`">Label<sup class="text-secondary">opt</sup></label>
                                        <div class="col-sm-10">

                                            <input class="form-control form-control-sm" type="text" :id="`FB921875_${idx}`" v-model="def.label" />

                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" :for="`C12596CE_${idx}`">Value</label>
                                        <div class="col-sm-10">

                                            <input class="form-control form-control-sm" type="number" :id="`C12596CE_${idx}`" v-model="def.value" v-if="type === 'number'" />

                                            <input class="form-control form-control-sm" type="text" :id="`C12596CE_${idx}`" v-model="def.value" v-if="type === 'text'" />

                                            <select class="form-select form-select-sm" :id="`C12596CE_${idx}`" v-model="def.value" v-if="type === 'light'">
                                                <option value="INDI_STATE_IDLE">Idle</option>
                                                <option value="INDI_STATE_OK">Ok</option>
                                                <option value="INDI_STATE_BUSY">Busy</option>
                                                <option value="INDI_STATE_ALERT">Alert</option>
                                            </select>

                                            <select class="form-select form-select-sm" :id="`C12596CE_${idx}`" v-model="def.value" v-if="type === 'switch'">
                                                <option value="INDI_ONOFF_ON">On</option>
                                                <option value="INDI_ONOFF_OFF">Off</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="row mb-2" v-if="type === 'number'">
                                        <label class="col-form-label col-sm-2 py-1" :for="`A5704230_${idx}`">Format</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" :id="`A5704230_${idx}`" v-model="def.format" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="row" v-if="type === 'number'">
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" :for="`D18B255D_${idx}`">Min</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" :id="`D18B255D_${idx}`" v-model="def.min" />
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" :for="`F340D803_${idx}`">Max</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" :id="`F340D803_${idx}`" v-model="def.max" />
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-2 py-1" :for="`CF0F2894_${idx}`">Step</label>
                                        <div class="col-sm-10">
                                            <input class="form-control form-control-sm" type="text" :id="`CF0F2894_${idx}`" v-model="def.step" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="form-check form-switch mb-0">
                                <input class="form-check-input" type="checkbox" role="switch" :id="`FBB508E4_${idx}`" v-model="def.callback" :true-value="true" :false-value="false" />
                                <label class="form-check-label" :for="`FBB508E4_${idx}`">Implement callback</label>
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
