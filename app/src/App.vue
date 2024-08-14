<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, VueMissingComponentImportInspection -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {Window, getCurrentWindow} from '@tauri-apps/api/window';

import {ref, inject, reactive, onMounted} from 'vue';

/*--------------------------------------------------------------------------------------------------------------------*/

import NyxDevice from './controls/preview/NyxDevice.vue';
import NodeDescr from './controls/descrs/NodeDescr.vue';

import NavTabs from './controls/NavTabs.vue';
import TabPane from './controls/TabPane.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const dialog = inject('dialog');

/*--------------------------------------------------------------------------------------------------------------------*/

const DEFAULT_GLOBALS = {
    /* NODE */
    nodeName: '',
    nodeTimeout: 1000,
    hardcoded: true,
    /* MQTT */
    enableMQTT: false,
    mqttURI: '',
    mqttUsername: '',
    mqttPassword: '',
    /* TCP */
    enableTCP: false,
    tcpURI: '',
    /* DEVICES */
    devices: {},
};

/*--------------------------------------------------------------------------------------------------------------------*/

const state = reactive({
    appMode: window.location.hash === '#/preview/' ? 'preview' : '',
    globals: Object.assign({}, DEFAULT_GLOBALS),
    theme: 'light',
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const about = () => {

    dialog.show('Nyx Assistant\n\nAuthor: Jérôme ODIER\nEmail: jerome.odier@lpsc.in2p3.fr', 'About', 'success');
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
        Object.keys(def).forEach((key) => { result[key] = (key in src) ? src[key] : def[key]; });
    }

    return result;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const resetDrv = () => {

    dialog.confirm('Loose modifications?').then((ok) => {

        if(ok)
        {
            state.globals = confDup(DEFAULT_GLOBALS, DEFAULT_GLOBALS);

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
        dialog.open('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json']).catch(dialog.error).then((json) => {

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

        dialog.save('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json'], JSON.stringify(config, null, 2)).catch(dialog.error).then(() => {

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

    if(typeof window['__TAURI__'] !== 'undefined')
    {
        Window.getByLabel('preview')?.show();
    }
    else
    {
        window.open('index.html#/preview/', 'Preview', 'width=1200,height=800,menubar=no,location=no,status=no,scrollbars=yes,resizable=yes');
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const kk = ref({'Telescope Simulator':{'Test':{'foo':{'<>':'defSwitchVector','children':[{'<>':'defSwitch','@name':'button1_on','@label':'Turn ON','$':'On','@orig':'On'},{'<>':'defSwitch','@name':'button2_off','@label':'Turn OFF','$':'Off','@orig':'Off'}],'@client':'TOTO','@device':'Telescope Simulator','@name':'foo','@state':'Ok','@perm':'rw','@rule':'AtMostOne','@timestamp':'2024-08-12T16:05:51','@group':'Test'},'bar':{'<>':'defSwitchVector','children':[{'<>':'defSwitch','@name':'foo_on','@label':'Foo ON','$':'On','@orig':'On'},{'<>':'defSwitch','@name':'foo_off','@label':'Foo OFF','$':'Off','@orig':'Off'}],'@client':'TOTO','@device':'Telescope Simulator','@name':'bar','@state':'Ok','@perm':'rw','@rule':'AtMostOne','@timestamp':'2024-08-12T16:05:51','@group':'Test'},'qux':{'<>':'defNumberVector','children':[{'<>':'defNumber','@name':'qux1','@label':'Qux 1','@format':'%.1f','@min':0,'@max':1,'@step':0.1,'$':'0.5','@orig':'0.5'},{'<>':'defNumber','@name':'qux2','@label':'Qux 2','@format':'%.1f','@min':0,'@max':1,'@step':0.1,'$':'0.5','@orig':'0.5'}],'@client':'TOTO','@device':'Telescope Simulator','@name':'qux','@state':'Ok','@perm':'rw','@timestamp':'2024-08-12T16:05:51','@group':'Test'}}}});

/*--------------------------------------------------------------------------------------------------------------------*/
/* INITIALIZATION                                                                                                     */
/*--------------------------------------------------------------------------------------------------------------------*/

onMounted(() => {

    if(typeof window['__TAURI__'] === 'undefined')
    {
        document.body.setAttribute('data-environment', 'browser');
    }
    else
    {
        document.body.setAttribute('data-environment', 'tauri');

        /*------------------------------------------------------------------------------------------------------------*/

        const mainWindow = Window.getByLabel('main');
        const previewWindow = Window.getByLabel('preview');

        /*------------------------------------------------------------------------------------------------------------*/

        const updateWindow = () => {

            mainWindow.isMaximized().catch(() => {}).then((maximized) => {

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
                mainWindow.toggleMaximize();
            }
        });

        /*------------------------------------------------------------------------------------------------------------*/

        previewWindow.listen('tauri://close-requested', () => {

            previewWindow.hide();
        });

        /*------------------------------------------------------------------------------------------------------------*/
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    state.theme = localStorage.getItem('preview-assistant-theme') || 'dark';

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

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                <path d="m16 15.5c0 0.27615-0.22386 0.50002-0.50002 0.50002h-3.0001c-0.66652-1.64e-4 -0.66652-1.0002 0-1h2.5001v-2.5001c4.9e-4 -0.6662 1.0005-0.6662 1 0z" /><path d="m16 0.50002c0-0.27615-0.22386-0.50002-0.50002-0.50002h-3.0001c-0.66652 1.6328e-4 -0.66652 1.0002 0 1h2.5001v2.5001c4.9e-4 0.6662 1.0005 0.6662 1 0z" /><path d="m1.7984e-7 15.5c0 0.27615 0.22386 0.50002 0.50002 0.50002h3.0001c0.66652-1.63e-4 0.66652-1.0002 0-1h-2.5001v-2.5001c-4.8972e-4 -0.6662-1.0005-0.6662-1 0z" /><path d="m1.7984e-7 0.50002c0-0.27615 0.22386-0.50002 0.50002-0.50002h3.0001c0.66652 1.6328e-4 0.66652 1.0002 0 1h-2.5001v2.5001c-4.8972e-4 0.6662-1.0005 0.6662-1 0z" /><path d="m8.0273 3c0.13476 0.0095135 0.26484 0.091406 0.31641 0.24609l0.64453 1.9375c0.28785 0.86331 0.96661 1.5407 1.8301 1.8281l1.9355 0.64453c0.33 0.11 0.33 0.57555 0 0.68555l-1.9375 0.64648c-0.86331 0.28785-1.5407 0.96465-1.8281 1.8281l-0.64453 1.9355c-0.047321 0.14419-0.16278 0.22743-0.28711 0.24609a8 5 0 0 0 7.9434-4.998 8 5 0 0 0-7.9727-5zm-0.082031 0.0019531a8 5 0 0 0-7.9453 4.998 8 5 0 0 0 7.9453 4.998c-0.12433-0.01866-0.23979-0.10191-0.28711-0.24609l-0.64648-1.9355c-0.28764-0.86309-0.96503-1.5405-1.8281-1.8281l-1.9355-0.64648c-0.33124-0.10871-0.33124-0.57684 0-0.68555l1.9355-0.64453c0.86309-0.28764 1.5405-0.96503 1.8281-1.8281l0.64648-1.9375c0.047882-0.14365 0.16304-0.22555 0.28711-0.24414zm3.3047 1.248c0.028794 0 0.057362 0.015835 0.068359 0.048828l0.12891 0.38867c0.05756 0.17263 0.19257 0.30777 0.36523 0.36523l0.38867 0.12891c0.06599 0.021996 0.06599 0.11472 0 0.13672l-0.38867 0.12891c-0.17263 0.057559-0.30777 0.19257-0.36523 0.36523l-0.12891 0.38867c-0.02174 0.066235-0.11498 0.066235-0.13672 0l-0.12891-0.38867c-0.057518-0.17259-0.19265-0.30772-0.36523-0.36523l-0.38867-0.12891c-0.06624-0.021738-0.06624-0.11498 0-0.13672l0.38867-0.12891c0.17258-0.057518 0.30772-0.19265 0.36523-0.36523l0.12891-0.38867c0.011-0.032993 0.039565-0.048828 0.068359-0.048828z" />
            </svg>

            <!-- *************************************************************************************************** -->

            <div class="d-flex ms-auto py-1">

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

                <button class="btn btn-sm btn-primary me-1" type="button" @click="() => getCurrentWindow().minimize()">
                    <i class="bi bi-dash-lg"></i>
                </button>

                <button class="btn btn-sm btn-primary me-1" type="button" @click="() => getCurrentWindow().toggleMaximize()">
                    <i class="bi bi-collection"></i>
                </button>

                <button class="btn btn-sm btn-primary me-0" type="button" @click="() => getCurrentWindow().close()">
                    <i class="bi bi-x-lg"></i>
                </button>

            </div>

            <!-- *************************************************************************************************** -->

        </div>
    </nav>

    <!-- *********************************************************************************************************** -->

    <div class="d-flex" style="background-color: var(--bs-body-bg); height: calc(100% - 2.5rem);">

        <!-- ******************************************************************************************************* -->
        <!-- BODY MODE 'ASSISTANT'                                                                                   -->
        <!-- ******************************************************************************************************* -->

        <form class="p-3" style="height: 100%; width: 100%; overflow-y: auto;" v-if="state.appMode !== 'preview'">

            <node-descr :globals="state.globals" />

        </form>

        <!-- ******************************************************************************************************* -->
        <!-- BODY MODE 'PREVIEW'                                                                                     -->
        <!-- ******************************************************************************************************* -->

        <div class="p-3" style="height: 100%; width: 100%; overflow-y: auto;" v-if="state.appMode === 'preview'">

            <div class="h-100 d-flex flex-column">

                <nav-tabs margin="mb-4">

                    <tab-pane class="d-flex align-items-center justify-content-center" :title="deviceName" icon="command" v-for="(deviceInfo, deviceName, deviceIndex) in kk" :key="deviceName">

                        <nyx-device :device-name="deviceName" :device-info="deviceInfo" :device-index="deviceIndex" />

                    </tab-pane>

                </nav-tabs>

            </div>

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
