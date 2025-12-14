<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, JSUnresolvedReference, VueUnrecognizedDirective -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import VectorTable from '../tables/VectorTable.vue';
import VectorDescr from '../descrs/VectorDescr.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    theme: {
        type: String,
        default: 'light',
    },
    mode: {
        type: String,
        required: true,
    },
    device: {
        type: Object,
        required: true,
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <nav-tabs margin="mb-3">

        <!-- ******************************************************************************************************* -->

        <tab-pane title="Device">

            <div class="row">
                <div class="col-md-4">

                    <!-- ******************************************************************************************* -->

                    <div class="card shadow-sm mb-3">
                        <div class="card-header px-3 py-2">
                            Device <i class="bi bi-info-circle-fill" :title="`Id: ${device.id}`" v-tooltip></i>
                        </div>
                        <div class="card-body px-3 py-2">

                            <!-- *********************************************************************************** -->

                            <div class="mb-3">
                                <label class="form-label" for="C29507AB">Device name</label>
                                <input class="form-control form-control-sm" type="text" placeholder="Device name" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" id="C29507AB" v-model.trim="device.name" />
                            </div>

                            <!-- *********************************************************************************** -->

                            <div class="mb-3">
                                <label class="form-label" for="F981816D">Parent C++ class (default: Nyx::BaseDevice)</label>
                                <input class="form-control form-control-sm" type="text" placeholder="Parent C++ class" :disabled="props.mode !== 'posix-c++'" id="F981816D" v-model.trim="device.parentClass" />
                            </div>

                            <!-- *********************************************************************************** -->

                            <div class="mb-3">
                                <label class="form-label" for="E36C71AB">Additional C++ headers</label>
                                <textarea class="form-control form-control-sm" rows="6" placeholder="#include <...>" :disabled="props.mode !== 'posix-c++'" id="E36C71AB" v-model.trim="device.additionalHeaders"></textarea>
                            </div>

                            <!-- *********************************************************************************** -->

                            <div class="form-check form-switch mb-0">
                                <input class="form-check-input" type="checkbox" role="switch" :true-value="true" :false-value="false" id="E5C4DAF2" v-model="device.disabled" />
                                <label class="form-check-label" for="E5C4DAF2">Disabled</label>
                            </div>

                            <!-- *********************************************************************************** -->

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                </div>
                <div class="col-md-8">

                    <!-- ******************************************************************************************* -->

                    <vector-table :vectors="device.vectors" />

                    <!-- ******************************************************************************************* -->

                </div>
            </div>

        </tab-pane>

        <!-- ******************************************************************************************************* -->

        <tab-pane :title="`${vector.name || 'noname'} (${vector.type || 'notype'})`" icon="braces" :rank="vector.rank" v-for="vector in Object.values(props.device.vectors)" :key="`${vector.id}-${vector.rank}`">

            <vector-descr :theme="theme" :vector="vector" v-if="vector.type" />

        </tab-pane>

        <!-- ******************************************************************************************************* -->

    </nav-tabs>

    <!-- *********************************************************************************************************** -->

</template>
