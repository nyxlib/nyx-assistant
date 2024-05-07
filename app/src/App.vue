<!--suppress HtmlUnknownAttribute, JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {inject, reactive, onMounted} from 'vue';

/*--------------------------------------------------------------------------------------------------------------------*/

import NavTabs from './controls/NavTabs.vue';
import TabPane from './controls/TabPane.vue';

import Devices from './controls/Devices.vue';
import DeviceDescr from './controls/DeviceDescr.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const dialog = inject('dialog');

/*--------------------------------------------------------------------------------------------------------------------*/

const DEFAULT_GLOBALS = {
    /* NODE */
    nodeName: '',
    nodeTimeout: 1000,
    /* CONNECTIVITY */
    enableMQTT: false,
    mqttPort: 1883,
    mqttURI: '',
    mqttUsername: '',
    mqttPassword: '',
    enableTCP: false,
    tcpURI: '',
    /* DEVICES */
    devices: {},
};

/*--------------------------------------------------------------------------------------------------------------------*/

const state = reactive({
    globals: Object.assign({}, DEFAULT_GLOBALS),
    theme: 'light',
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const themeSet = () => {

    const label = document.querySelector('label[for="C2D68371"] i');

    if(state.theme === 'dark')
    {
        document.documentElement.setAttribute('data-bs-theme', 'dark');

        localStorage.setItem('indi-dashboard-theme', 'dark');

        label.classList.add   ('bi-moon-stars');
        label.classList.remove('bi-sun');
    }
    else
    {
        document.documentElement.setAttribute('data-bs-theme', 'light');

        localStorage.setItem('indi-dashboard-theme', 'light');

        label.classList.remove('bi-moon-stars');
        label.classList.add   ('bi-sun');
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const confDup = (src, def) => {

    const result = {};

    if(typeof src === 'object'
       &&
       typeof def === 'object'
    ) {
        Object.keys(def).forEach((key) => { result[key] = (key in src) ? src[key] : def[key]; });
    }

    return result;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const importDrv = () => {

    try
    {
        dialog.open('driver.json', 'text/plain;charset=utf-8', 'JSON Files', ['json']).catch(dialog.error).then((json) => {

            state.globals = confDup(JSON.parse(json), DEFAULT_GLOBALS);

            dialog.success();
        });
    }
    catch(e)
    {
        dialog.error(e);
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const exportDrv = () => {

    try
    {
        const config = confDup(state.globals, DEFAULT_GLOBALS);

        dialog.save(JSON.stringify(config, null, 2), 'driver.json', 'text/plain;charset=utf-8', 'JSON Files', ['json']).catch(dialog.error).then(() => {

            dialog.success();
        });
    }
    catch(e)
    {
        dialog.error(e);
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
/* INITIALIZATION                                                                                                     */
/*--------------------------------------------------------------------------------------------------------------------*/

onMounted(() => {

    /*----------------------------------------------------------------------------------------------------------------*/

    state.theme = localStorage.getItem('indi-dashboard-theme') || 'dark';

    /*----------------------------------------------------------------------------------------------------------------*/

    if(typeof window.__TAURI__ !== 'undefined') {
        document.body.setAttribute('data-environment', 'tauri');
    } else {
        document.body.setAttribute('data-environment', 'browser');
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    themeSet();

    /*----------------------------------------------------------------------------------------------------------------*/
});

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->
    <!-- HEADER                                                                                                      -->
    <!-- *********************************************************************************************************** -->

    <input class="btn-check" type="checkbox" role="switch" id="C2D68371" v-model="state.theme" :true-value="'dark'" :false-value="'light'" @change="themeSet" />

    <!-- *********************************************************************************************************** -->

    <nav class="navbar navbar-expand bg-primary border-bottom py-0">
        <div class="container-fluid px-3" data-tauri-drag-region>

            <!-- *************************************************************************************************** -->

            <div class="d-flex ms-auto py-1">

                <button class="btn btn-sm btn-primary me-2" type="button" @click="importDrv">
                    <i class="bi bi-upload"></i> Import
                </button>

                <button class="btn btn-sm btn-primary me-2" type="button" @click="exportDrv">
                    <i class="bi bi-download"></i> Export
                </button>

            </div>

            <!-- *************************************************************************************************** -->

            <div class="d-flex ms-2 py-1">

                <label class="btn btn-sm btn-primary border me-0" for="C2D68371">
                    <i class="bi bi-moon-stars"></i>
                </label>

            </div>

            <!-- *************************************************************************************************** -->

        </div>
    </nav>

    <!-- *********************************************************************************************************** -->
    <!-- BODY                                                                                                        -->
    <!-- *********************************************************************************************************** -->

    <div class="p-3">

        <nav-tabs margin="mb-3">

            <!-- *************************************************************************************************** -->

            <tab-pane title="Node" icon="hdd-network">

                <div class="row">
                    <div class="col-md-6">

                        <!-- *************************************************************************************** -->

                        <div class="card mb-3">
                            <div class="card-header">
                                Node
                            </div>
                            <div class="card-body">

                                <div class="row">
                                    <div class="col-md-6">

                                        <div class="mb-3">
                                            <label class="form-label" for="F7F2361C">Node name</label>
                                            <input class="form-control form-control-sm" type="text" id="F7F2361C" placeholder="Node name" v-model="state.globals.nodeName" />
                                        </div>

                                    </div>
                                    <div class="col-md-6">

                                        <div class="mb-3">
                                            <label class="form-label" for="A75F14A0">Node timeout [ms]</label>
                                            <input class="form-control form-control-sm" type="number" min="1" step="1" id="A75F14A0" placeholder="Node timeout" v-model="state.globals.nodeTimeout" />
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- *************************************************************************************** -->

                        <div class="card mb-3">
                            <div class="card-header">
                                Connectivity
                            </div>
                            <div class="card-body">

                                <div class="row">
                                    <div class="col-md-4">

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" role="switch" id="DE177D55" v-model="state.globals.enableMQTT" :true-value="true" :false-value="false" />
                                            <label class="form-check-label" for="DE177D55">Enable MQTT</label>
                                        </div>

                                    </div>
                                    <div class="col-md-8">

                                        <div class="mb-3">
                                            <label class="form-label" for="F23468E8">URI</label>
                                            <input class="form-control form-control-sm" type="text" id="F23468E8" placeholder="e.g. mqtt://localhost:1883" v-model="state.globals.mqttURI" :disabled="!state.globals.enableMQTT" />
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label" for="C8A2E5EB">Username<sup class="text-secondary">opt</sup></label>
                                            <input class="form-control form-control-sm" type="text" id="C8A2E5EB" placeholder="Username" v-model="state.globals.mqttUsername" :disabled="!state.globals.enableMQTT" />
                                        </div>

                                        <div class="mb-0">
                                            <label class="form-label" for="CC00EA1C">Password<sup class="text-secondary">opt</sup></label>
                                            <input class="form-control form-control-sm" type="text" id="CC00EA1C" placeholder="Password" v-model="state.globals.mqttPassword" :disabled="!state.globals.enableMQTT" />
                                        </div>

                                    </div>
                                </div>

                                <hr />

                                <div class="row">
                                    <div class="col-md-4">

                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" role="switch" id="A925CE04" v-model="state.globals.enableTCP" :true-value="true" :false-value="false" />
                                            <label class="form-check-label" for="A925CE04">Enable TCP</label>
                                        </div>

                                    </div>
                                    <div class="col-md-8">

                                        <div class="mb-0">
                                            <label class="form-label" for="B6FB4EA2">URI</label>
                                            <input class="form-control form-control-sm" type="text" id="B6FB4EA2" placeholder="e.g. tcp://0.0.0.0:7625" v-model="state.globals.tcpURI" :disabled="!state.globals.enableTCP" />
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- *************************************************************************************** -->

                    </div>
                    <div class="col-md-6">

                        <!-- *************************************************************************************** -->

                        <devices :devices="state.globals.devices" />

                        <!-- *************************************************************************************** -->

                    </div>
                </div>

            </tab-pane>

            <!-- *************************************************************************************************** -->

            <tab-pane :title="device.name" icon="cpu" v-for="(device, id) in state.globals.devices" :key="id">

                <device-descr :device="device" />

            </tab-pane>

            <!-- *************************************************************************************************** -->

        </nav-tabs>

    </div>

    <!-- *********************************************************************************************************** -->

</template>

<style>
/*--------------------------------------------------------------------------------------------------------------------*/

@import url(assets/app.css);

/*--------------------------------------------------------------------------------------------------------------------*/

body[data-environment="tauri"] > div > nav {

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

/*--------------------------------------------------------------------------------------------------------------------*/
</style>
