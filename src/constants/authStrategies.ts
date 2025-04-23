export enum AuthStrategies {
  LOCAL = 'local',
  JWT = 'jwt',
  JWT_REFRESH = 'jwt-refresh',
}

//local means that the user is authenticated using a username and password, stored in the database
//jwt means that the user is authenticated using a JWT token
//jwt-refresh means that the user is authenticated using a JWT refresh token
