<!--suppress HtmlUnknownAttribute -->
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

const sortedDefs = computed(() => [...Object.values(props.defs)].sort((x, y) => x.rank - y.rank));

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

let rank = 0;

/*--------------------------------------------------------------------------------------------------------------------*/

const defAppend = () => {

    const id = `def:${uuid.v4()}`;

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
        blobFormat: '',
        blobSize: 0,
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

    const array = sortedDefs.value;

    const index = array.findIndex((def2) => def2.id === def1.id);

    if(index > 0x00000000000000)
    {
        const def2 = array[index - 1];

        def1.rank--;
        def2.rank++;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const defUp = (def1) => {

    const array = sortedDefs.value;

    const index = array.findIndex((def2) => def2.id === def1.id);

    if(index < array.length - 1)
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

    <div class="card mb-3">
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
                    <tr v-for="(def, idx) in sortedDefs" :key="idx">
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
                                        <label class="col-form-label col-sm-3 py-1" :for="`D18B255D_${idx}`">Name</label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="text" :id="`D18B255D_${idx}`" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model="def.name" />
                                        </div>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-3 py-1" :for="`FB921875_${idx}`">Label<sup class="text-secondary">opt</sup></label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="text" :id="`FB921875_${idx}`" v-model="def.label" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="row mb-2" v-if="type !== 'blob'">
                                        <label class="col-form-label col-sm-3 py-1" :for="`C12596CE_${idx}`">Value</label>
                                        <div class="col-sm-9">

                                            <input class="form-control form-control-sm" type="number" :id="`C12596CE_${idx}`" required="required" v-model="def.value" v-if="type === 'number'" />

                                            <input class="form-control form-control-sm" type="text" :id="`C12596CE_${idx}`" xxxxxxxx="xxxxxxxx" v-model="def.value" v-if="type === 'text'" />

                                            <select class="form-select form-select-sm" :id="`C12596CE_${idx}`" v-model="def.value" v-if="type === 'light'">
                                                <option value="NYX_STATE_IDLE">Idle</option>
                                                <option value="NYX_STATE_OK">Ok</option>
                                                <option value="NYX_STATE_BUSY">Busy</option>
                                                <option value="NYX_STATE_ALERT">Alert</option>
                                            </select>

                                            <select class="form-select form-select-sm" :id="`C12596CE_${idx}`" v-model="def.value" v-if="type === 'switch'">
                                                <option value="NYX_ONOFF_ON">On</option>
                                                <option value="NYX_ONOFF_OFF">Off</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="row mb-2" v-if="type === 'number'">
                                        <label class="col-form-label col-sm-3 py-1" :for="`A5704230_${idx}`">Format</label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="text" :id="`A5704230_${idx}`" required="required" v-model="def.format" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="row" v-if="type === 'number'">
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-3 py-1" :for="`D18B255D_${idx}`">Min</label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="text" :id="`D18B255D_${idx}`" required="required" v-model="def.min" />
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-3 py-1" :for="`F340D803_${idx}`">Max</label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="text" :id="`F340D803_${idx}`" required="required" v-model="def.max" />
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-3 py-1" :for="`CF0F2894_${idx}`">Step</label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="text" :id="`CF0F2894_${idx}`" required="required" v-model="def.step" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!--************************************************************************************ -->

                            <div class="row" v-if="type === 'blob'">
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-3 py-1" :for="`ECF6D0D6_${idx}`">Format</label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="text" :id="`ECF6D0D6_${idx}`" required="required" v-model="def.blobFormat" />
                                        </div>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="row mb-2">
                                        <label class="col-form-label col-sm-3 py-1" :for="`C7D94FF3_${idx}`">Size</label>
                                        <div class="col-sm-9">
                                            <input class="form-control form-control-sm" type="number" :id="`C7D94FF3_${idx}`" readonly="readonly" v-model="def.blobSize" />
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
