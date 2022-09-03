module.exports = {
    mode: 'dev',
    corsAllowURL:process.env.NODE_ENV=="production"?"https://btc.jparez.tk":"http://localhost:8080",
    port:7891,
    portWS:8090,
    token_secret_login: 'dsga1vhszu7vfmse94vehfioz2vzenkl09',
    token_expires_in: '90d',
}