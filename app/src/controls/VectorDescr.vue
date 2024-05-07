<!--suppress JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import VectorDefs from './VectorDefs.vue';

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
                                    <option value="Idle">Idle</option>
                                    <option value="Ok">Ok</option>
                                    <option value="Busy">Busy</option>
                                    <option value="Alert">Alert</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="C3E07382">Permission</label>
                                <select class="form-select form-select-sm" id="C3E07382" v-model="vector.perm" :disabled="vector.type === 'light'">
                                    <option value="ro">RO</option>
                                    <option value="wo">WO</option>
                                    <option value="rw">RW</option>
                                </select>
                            </div>

                            <div class="mb-0">
                                <label class="form-label" for="E9BE4567">Rule</label>
                                <select class="form-select form-select-sm" id="E9BE4567" v-model="vector.rule" :disabled="vector.type !== 'switch'">
                                    <option value="OneOfMany">One of many</option>
                                    <option value="AtMostOne">At most one</option>
                                    <option value="AnyOfMany">Any of many</option>
                                </select>
                            </div>

                        </div>
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
