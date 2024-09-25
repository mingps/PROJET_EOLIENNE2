const mqtt = require('mqtt');
//require('dotenv').config(); // Charger les variables d'environnement depuis un fichier .env

// Options de connexion avec authentification
//const options = {
  //nom_utilisateur:'raspi',
   //process.env.MQTT_Nom_Utisateur,
  //mot_de_passe:'raspi'
  //process.env.MQTT_Mot_de_Passe};
const BrokerURL =  'mqtt://raspi:raspi@192.168.1.24:1883';
// Afficher les options de connexion pour le débogage
//console.log('Options de connexion:', options);
//console.log('MQTT_BROKER_URL:',process.env.MQTT_BROKER_URL);
//console.log('MQTT_BROKER_URL:',BrokerURL);
// Se connecter au broker MQTT
//const client = mqtt.connect(process.env.MQTT_BROKER_URL, options);
const client = mqtt.connect(BrokerURL);
client.on('connect', function () {
  console.log('Connecté à MQTT Broker');

  // S'abonner au topic 
  client.subscribe('DONNEE', function (err) {
    if (!err) {
      console.log('Abonné au topic "DONNEE"');
    } else {
      console.error('Erreur lors de l\'abonnement au topic "DONNEE" : ', err);
    }
  });

  /*S'abonner au topic humidité
  client.subscribe('humidité', function (err) {
    if (!err) {
      console.log('Abonné au topic "humidité"');
    } else {
      console.error('Erreur lors de l\'abonnement au topic "humidité" : ', err);
    }
  });*/
});

client.on('message', function (topic, message) {
  console.log(`Message reçu sur ${topic}: ${message.toString()}`);
});
client.on('error', function (err) {
  console.error('Erreur de connexion à MQTT Broker :', err);
});
module.exports = client;