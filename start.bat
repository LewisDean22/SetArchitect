wt new-tab cmd /k "cd /d %CD%\src\frontend && npm run dev" ; new-tab cmd /k "cd /d %CD%\src && poetry run uvicorn backend.main:app --reload"
