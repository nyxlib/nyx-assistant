<!--suppress HtmlUnknownAttribute, JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {inject, computed} from 'vue';

import {Command} from '@tauri-apps/plugin-shell';

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

const dialog = inject('dialog');

/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    globals: {
        type: Object,
        required: true,
    },
    changed: {
        type: Boolean,
        required: true,
    },
    path: {
        type: String,
        default: '',
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedDevices = computed(() => Object.values(props.globals.devices).sort((x, y) => y.rank - x.rank).map((x) => props.globals.devices[x.id]));

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const generate = (mode = null) => {

    if(props.path)
    {
        /*------------------------------------------------------------------------------------------------------------*/

        const args = [
            '--output', props.path.replace('.json', ''),
            '--descr', props.path
        ];

        if(mode === 'override-main') {
            args.push('--override-main');
        }

        if(mode === 'override-device') {
            args.push('--override-device');
        }

        if(mode === 'override-project') {
            args.push('--override-project');
        }

        /*------------------------------------------------------------------------------------------------------------*/

        dialog.lock();

        Command.sidecar('binaries/nyx-gen', args).execute().then((output) => {

            if(output.code === 0)
            {
                dialog.success(output.stdout);

                dialog.unlock();
            }
            else
            {
                dialog.error(output.stderr);

                dialog.unlock();
            }
        });

        /*------------------------------------------------------------------------------------------------------------*/
    }
};

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
                                        <input class="form-control form-control-sm" type="text" id="F7F2361C" placeholder="Node name" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" v-model="globals.nodeName" />
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
                                <div class="col-md-6 text-end">

                                    <div class="input-group input-group-sm w-100" :hidden="!HAS_TAURI">

                                        <!-- *********************************************************************** -->

                                        <input class="form-control" type="text" :value="path" placeholder="-- untitled --" readonly="readonly" />

                                        <!-- *********************************************************************** -->

                                        <button class="btn btn-success" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate()">
                                            <i class="bi bi-tornado"></i> Generate
                                        </button>

                                        <button class="btn btn-success dropdown-toggle dropdown-toggle-split border-start" type="button" data-bs-toggle="dropdown">
                                            <span class="visually-hidden">Toggle Dropdown</span>
                                        </button>

                                        <!-- *********************************************************************** -->

                                        <ul class="dropdown-menu">
                                            <li>
                                                <button class="dropdown-item" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate('override-main')">
                                                    <i class="bi bi-exclamation-triangle text-danger"></i> Override main.c
                                                </button>
                                            </li>
                                            <li>
                                                <button class="dropdown-item" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate('override-device')">
                                                    <i class="bi bi-exclamation-triangle text-danger"></i> Override devices
                                                </button>
                                            </li>
                                            <li>
                                                <button class="dropdown-item" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate('override-project')">
                                                    <i class="bi bi-exclamation-triangle text-danger"></i> Override project
                                                </button>
                                            </li>
                                        </ul>

                                        <!-- *********************************************************************** -->

                                    </div>

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
                                        <input class="form-control form-control-sm" type="text" id="F23468E8" placeholder="e.g. mqtt://localhost:1883" required="required" :disabled="!globals.enableMQTT" v-model="globals.mqttURI" />
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label" for="C8A2E5EB">Username<sup class="text-secondary">opt</sup></label>
                                        <input class="form-control form-control-sm" type="text" id="C8A2E5EB" placeholder="Username" :disabled="!globals.enableMQTT" v-model="globals.mqttUsername" />
                                    </div>

                                    <div class="mb-0">
                                        <label class="form-label" for="CC00EA1C">Password<sup class="text-secondary">opt</sup></label>
                                        <input class="form-control form-control-sm" type="text" id="CC00EA1C" placeholder="Password" :disabled="!globals.enableMQTT" v-model="globals.mqttPassword" />
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
                                        <input class="form-control form-control-sm" type="text" id="B6FB4EA2" placeholder="e.g. tcp://0.0.0.0:7625" required="required" :disabled="!globals.enableTCP" v-model="globals.tcpURI" />
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

        <tab-pane :title="device.name || 'noname'" icon="cpu" v-for="device in sortedDevices" :key="`${device.id}-${device.rank}`">

            <device-descr :device="device" />

        </tab-pane>

        <!-- ******************************************************************************************************* -->

    </nav-tabs>

    <!-- *********************************************************************************************************** -->

</template>
