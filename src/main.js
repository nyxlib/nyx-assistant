/*--------------------------------------------------------------------------------------------------------------------*/

import {createApp} from 'vue';

import {Tooltip} from 'bootstrap';

import * as os from '@tauri-apps/plugin-os';

/*--------------------------------------------------------------------------------------------------------------------*/

import dialog from './plugins/dialog.js';
import input from './plugins/input.js';
import std from './plugins/std.js';

import App from './App.vue';

/*--------------------------------------------------------------------------------------------------------------------*/

if(typeof window['__TAURI__'] === 'undefined')
{
    /**/ if (/linux/i.test(navigator.userAgent)) {
        window.__NYX_OS_TYPE__ = 'linux';
    }
    else if (/macintosh/i.test(navigator.userAgent)) {
        window.__NYX_OS_TYPE__ = 'macos';
    }
    else if (/windows/i.test(navigator.userAgent)) {
        window.__NYX_OS_TYPE__ = 'windows';
    }
    else if(/android/i.test(navigator.userAgent)) {
        window.__NYX_OS_TYPE__ = 'android';
    }
    else if(/ipad|iphone/i.test(navigator.userAgent)) {
        window.__NYX_OS_TYPE__ = 'ios';
    }
    else {
        window.__NYX_OS_TYPE__ = 'unknown';
    }
}
else
{
    window.__NYX_OS_TYPE__ = os.type();
}

/*--------------------------------------------------------------------------------------------------------------------*/

const app = createApp(App);

/*--------------------------------------------------------------------------------------------------------------------*/

app.use(dialog);
app.use(input);
app.use(std);

/*--------------------------------------------------------------------------------------------------------------------*/

app.directive('tooltip', {

    mounted(el)
    {
        const title = el.getAttribute('title');

        if(title)
        {
            new Tooltip(el, {
                fallbackPlacements: ['right'],
                placement: 'right',
                trigger: 'hover',
                title: title,
            });
        }
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

app.mount('#nyx_assistant');

/*--------------------------------------------------------------------------------------------------------------------*/
