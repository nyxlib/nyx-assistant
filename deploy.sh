#!/bin/bash

npm run build && scp ./dist/*.js vps:/var/www/addons.nyxlib.org/addons/nyx-assistant/latest/ && tput bel
