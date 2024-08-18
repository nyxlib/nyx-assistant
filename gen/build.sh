#!/bin/bash

########################################################################################################################

THIS_SCRIPT=${BASH_SOURCE[0]:-$0}

while [[ -n $(readlink "${THIS_SCRIPT}") ]]
do
  THIS_SCRIPT=$(readlink "${THIS_SCRIPT}")
done

NYX_GEN_HOME=$(cd "$(dirname "${THIS_SCRIPT}")" && pwd)

########################################################################################################################

NYX_GEN_HOST=$(rustc -Vv | grep '^host:' | cut -f 2 -d ' ')

########################################################################################################################

pyinstaller \
--onefile \
--noconfirm \
--specpath "${NYX_GEN_HOME}/build/" \
--workpath "${NYX_GEN_HOME}/build/" \
--distpath "${NYX_GEN_HOME}/../tauri/binaries/" \
--name "nyx-gen-${NYX_GEN_HOST}" \
"${NYX_GEN_HOME}/nyx-gen"

########################################################################################################################
