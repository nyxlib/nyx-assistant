<!--suppress HtmlUnknownAttribute -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {ref, watchEffect} from 'vue';

import draggable from 'vuedraggable';

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

const sortedDefs = ref([]);

watchEffect(() => {

    sortedDefs.value = Object.values(props.defs).sort((a, b) => a.rank - b.rank);
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const onDragEnd = () => {

    for(let i = 0; i < sortedDefs.value.length; i++)
    {
        const addon = sortedDefs.value[i];

        props.defs[addon.id].rank = i;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const defAppend = () => {

    const id = `def:${uuid.v4()}`;

    const rank = Date.now();

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
};

/*--------------------------------------------------------------------------------------------------------------------*/

const defRm = (def) => {

    delete props.defs[def.id];
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="card shadow-sm mb-3">
        <div class="card-header px-3 py-2">
            <i class="bi bi-code"></i>
            Properties
            [
            <button class="btn btn-xs btn-primary" type="button" @click="defAppend">
                <i class="bi bi-plus-lg"></i>
                Add property
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

                <draggable tag="tbody" handle=".drag-handle" item-key="id" v-model="sortedDefs" @end="onDragEnd">
                    <template #item="{element: def}">
                        <tr :key="def.id">
                            <td class="text-center">
                                <i class="bi bi-list drag-handle" style="cursor: grab;"></i>
                                <button class="btn btn-sm btn-link" type="button" @click="defRm(def)">
                                    <i class="bi bi-trash2 text-danger"></i>
                                </button>
                            </td>
                            <td class="text-start">

                                <!--******************************************************************************** -->

                                <div class="row">
                                    <div class="col-md-6">

                                        <div class="row mb-2">
                                            <label class="col-form-label col-sm-3 py-1" :for="`D18B255D_${def.id}`">Name</label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="text" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" :id="`D18B255D_${def.id}`" v-model.trim="def.name" />
                                            </div>
                                        </div>

                                    </div>
                                    <div class="col-md-6">

                                        <div class="row mb-2">
                                            <label class="col-form-label col-sm-3 py-1" :for="`FB921875_${def.id}`">Label<sup class="text-secondary">opt</sup></label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="text" :id="`FB921875_${def.id}`" v-model.trim="def.label" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <!--******************************************************************************** -->

                                <div class="row">
                                    <div class="col-md-6">

                                        <div class="row mb-2" v-if="!['blob', 'stream'].includes(type)">
                                            <label class="col-form-label col-sm-3 py-1" :for="`C12596CE_${def.id}`">Value</label>
                                            <div class="col-sm-9">

                                                <input class="form-control form-control-sm" type="text" required="required" :id="`C12596CE_${def.id}`" v-model.trim="def.value" v-if="type === 'number'" />

                                                <input class="form-control form-control-sm" type="text" xxxxxxxx="xxxxxxxx" :id="`C12596CE_${def.id}`" v-model.trim="def.value" v-if="type === 'text'" />

                                                <select class="form-select form-select-sm" :id="`C12596CE_${def.id}`" v-model="def.value" v-if="type === 'light'">
                                                    <option value="NYX_STATE_IDLE">Idle</option>
                                                    <option value="NYX_STATE_OK">Ok</option>
                                                    <option value="NYX_STATE_BUSY">Busy</option>
                                                    <option value="NYX_STATE_ALERT">Alert</option>
                                                </select>

                                                <select class="form-select form-select-sm" :id="`C12596CE_${def.id}`" v-model="def.value" v-if="type === 'switch'">
                                                    <option value="NYX_ONOFF_ON">On</option>
                                                    <option value="NYX_ONOFF_OFF">Off</option>
                                                </select>

                                            </div>
                                        </div>

                                    </div>
                                    <div class="col-md-6">

                                        <div class="row mb-2" v-if="type === 'number'">
                                            <label class="col-form-label col-sm-3 py-1" :for="`A5704230_${def.id}`">Format</label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="text" required="required" :id="`A5704230_${def.id}`" v-model.trim="def.format" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <!--******************************************************************************** -->

                                <div class="row" v-if="type === 'number'">
                                    <div class="col-md-6">

                                        <div class="row mb-2">
                                            <label class="col-form-label col-sm-3 py-1" :for="`D18B255D_${def.id}`">Min</label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="text" required="required" :id="`D18B255D_${def.id}`" v-model.number="def.min" />
                                            </div>
                                        </div>

                                        <div class="row mb-2">
                                            <label class="col-form-label col-sm-3 py-1" :for="`F340D803_${def.id}`">Max</label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="text" required="required" :id="`F340D803_${def.id}`" v-model.number="def.max" />
                                            </div>
                                        </div>

                                        <div class="row mb-2">
                                            <label class="col-form-label col-sm-3 py-1" :for="`CF0F2894_${def.id}`">Step</label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="text" required="required" :id="`CF0F2894_${def.id}`" v-model.number="def.step" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <!--******************************************************************************** -->

                                <div class="row" v-if="type === 'blob'">
                                    <div class="col-md-6">

                                        <div class="row mb-2">
                                            <label class="col-form-label col-sm-3 py-1" :for="`ECF6D0D6_${def.id}`">Format</label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="text" required="required" :id="`ECF6D0D6_${def.id}`" v-model.trim="def.blobFormat" />
                                            </div>
                                        </div>

                                    </div>
                                    <div class="col-md-6">

                                        <div class="row mb-2">
                                            <label class="col-form-label col-sm-3 py-1" :for="`C7D94FF3_${def.id}`">Size</label>
                                            <div class="col-sm-9">
                                                <input class="form-control form-control-sm" type="number" readonly="readonly" :id="`C7D94FF3_${def.id}`" v-model.number="def.blobSize" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <!--******************************************************************************** -->

                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input" type="checkbox" role="switch" :disabled="type === 'stream'" :true-value="true" :false-value="false" :id="`FBB508E4_${def.id}`" v-model="def.callback" />
                                    <label class="form-check-label" :for="`FBB508E4_${def.id}`">Implement callback</label>
                                </div>

                                <!--******************************************************************************** -->

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
