<!--suppress HtmlUnknownAttribute -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {ref, watch, inject, reactive, onMounted, onUnmounted} from 'vue';

import {Window, getCurrentWindow} from '@tauri-apps/api/window';

import {listen} from '@tauri-apps/api/event';

/*--------------------------------------------------------------------------------------------------------------------*/

import NyxDevice from './controls/preview/NyxDevice.vue';
import NodeDescr from './controls/descrs/NodeDescr.vue';

import NavTabs from './controls/NavTabs.vue';
import TabPane from './controls/TabPane.vue';

import convert from './nyx.js';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const HAS_TAURI = typeof window['__TAURI__'] !== 'undefined';

/*--------------------------------------------------------------------------------------------------------------------*/

const dialog = inject('dialog');

/*--------------------------------------------------------------------------------------------------------------------*/

const DEFAULT_GLOBALS = {
    /* NODE */
    nodeName: '',
    nodeTimeout: 1000,
    mode: 'posix-c',
    /* POSIX */
    hardcoded: true,
    static: false,
    /* ARDUINO */
    board: '',
    /* ARDUINO WIFI */
    wifiSSID: '',
    wifiPassword: '',
    /* ARDUINO ETHERNET */
    ethernetController: 'w5500',
    ethernetCSPin: 0,
    /* MQTT */
    enableMQTT: false,
    mqttURI: '',
    mqttUsername: '',
    mqttPassword: '',
    /* REDIS */
    enableRedis: false,
    redisURI: '',
    redisUsername: '',
    redisPassword: '',
    /* TCP */
    enableTCP: false,
    tcpURI: '',
    /* DEVICES */
    devices: {},
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deepClone = (obj) => {

    /**/ if(Object.prototype.toString.call(obj) === '[object Object]')
    {
        return Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, deepClone(val)]));
    }
    else if(Object.prototype.toString.call(obj) === '[object Array]')
    {
        return obj.map(deepClone);
    }

    return obj;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const state = reactive({
    theme: 'light',
    appMode: window.location.hash === '#/preview/' ? 'preview' : 'assistant',
    globals: deepClone(DEFAULT_GLOBALS),
    changed: false,
    path: null,
});

/*--------------------------------------------------------------------------------------------------------------------*/

let previewWindow = null;

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const about = () => {

    dialog.show(['Nyx Assistant', 'https://nyxlib.org/', '', 'Author: Jérôme ODIER', 'Email: jerome.odier@lpsc.in2p3.fr'].join('\n'), 'About');
};

/*--------------------------------------------------------------------------------------------------------------------*/

