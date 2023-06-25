# Script criado para automatizar o processo de desenvolvimento
# O script não torna o processo de atualização dos containers automatico
# Apenas agiliza o processo de executar os comandos via bash
if [[ $1 == "start" ]]; then # Para executar compilando qualquer modificação nas imagens
    docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.api.yml up -d --build
elif [[ $1 == "stop" ]]; then # Para interromper a execução e remover os containers
    docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.api.yml down
elif [[ $1 == "restart" ]]; then # Para atualizar os conteiners com as novas modificações
    docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.api.yml down
    docker stop $(docker ps -a -q)
    docker rm $(docker ps -a -q)
    docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.api.yml up -d --build
elif [[ $1 == "limpar" ]]; then # Para limpar os containers, imagens e volumes sem uso
    docker stop $(docker ps -a -q)
    docker container prune -f
    docker image prune -f
    docker volume prune -f
fi