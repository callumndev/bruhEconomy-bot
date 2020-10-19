module.exports = async (m, c) => {
    let mAp = [];
    let mBp = [];

    await c.cmdConfig['required'].author.forEach(p => !m.member.hasPermission(p) ? mAp.push(p) : null);
    await c.cmdConfig['required'].bot.forEach(p => !m.guild.me.hasPermission(p) ? mBp.push(p) : null);

    let iMaP = mAp.length != 0 ? true : false;
    let iMbP = mBp.length != 0 ? true : false;

    if(iMaP) { m.channel.send(`:x: - You are missing the \`${mAp.map(mP => mP).join(', ')}\` permission(s) that are required in order to use this command`); return iMaP; }
    else if(iMbP) { m.channel.send(`:x: - I am missing the \`${mBp.map(mP => mP).join(', ')}\` permission(s) that are required for me to run this command`); return iMbP; };
};