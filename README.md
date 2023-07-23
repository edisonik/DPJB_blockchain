# Diretório de Jornalistas - UNB
### Professor
Edison Ishikawa
### Desenvolvedores
Bruno Couto Marino (190011106)


Luiza de Araújo Nunes Gomes (190112794)


Eduardo Xavier Dantas (190086530)


Carlos Eduardo de Carvalho Veras (222012729)

### Rodando

#### Inicializar a Test Network:

cd fabric-samples/test-network

./network.sh up createChannel

./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript -ccl typescript


#### Inicializar a aplicação:

cd fabric-samples/test-network

./network.sh down

./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript

cd ../asset-transfer-basic/application-gateway-typescript

npm install

npm start
