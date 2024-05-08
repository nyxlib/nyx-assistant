<!--suppress HtmlUnknownAttribute, JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import VectorDefs from '../tables/VectorDefs.vue';

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
                <div class="card-header">
                    Vector
                </div>
                <div class="card-body">

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
                                <input class="form-control form-control-sm" type="number" min="1" step="1" id="CB4E3E4D" placeholder="Timeout" v-model="vector.timeout" :disabled="vector.type === 'light'" />
                            </div>

                        </div>
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="DB1F21AD">Message<sup class="text-secondary">opt</sup></label>
                                <input class="form-control form-control-sm" type="text" id="DB1F21AD" placeholder="Message" v-model="vector.message" />
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="row">
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="B318D314">State</label>
                                <select class="form-select form-select-sm" id="B318D314" v-model="vector.state">
                                    <option value="INDI_STATE_IDLE">Idle</option>
                                    <option value="INDI_STATE_OK">Ok</option>
                                    <option value="INDI_STATE_BUSY">Busy</option>
                                    <option value="INDI_STATE_ALERT">Alert</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="C3E07382">Permission</label>
                                <select class="form-select form-select-sm" id="C3E07382" v-model="vector.perm" :disabled="vector.type === 'light'">
                                    <option value="INDI_PERM_RO">RO</option>
                                    <option value="INDI_PERM_WO">WO</option>
                                    <option value="INDI_PERM_RW">RW</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="E9BE4567">Rule</label>
                                <select class="form-select form-select-sm" id="E9BE4567" v-model="vector.rule" :disabled="vector.type !== 'switch'">
                                    <option value="INDI_RULE_ONE_OF_MANY">One of many</option>
                                    <option value="INDI_RULE_AT_MOST_ONE">At most one</option>
                                    <option value="INDI_RULE_ANY_OF_MANY">Any of many</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" role="switch" id="B8C30ADF" v-model="vector.callback" :true-value="true" :false-value="false" />
                        <label class="form-check-label" for="B8C30ADF">Implement callback</label>
                    </div>

                    <!-- ******************************************************************************************* -->

                </div>
            </div>

            <!-- *************************************************************************************************** -->

        </div>
        <div class="col-md-8">

            <!-- *************************************************************************************************** -->

            <vector-defs :type="vector.type" :defs="vector.defs" />

            <!-- *************************************************************************************************** -->

        </div>
    </div>

    <!-- *********************************************************************************************************** -->

</template>
