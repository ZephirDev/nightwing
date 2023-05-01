#!/bin/bash

rm -rf ./dist

echo "--> run webpack"
webpack --config webpack.config.js
echo "#!/usr/bin/env node" > ./dist/tmp
cat ./dist/nightwing.js >> ./dist/tmp
mv ./dist/tmp ./dist/nightwing.js

echo "--> install runtime dependencies"
(cd dist && npm install)

echo "--> run snapcraft"
cp ./snapcraft.yaml ./dist/
(cd dist && snapcraft)
