const { execSync } =require('child_process');

module.exports = function (ctx)
{
console.log('change registry');
execSync('npm config set registry https://nexus.devnet.klm.com/repository/npm/');
console.log('change registry done');

}