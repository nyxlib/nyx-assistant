<!--suppress HtmlUnknownAttribute, JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import TabPane from '../TabPane.vue';
import NavTabs from '../NavTabs.vue';

import Vectors from '../tables/Vectors.vue';
import VectorDescr from './VectorDescr.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
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

                    <div class="card mb-3">
                        <div class="card-header px-3 py-2">
                            Device <i class="bi bi-question-circle-fill" :title="`Id: ${device.id}`" v-tooltip></i>
                        </div>
                        <div class="card-body px-3 py-2">

                            <!-- *********************************************************************************** -->

                            <div class="mb-3">
                                <label class="form-label" for="C29507AB">Name</label>
                                <input class="form-control form-control-sm" type="text" id="C29507AB" placeholder="Device name" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model="device.name" />
                            </div>


                            <!-- *********************************************************************************** -->

                            <div class="form-check form-switch mb-0">
                                <input class="form-check-input" type="checkbox" role="switch" id="E5C4DAF2" v-model="device.disabled" :true-value="true" :false-value="false" />
                                <label class="form-check-label" for="E5C4DAF2">Disabled</label>
                            </div>

                            <!-- *********************************************************************************** -->

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                </div>
                <div class="col-md-8">

                    <!-- ******************************************************************************************* -->

                    <vectors :vectors="device.vectors" />

                    <!-- ******************************************************************************************* -->

                </div>
            </div>

        </tab-pane>

        <!-- ******************************************************************************************************* -->

        <tab-pane :title="`${vector.name || 'noname'} (${vector.type || 'notype'})`" icon="braces" :rank="vector.rank" v-for="vector in Object.values(props.device.vectors)" :key="`${vector.id}-${vector.rank}`">

            <vector-descr :vector="vector" v-if="vector.type" />

        </tab-pane>

        <!-- ******************************************************************************************************* -->

    </nav-tabs>

    <!-- *********************************************************************************************************** -->

</template>
