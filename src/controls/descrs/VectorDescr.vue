<!--suppress HtmlUnknownAttribute, JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import Defs from '../tables/Defs.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

defineProps({
    vector: {
        type: Object,
        required: true,
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="row">
        <div class="col-md-4">

            <!-- *************************************************************************************************** -->

            <div class="card mb-3">
                <div class="card-header px-3 py-2">
                    Vector <i class="bi bi-question-circle-fill" :title="`Id: ${vector.id}`" v-tooltip></i>
                </div>
                <div class="card-body px-3 py-2">

                    <!-- ******************************************************************************************* -->

                    <div class="row">
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="F7166B34">Label<sup class="text-secondary">opt</sup></label>
                                <input class="form-control form-control-sm" type="text" id="F7166B34" placeholder="Label" v-model="vector.label" />
                            </div>

                        </div>
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="F09714F1">Group<sup class="text-secondary">opt</sup></label>
                                <input class="form-control form-control-sm" type="text" id="F09714F1" placeholder="Group" v-model="vector.group" />
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="row">
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="CB4E3E4D">Timeout<sup class="text-secondary">opt</sup> [ms]</label>
                                <input class="form-control form-control-sm" type="number" min="1" step="1" id="CB4E3E4D" placeholder="Timeout" :disabled="['light', 'stream'].includes(vector.type)" v-model="vector.timeout" />
                            </div>

                        </div>
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="DB1F21AD">Message<sup class="text-secondary">opt</sup></label>
                                <input class="form-control form-control-sm" type="text" id="DB1F21AD" placeholder="Message" :disabled="['stream'].includes(vector.type)" v-model="vector.message" />
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="row">
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="B318D314">State</label>
                                <select class="form-select form-select-sm" id="B318D314" v-model="vector.state">
                                    <option value="NYX_STATE_IDLE">Idle</option>
                                    <option value="NYX_STATE_OK">Ok</option>
                                    <option value="NYX_STATE_BUSY">Busy</option>
                                    <option value="NYX_STATE_ALERT">Alert</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="C3E07382">Permission</label>
                                <select class="form-select form-select-sm" id="C3E07382" :disabled="['light', 'stream'].includes(vector.type)" v-model="vector.perm">
                                    <option value="NYX_PERM_RO">RO</option>
                                    <option value="NYX_PERM_WO">WO</option>
                                    <option value="NYX_PERM_RW">RW</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="E9BE4567">Rule</label>
                                <select class="form-select form-select-sm" id="E9BE4567" :disabled="!['switch'].includes(vector.type)" v-model="vector.rule">
                                    <option value="NYX_RULE_ONE_OF_MANY">One of many</option>
                                    <option value="NYX_RULE_AT_MOST_ONE">At most one</option>
                                    <option value="NYX_RULE_ANY_OF_MANY">Any of many</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" role="switch" id="C29560FE" :disabled="[].includes(vector.type)" v-model="vector.disabled" :true-value="true" :false-value="false" />
                        <label class="form-check-label" for="C29560FE">Disabled</label>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" role="switch" id="B8C30ADF" :disabled="['stream'].includes(vector.type)" v-model="vector.callback" :true-value="true" :false-value="false" />
                        <label class="form-check-label" for="B8C30ADF">Implement callback</label>
                    </div>

                    <!-- ******************************************************************************************* -->

                </div>
            </div>

            <!-- *************************************************************************************************** -->

        </div>
        <div class="col-md-8">

            <!-- *************************************************************************************************** -->

            <Defs :type="vector.type" :defs="vector.defs" />

            <!-- *************************************************************************************************** -->

        </div>
    </div>

    <!-- *********************************************************************************************************** -->

</template>
