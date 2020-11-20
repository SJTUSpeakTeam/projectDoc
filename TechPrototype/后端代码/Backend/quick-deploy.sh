#!/bin/bash
BACK_END_VERSION="$1"

# sed -i "s/BACK_END_VERSION=\".*/BACK_END_VERSION=\"${BACK_END_VERSION}\"/g" ../cluster-setup/deployment.sh

# sed -i "s/BACK_END_VERSION=\".*/BACK_END_VERSION=\"${BACK_END_VERSION}\"/g" ./deployment.sh

./deployment.sh $BACK_END_VERSION

./clean.sh
