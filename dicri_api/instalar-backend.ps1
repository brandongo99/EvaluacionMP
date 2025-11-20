npm init -y

npm install express cors dotenv jsonwebtoken mssql bcrypt swagger-ui-express swagger-jsdoc

npm install --save-dev nodemon

$packageJson = Get-Content "./package.json" -Raw | ConvertFrom-Json

if (-not $packageJson.scripts.dev) {
    $packageJson.scripts.dev = "nodemon index.js"
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "./package.json"
}

Write-Host "Dependencias instaladas y configuración lista."
Write-Host "Ahora puedes correr el proyecto con: npm run dev"