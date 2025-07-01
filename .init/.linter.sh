#!/bin/bash
cd /home/kavia/workspace/code-generation/tictacmaster-63129-e2f45288/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

