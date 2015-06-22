#!/bin/bash

#test if querystring is restart
if [[ $QUERY_STRING = "restart=true" ]]
then
  #reset game if mode is reset
  echo "-;-;-;-;-;-;-;-;-;1" > gamefile.txt
else
  #process data if setField is set

  #read data from file
  gameFile=$(<gamefile.txt)

  #split data into array
  gameData=(${gameFile//;/ })

  #clean QUERY_STRING to get field index
  fieldIndex=${QUERY_STRING#"setField="}

  #set player specific character and change players
  if [ ${gameData[9]} -eq 1 ]
  then
    gameData[fieldIndex]="x"
    gameData[9]=2
  else
    gameData[fieldIndex]="o"
    gameData[9]=1
  fi

  #write data in file
  printf "%s;" "${gameData[@]}" > gamefile.txt
fi

