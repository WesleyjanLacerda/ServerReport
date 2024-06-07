@echo off

rem URL da rota /api/atualizartodos
set URL=http://localhost:3000/api/atualizartodos

rem Nome do arquivo zip
set ZIP_FILE=relatorios.zip

rem Credenciais de autenticação
set USERNAME=admin
set PASSWORD=admin

rem Baixar o arquivo zip com autenticação
curl -o %ZIP_FILE% -u %USERNAME%:%PASSWORD% %URL%

rem Extrair o conteúdo do arquivo zip usando o utilitário tar (para sistemas Windows)
tar -xf %ZIP_FILE%

rem Excluir o arquivo zip após a extração
del %ZIP_FILE%
