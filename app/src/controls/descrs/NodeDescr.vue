<!--suppress HtmlUnknownAttribute, JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import TabPane from '../TabPane.vue';
import NavTabs from '../NavTabs.vue';

import Devices from '../tables/Devices.vue';
import DeviceDescr from './DeviceDescr.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const HAS_TAURI = typeof window['__TAURI__'] !== 'undefined';

/*--------------------------------------------------------------------------------------------------------------------*/

defineProps({
    globals: {
        type: Object,
        required: true,
    },
})

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <nav-tabs margin="mb-3">

        <!-- ******************************************************************************************************* -->

        <tab-pane title="Node" icon="hdd-network">

            <div class="row">
                <div class="col-md-6">

                    <!-- ******************************************************************************************* -->

                    <div class="card mb-3">
                        <div class="card-header">
                            Node
                        </div>
                        <div class="card-body">

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="mb-3">
                                        <label class="form-label" for="F7F2361C">Node name</label>
                                        <input class="form-control form-control-sm" type="text" id="F7F2361C" placeholder="Node name" required="required" v-model="globals.nodeName" />
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="mb-3">
                                        <label class="form-label" for="A75F14A0">Node timeout [ms]</label>
                                        <input class="form-control form-control-sm" type="number" min="1" step="1" id="A75F14A0" placeholder="Node timeout" required="required" v-model="globals.nodeTimeout" />
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="form-check form-switch mb-0">
                                        <input class="form-check-input" type="checkbox" role="switch" id="A313C013" v-model="globals.hardcoded" :true-value="true" :false-value="false" />
                                        <label class="form-check-label" for="A313C013">Hardcoded configuration</label>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <button class="btn btn-sm btn-success w-100" type="button" :disabled="!HAS_TAURI">
                                        <i class="bi bi-tornado"></i> Generate
                                    </button>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="card mb-3">
                        <div class="card-header">
                            Connectivity
                        </div>
                        <div class="card-body">

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-4">

                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" role="switch" id="DE177D55" v-model="globals.enableMQTT" :true-value="true" :false-value="false" />
                                        <label class="form-check-label" for="DE177D55">Enable MQTT</label>
                                    </div>

                                </div>
                                <div class="col-md-8">

                                    <div class="mb-3">
                                        <label class="form-label" for="F23468E8">URI</label>
                                        <input class="form-control form-control-sm" type="text" id="F23468E8" placeholder="e.g. mqtt://localhost:1883" required="required" v-model="globals.mqttURI" :disabled="!globals.enableMQTT" />
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label" for="C8A2E5EB">Username<sup class="text-secondary">opt</sup></label>
                                        <input class="form-control form-control-sm" type="text" id="C8A2E5EB" placeholder="Username" v-model="globals.mqttUsername" :disabled="!globals.enableMQTT" />
                                    </div>

                                    <div class="mb-0">
                                        <label class="form-label" for="CC00EA1C">Password<sup class="text-secondary">opt</sup></label>
                                        <input class="form-control form-control-sm" type="text" id="CC00EA1C" placeholder="Password" v-model="globals.mqttPassword" :disabled="!globals.enableMQTT" />
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                            <hr />

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-4">

                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" role="switch" id="A925CE04" v-model="globals.enableTCP" :true-value="true" :false-value="false" />
                                        <label class="form-check-label" for="A925CE04">Enable TCP</label>
                                    </div>

                                </div>
                                <div class="col-md-8">

                                    <div class="mb-0">
                                        <label class="form-label" for="B6FB4EA2">URI</label>
                                        <input class="form-control form-control-sm" type="text" id="B6FB4EA2" placeholder="e.g. tcp://0.0.0.0:7625" required="required" v-model="globals.tcpURI" :disabled="!globals.enableTCP" />
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                </div>
                <div class="col-md-6">

                    <!-- ******************************************************************************************* -->

                    <devices :devices="globals.devices" />

                    <!-- ******************************************************************************************* -->

                </div>
            </div>

        </tab-pane>

        <!-- ******************************************************************************************************* -->

        <tab-pane :title="device.name || 'noname'" icon="cpu" v-for="(device, id) in globals.devices" :key="id">

            <device-descr :device="device" />

        </tab-pane>

        <!-- ******************************************************************************************************* -->

    </nav-tabs>

    <!-- *********************************************************************************************************** -->

</template>