const themeSet = () => {

    const label = document.querySelector('label[for="C2D68371"] i');

    if(state.theme === 'dark')
    {
        document.documentElement.setAttribute('data-bs-theme', 'dark');

        localStorage.setItem('preview-assistant-theme', 'dark');

        label.classList.add   ('bi-moon-stars');
        label.classList.remove('bi-sun');
    }
    else
    {
        document.documentElement.setAttribute('data-bs-theme', 'light');

        localStorage.setItem('preview-assistant-theme', 'light');

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
        Object.keys(def).forEach((key) => { result[key] = deepClone((key in src) ? src[key] : def[key]); });
    }

    return result;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const resetDrv = () => {

    dialog.confirm('Loose modifications?').then((ok) => {

        if(ok)
        {
            state.globals = deepClone(DEFAULT_GLOBALS);

            state.path = null;

            dialog.success();
        }
        else
        {
            dialog.error();
        }
    })
};

/*--------------------------------------------------------------------------------------------------------------------*/

const importDrv = () => {

    try
    {
        dialog.open('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json']).catch(dialog.error).then(([json, path]) => {

            state.globals = confDup(JSON.parse(json), DEFAULT_GLOBALS);

            setTimeout(() => {

                state.changed = false;

                state.path = path;

            }, 500);

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

        dialog.save('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json'], JSON.stringify(config, null, 2)).catch(dialog.error).then((path) => {

            setTimeout(() => {

                state.changed = false;

                state.path = path;

            }, 500);

            dialog.success();
        });
    }
    catch(e)
    {
        dialog.error(e);
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const previewDrv = () => {

    if(!HAS_TAURI)
    {
        previewWindow = window.open(`${window.location.origin}${window.location.pathname}#/preview/`, 'Preview', 'width=1200,height=800,menubar=no,location=no,status=no,scrollbars=yes,resizable=yes');

        previewWindow.addEventListener('load', () => {

            updatePreview(state.globals.devices);
        });
    }
    else
    {
        previewWindow.show();
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const updatePreview = (devices) => {

    if(previewWindow)
    {
        if(!HAS_TAURI)
        {
            previewWindow.postMessage(convert(devices));
        }
        else
        {
            previewWindow.emit('preview', convert(devices));
        }
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
/* INITIALIZATION                                                                                                     */
/*--------------------------------------------------------------------------------------------------------------------*/

const tauriMessageHandler = (e) => devices.value = e.payload;

const htmlMessageHandler = (e) => devices.value = e.data;

const devices = ref({});

let unlisten;

/*--------------------------------------------------------------------------------------------------------------------*/

onMounted(async () => {

    /*----------------------------------------------------------------------------------------------------------------*/

    if(!HAS_TAURI || /android/i.test(navigator.userAgent))
    {
        document.body.setAttribute('data-environment', 'browser');
    }
    else
    {
        document.body.setAttribute('data-environment', 'tauri');

        /*------------------------------------------------------------------------------------------------------------*/

        const updateWindow = () => {

            getCurrentWindow().isMaximized().catch(() => {}).then((maximized) => {

                if(maximized) {
                    document.body.setAttribute('data-maximized', 'true');
                } else {
                    document.body.setAttribute('data-maximized', 'false');
                }
            });
        };

        window.addEventListener('resize', () => {

            updateWindow();
        });

        updateWindow();

        /*------------------------------------------------------------------------------------------------------------*/

        document.querySelector('[data-tauri-drag-region]').addEventListener('dblclick', (e) => {

            if(e.target.tagName.toLowerCase() === 'div')
            {
                getCurrentWindow().toggleMaximize();
            }
        });

        /*------------------------------------------------------------------------------------------------------------*/

        Window.getByLabel('main').then((mainWindow) => {
            Window.getByLabel('preview').then((otherWindow) => {

                previewWindow = otherWindow;

                if(state.appMode !== 'preview')
                {
                    mainWindow.listen('tauri://close-requested', () => {

                        if(state.changed)
                        {
                            dialog.confirm('Are you sure you want to close?', 'Nyx Assistant').then((choice) => {

                                if(choice)
                                {
                                    previewWindow.destroy();
                                    mainWindow.destroy();
                                }
                            });
                        }
                        else
                        {
                            previewWindow.destroy();
                            mainWindow.destroy();
                        }
                    });

                    previewWindow.listen('tauri://close-requested', () => {

                        previewWindow.hide();
                        mainWindow.show();
                    });
                }
            });
        });

        /*------------------------------------------------------------------------------------------------------------*/
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    state.theme = localStorage.getItem('preview-assistant-theme') || 'dark';

    themeSet();

    /*----------------------------------------------------------------------------------------------------------------*/

    watch(() => state.globals, (globals) => {

        updatePreview(globals.devices);

        state.changed = true;
    }, {
        deep: true
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    if(HAS_TAURI)
    {
        unlisten = await listen('preview', tauriMessageHandler);
    }
    else
    {
        window.addEventListener('message', htmlMessageHandler);
    }

    /*----------------------------------------------------------------------------------------------------------------*/
});

/*--------------------------------------------------------------------------------------------------------------------*/

onUnmounted(() => {

    if(HAS_TAURI)
    {
        if(unlisten) unlisten(/*- 'preview', tauriMessageHandler -*/);
    }
    else
    {
        window.removeEventListener('message', htmlMessageHandler);
    }
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

            <span class="d-none d-sm-inline" style="color: white; font-size: 14pt;">

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                    <path d="m16 15.5c0 0.27615-0.22386 0.50002-0.50002 0.50002h-3.0001c-0.66652-1.64e-4 -0.66652-1.0002 0-1h2.5001v-2.5001c4.9e-4 -0.6662 1.0005-0.6662 1 0z" /><path d="m16 0.50002c0-0.27615-0.22386-0.50002-0.50002-0.50002h-3.0001c-0.66652 1.6328e-4 -0.66652 1.0002 0 1h2.5001v2.5001c4.9e-4 0.6662 1.0005 0.6662 1 0z" /><path d="m1.7984e-7 15.5c0 0.27615 0.22386 0.50002 0.50002 0.50002h3.0001c0.66652-1.63e-4 0.66652-1.0002 0-1h-2.5001v-2.5001c-4.8972e-4 -0.6662-1.0005-0.6662-1 0z" /><path d="m1.7984e-7 0.50002c0-0.27615 0.22386-0.50002 0.50002-0.50002h3.0001c0.66652 1.6328e-4 0.66652 1.0002 0 1h-2.5001v2.5001c-4.8972e-4 0.6662-1.0005 0.6662-1 0z" /><path d="m8.0273 3c0.13476 0.0095135 0.26484 0.091406 0.31641 0.24609l0.64453 1.9375c0.28785 0.86331 0.96661 1.5407 1.8301 1.8281l1.9355 0.64453c0.33 0.11 0.33 0.57555 0 0.68555l-1.9375 0.64648c-0.86331 0.28785-1.5407 0.96465-1.8281 1.8281l-0.64453 1.9355c-0.047321 0.14419-0.16278 0.22743-0.28711 0.24609a8 5 0 0 0 7.9434-4.998 8 5 0 0 0-7.9727-5zm-0.082031 0.0019531a8 5 0 0 0-7.9453 4.998 8 5 0 0 0 7.9453 4.998c-0.12433-0.01866-0.23979-0.10191-0.28711-0.24609l-0.64648-1.9355c-0.28764-0.86309-0.96503-1.5405-1.8281-1.8281l-1.9355-0.64648c-0.33124-0.10871-0.33124-0.57684 0-0.68555l1.9355-0.64453c0.86309-0.28764 1.5405-0.96503 1.8281-1.8281l0.64648-1.9375c0.047882-0.14365 0.16304-0.22555 0.28711-0.24414zm3.3047 1.248c0.028794 0 0.057362 0.015835 0.068359 0.048828l0.12891 0.38867c0.05756 0.17263 0.19257 0.30777 0.36523 0.36523l0.38867 0.12891c0.06599 0.021996 0.06599 0.11472 0 0.13672l-0.38867 0.12891c-0.17263 0.057559-0.30777 0.19257-0.36523 0.36523l-0.12891 0.38867c-0.02174 0.066235-0.11498 0.066235-0.13672 0l-0.12891-0.38867c-0.057518-0.17259-0.19265-0.30772-0.36523-0.36523l-0.38867-0.12891c-0.06624-0.021738-0.06624-0.11498 0-0.13672l0.38867-0.12891c0.17258-0.057518 0.30772-0.19265 0.36523-0.36523l0.12891-0.38867c0.011-0.032993 0.039565-0.048828 0.068359-0.048828z" />
                </svg>

                Nyx Assistant

            </span>

            <!-- *************************************************************************************************** -->

            <div class="d-flex ms-auto py-1">

                <!-- *********************************************************************************************** -->

                <template v-if="state.appMode !== 'preview'">

                    <button class="btn btn-sm btn-primary me-1" type="button" @click="resetDrv">
                        <i class="bi bi-recycle"></i> Reset
                    </button>

                    <button class="btn btn-sm btn-primary me-1" type="button" @click="importDrv">
                        <i class="bi bi-upload"></i> Import
                    </button>

                    <button class="btn btn-sm btn-primary me-0" type="button" @click="exportDrv">
                        <i class="bi bi-download"></i> Export
                    </button>

                    <button class="btn btn-sm btn-primary me-1" type="button" @click="previewDrv">
                        <i class="bi bi-window"></i> Preview
                    </button>

                </template>

                <!-- *********************************************************************************************** -->

                <template v-if="state.appMode === 'preview'">

                    <span class="badge rounded-pill text-bg-warning">interface preview</span>

                </template>

                <!-- *********************************************************************************************** -->

            </div>

            <!-- *************************************************************************************************** -->

            <div class="d-flex ms-2 py-1">

                <button class="btn btn-sm btn-primary me-1" type="button" @click="about">
                    <i class="bi bi-question-circle"></i>
                </button>

                <label class="btn btn-sm btn-primary me-0" for="C2D68371">
                    <i class="bi bi-moon-stars"></i>
                </label>

            </div>

            <!-- *************************************************************************************************** -->

            <div class="d-flex ms-2 py-1">

                <button class="btn btn-sm btn-primary me-1" type="button" @click="() => getCurrentWindow().minimize()" :hidden="!HAS_TAURI">
                    <i class="bi bi-dash-lg"></i>
                </button>

                <button class="btn btn-sm btn-primary me-1" type="button" @click="() => getCurrentWindow().toggleMaximize()" :hidden="!HAS_TAURI">
                    <i class="bi bi-collection"></i>
                </button>

                <button class="btn btn-sm btn-primary me-0" type="button" @click="() => getCurrentWindow().close()" :hidden="!HAS_TAURI">
                    <i class="bi bi-x-lg"></i>
                </button>

            </div>

            <!-- *************************************************************************************************** -->

        </div>
    </nav>

    <!-- *********************************************************************************************************** -->

    <div style="background-color: var(--bs-body-bg); height: calc(100% - 2.5rem);">

        <!-- ******************************************************************************************************* -->
        <!-- BODY MODE 'ASSISTANT'                                                                                   -->
        <!-- ******************************************************************************************************* -->

        <form class="d-flex flex-column overflow-y-auto h-100 p-3" v-if="state.appMode !== 'preview'">

            <node-descr :globals="state.globals" :changed="state.changed" :path="state.path" />

        </form>

        <!-- ******************************************************************************************************* -->
        <!-- BODY MODE 'PREVIEW'                                                                                     -->
        <!-- ******************************************************************************************************* -->

        <div class="d-flex flex-column overflow-y-auto h-100 p-3" v-if="state.appMode === 'preview'">

            <nav-tabs margin="mb-4">

                <tab-pane :title="device['@name']" icon="command" :rank="device['@rank']" v-for="device in Object.values(devices)" :key="`${device['@name']}-${device['@rank']}`">

                    <div class="d-flex align-items-center justify-content-center h-100">

                        <nyx-device :device-info="device" />

                    </div>

                </tab-pane>

            </nav-tabs>

        </div>

        <!-- ******************************************************************************************************* -->

    </div>

    <!-- *********************************************************************************************************** -->

</template>

<style>
/*--------------------------------------------------------------------------------------------------------------------*/

@import url(assets/app.css);

/*--------------------------------------------------------------------------------------------------------------------*/
</style>
