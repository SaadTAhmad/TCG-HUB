const discordApiBase = "https://discord.com/api/v10";

export async function setDiscordRole(discordUserId: string, shouldHaveRole: boolean) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const roleId = process.env.DISCORD_PAID_ROLE_ID;

  if (!botToken || !guildId || !roleId) {
    throw new Error("Discord role sync env vars are not configured.");
  }

  const url = `${discordApiBase}/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`;
  const response = await fetch(url, {
    method: shouldHaveRole ? "PUT" : "DELETE",
    headers: {
      Authorization: `Bot ${botToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Discord role sync failed with ${response.status}.`);
  }
}
