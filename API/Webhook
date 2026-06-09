export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Security Check
  const serverSecret = process.env.EXECUTOR_SECRET; 
  const clientSecret = req.headers['authorization'];

  if (serverSecret && clientSecret !== serverSecret) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1513841568430293052/Iq9d2Vq5jEOX7ycm2DZHr4zOIXEjLr1IHj7WtH28mQhDxwot2ILlewvWiMGkWCRoqG-j';

  try {
    let gameData = req.body;
    if (typeof gameData === 'string') {
      try { gameData = JSON.parse(gameData); } catch (e) { gameData = { CustomMessage: gameData }; }
    }

    // Extracting all the extra metadata fields
    const username = gameData.Username || "Unknown";
    const userId = gameData.UserId || "0";
    const accountAge = gameData.AccountAge || "Unknown";
    const membership = gameData.MembershipType || "None";
    
    const executorName = gameData.ExecutorUsed || "Unknown";
    const placeId = gameData.PlaceId || "0";
    const job臨 = gameData.JobId || "Not Public";
    
    const ping = gameData.Ping || "N/A";
    const fps = gameData.FPS || "N/A";
    const location = gameData.Location || "Unknown";
    const customMessage = gameData.CustomMessage || "*No message*";

    const discordPayload = {
      username: "Advanced Game Analytics",
      avatar_url: "https://i.imgur.com/wSTFkRM.png",
      embeds: [
        {
          title: "📊 Comprehensive Execution Log",
          color: 3447003, // Slate Blue
          fields: [
            {
              name: "👤 User Profile",
              value: `**User:** [${username}](https://www.roblox.com/users/${userId}/profile)\n**ID:** \`${userId}\`\n**Age:** ${accountAge} days\n**Tier:** ${membership}`,
              inline: true
            },
            {
              name: "⚙️ Script Environment",
              value: `**Executor:** \`${executorName}\`\n**Place ID:** \`${placeId}\`\n**Server JobId:**\n\`${job臨}\``,
              inline: true
            },
            {
              name: "📈 Client Performance & Telemetry",
              value: `**Ping:** ${ping}ms\n**FPS:** ${fps}\n**Position:** \`${location}\``,
              inline: false
            },
            {
              name: "📝 Submitted UI Text",
              value: `\`\`\`text\n${customMessage}\n\`\`\``,
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "Private Test Environment Telemetry" }
        }
      ]
    };

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) throw new Error(`Discord Status: ${discordResponse.status}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
          title: "Client Data Log",
          description: "```json\n" + JSON.stringify(gameData, null, 2) + "\n```",
          color: 10181046 // Purple color
        }
      ]
    };

    // 5. Send to Discord
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      throw new Error(`Discord returned status ${discordResponse.status}`);
    }

    return res.status(200).json({ success: true, message: 'Data sent successfully!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  
