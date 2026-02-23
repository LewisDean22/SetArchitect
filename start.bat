wt new-tab cmd /k "cd /d %CD%\src\frontend && npm run dev" ; new-tab cmd /k "cd /d %CD%\src\backend && poetry run uvicorn main:app --reload"
