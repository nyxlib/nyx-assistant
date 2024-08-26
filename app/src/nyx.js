/*--------------------------------------------------------------------------------------------------------------------*/

const VECTOR_DICT = {
    'number': 'defNumberVector',
    'text': 'defTextVector',
    'light': 'defLightVector',
    'switch': 'defSwitchVector',
    'blob': 'defBLOBVector',
};

const VEC_DICT = {
    'number': 'defNumber',
    'text': 'defText',
    'light': 'defLight',
    'switch': 'defSwitch',
    'blob': 'defBLOB',
};

/*--------------------------------------------------------------------------------------------------------------------*/

const STATE_DICT = {
    'NYX_STATE_IDLE': 'Idle',
    'NYX_STATE_OK': 'Ok',
    'NYX_STATE_BUSY': 'Busy',
    'NYX_STATE_ALERT': 'Alert',
};

const PERM_DICT = {
    'NYX_PERM_RO': 'ro',
    'NYX_PERM_WO': 'wo',
    'NYX_PERM_RW': 'rw',
};

const RULE_DICT = {
    'NYX_RULE_ONE_OF_MANY': 'OneOfMany',
    'NYX_RULE_AT_MOST_ONE': 'AtMostOne',
    'NYX_RULE_ANY_OF_MANY': 'AnyOfMany',
};

const ONOFF_DICT = {
    'NYX_ONOFF_ON': 'On',
    'NYX_ONOFF_OFF': 'Off',
};

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedEntity = (devices) => {

    const result = Object.values(devices);

    result.sort((x, y) => x.rank - y.rank);

    return result;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const convert = (devices) => {

    const xmlDevices = {};

    sortedEntity(devices).filter((device) => (device.id || '').startsWith('device:')).forEach((device) => {

        /*------------------------------------------------------------------------------------------------------------*/

        const xmlDevice = xmlDevices[device.name] = {
            '@name': device.name,
            '@rank': device.rank,
        };

        /*------------------------------------------------------------------------------------------------------------*/

        const deviceDefs = xmlDevice['children'] = {};

        /*------------------------------------------------------------------------------------------------------------*/

        sortedEntity(device.vectors).filter((vector) => (vector.id || '').startsWith('vector:')).forEach((vector) => {

            /*--------------------------------------------------------------------------------------------------------*/

            const group = vector.group || 'Main';

            /*--------------------------------------------------------------------------------------------------------*/

            let xmlGroup;

            if(group in deviceDefs) {
                xmlGroup = deviceDefs[group] ; //;
            }
            else {
                xmlGroup = deviceDefs[group] = {};
            }

            /*--------------------------------------------------------------------------------------------------------*/

            try
            {
                /*----------------------------------------------------------------------------------------------------*/

                const xmlVector = {
                    '<>': VECTOR_DICT[vector.type],
                    '@device': device.name,
                    '@name': vector.name,
                    '@rank': vector.rank,
                };

                /*----------------------------------------------------------------------------------------------------*/

                if(vector.label) {
                    xmlVector['@label'] = vector.label;
                }

                if(vector.group) {
                    xmlVector['@group'] = vector.group;
                }

                if(vector.state) {
                    xmlVector['@state'] = STATE_DICT[vector.state];
                }

                if(vector.perm) {
                    xmlVector['@perm'] = PERM_DICT[vector.perm];
                }

                if(vector.rule) {
                    xmlVector['@rule'] = RULE_DICT[vector.rule];
                }

                if(vector.timeout) {
                    xmlVector['@timeout'] = vector.timeout;
                }

                if(vector.message) {
                    xmlVector['@message'] = vector.message;
                }

                /*----------------------------------------------------------------------------------------------------*/

                // noinspection JSMismatchedCollectionQueryUpdate
                const xmlDefs = xmlVector['children'] = [];

                /*----------------------------------------------------------------------------------------------------*/

                Object.values(vector.defs).filter((def) => (def.id || '').startsWith('def:')).forEach((def) => {

                    /*------------------------------------------------------------------------------------------------*/

                    const xmlDef = {
                        '<>': VEC_DICT[vector.type],
                        '@name': def.name,
                        '@rank': def.rank,
                    };

                    /*------------------------------------------------------------------------------------------------*/

                    if(def.label) {
                        xmlDef['@label'] = def.label;
                    }

                    if(def.format) {
                        xmlDef['@format'] = def.format;
                    }

                    if(def.min) {
                        xmlDef['@min'] = def.min;
                    }

                    if(def.max) {
                        xmlDef['@max'] = def.max;
                    }

                    if(def.step) {
                        xmlDef['@step'] = def.step;
                    }

                    if(def.value) {
                        xmlDef['$'] = vector.type === 'switch' ? ONOFF_DICT[def.value] : def.value;
                    }

                    /*------------------------------------------------------------------------------------------------*/

                    xmlDefs.push(xmlDef);

                    /*------------------------------------------------------------------------------------------------*/
                });

                /*----------------------------------------------------------------------------------------------------*/

                xmlGroup[vector.name] = xmlVector;

                /*----------------------------------------------------------------------------------------------------*/
            }
            catch(e)
            {
                console.error(e);
            }
        });
    });

    console.log(JSON.stringify(xmlDevices, null, 2));

    return xmlDevices;
};

/*--------------------------------------------------------------------------------------------------------------------*/

export default convert;

/*--------------------------------------------------------------------------------------------------------------------*/
