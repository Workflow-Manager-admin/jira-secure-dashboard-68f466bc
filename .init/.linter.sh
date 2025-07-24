#!/bin/bash
cd /home/kavia/workspace/code-generation/jira-secure-dashboard-68f466bc/frontend_dashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

