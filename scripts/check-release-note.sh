#!/bin/sh

echo "Avez-vous ajouté une note de version ? (o/n)"
read reponse

if [ "$reponse" != "o" ] && [ "$reponse" != "O" ]; then
  echo "Versionnage annulé. Merci d'ajouter une note de version."
  exit 1
fi

echo "Merci ! On continue le versionnage..."
