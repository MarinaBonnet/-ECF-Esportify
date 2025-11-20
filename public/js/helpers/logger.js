import chalk from "chalk";

export function logInfo(message) {
  console.log(chalk.cyan(`ℹ️ ${message}`));
}

export function logSuccess(message) {
  console.log(chalk.green(`✅ ${message}`));
}

export function logWarn(message) {
  console.log(chalk.yellow(`⚠️ ${message}`));
}

export function logError(message) {
  console.log(chalk.red(`❌ ${message}`));
}

export function logTitle(message) {
  console.log(chalk.magenta.bold(`\n🔧 ${message.toUpperCase()}`));
}

//import { logInfo, logSuccess, logError, logTitle } from './helpers/logger.js';

//logTitle('Chargement du module MatchPlanner');
//logInfo('Initialisation des paramètres...');
//logSuccess('Match créé avec succès');
//logError('Erreur lors de la récupération des joueurs');
