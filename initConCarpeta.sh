#!/bin/bash

mkdir css src js img &&
curl -O "https://raw.githubusercontent.com/jorgeatgu/base/master/{.stylelintrc,.gitignore,.stylelintignore,package.json,gulpfile.js,index.html}" &&
cd src &&
mkdir css img js &&
cd css &&
curl -O "https://raw.githubusercontent.com/jorgeatgu/base/master/{_variables.css,styles.css}" &&
cd ../js &&
touch index.js &&
cd .. &&
cd .. &&
git init &&
git add . &&
git commit -m 'estructura creada' &&
echo -e '\e[94m\e[1mEsto va a costar un poco' &&
npm i &&
echo -e '\e[94m\e[1mEl script ha terminado. Es hora de picar código! \U0001f913\n' &&
afplay /System/Library/Sounds/Submarine.aiff &&
say El script ha terminado. Es hora de picar código!
