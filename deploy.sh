#!/bin/bash
hugo --minify --environment production
lftp -u "seu_usuario,seu_password" sftp://tratamentes.pt << EOF
mirror --reverse --delete --verbose ./dist /caminho/no/servidor
bye
EOF
