export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers['authorization'];
    if (authHeader !== process.env.EXECUTOR_SECRET) {
        return res.status(401).json({ error: 'Unauthorized signature' });
    }

    try {
        const data = req.body;

        // Data mapping with defaults
        const username = data.Username || "Unknown";
        const displayName = data.DisplayName || "No Nickname";
        const userId = data.UserId || "0";
        const accountAge = data.AccountAge || "Unknown";
        const membership = data.MembershipType || "None";
        const locale = data.Locale || "Unknown";
        const executorName = data.ExecutorUsed || "Unknown";
        const deviceType = data.DeviceType || "Unknown Device";
        const gameTitle = data.GameTitle || "Unknown Location";
        const placeId = data.PlaceId || "0";
        const jobId = data.JobId || "";
        const playerCapacity = data.PlayerCapacity || "N/A";
        const currentTeam = data.Team || "No Team";
        const localHealth = data.Health || "100";
        const localMaxHealth = data.MaxHealth || "100";
        const ping = data.Ping || 0;
        const fps = data.FPS || "N/A";
        const location = data.Location || "Unknown";
        const customMessage = data.CustomMessage || "No message.";

        // Region Calculation
        let estimatedRegion = (ping < 50) ? "🇺🇸 US-Optimized" : (ping < 150 ? "🇪🇺 EU-Hop" : "🌏 Global-Route");

        // Avatar Fetching
        const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png`;
        let checkedAvatar = "https://i.imgur.com/wSTFkRM.png";
        try {
            const thumbResponse = await fetch(avatarUrl);
            const thumbData = await thumbResponse.json();
            if (thumbData?.data?.[0]) checkedAvatar = thumbData.data[0].imageUrl;
        } catch (e) { console.error("Avatar failed"); }

        // Discord Payload
        const payload = {
            username: "Telemetry Engine",
            avatar_url: checkedAvatar,
            embeds: [{
                title: "📈 Comprehensive Session Report",
                color: 30719,
                thumbnail: { url: checkedAvatar },
                fields: [
                    { name: "👤 User Identity", value: `**Name:** ${username}\n**Display:** ${displayName}\n**ID:** ${userId}`, inline: true },
                    { name: "⏳ Stats", value: `**Age:** ${accountAge}d\n**Tier:** ${membership}\n**Locale:** ${locale}`, inline: true },
                    { name: "⚙️ Client", value: `**Executor:** ${executorName}\n**Device:** ${deviceType}`, inline: true },
                    { name: "🗺️ Environment", value: `**Game:** ${gameTitle}\n**Place ID:** ${placeId}`, inline: true },
                    { name: "👥 Server", value: `**Capacity:** ${playerCapacity}\n**Team:** ${currentTeam}`, inline: true },
                    { name: "❤️ Health", value: `**Status:** ${localHealth}/${localMaxHealth}\n**Region:** ${estimatedRegion}`, inline: true },
                    { name: "🆔 Server Instance (Job ID)", value: `\`${jobId || "N/A"}\``, inline: false },
                    { name: "📊 Performance", value: `**Ping:** ${ping}ms | **FPS:** ${fps}\n**Pos:** \`${location}\``, inline: false },
                    { name: "📝 Custom Log", value: `\`\`\`${customMessage}\`\`\``, inline: false }
                ],
                footer: { text: "Secure Vercel Telemetry Pipeline" },
                timestamp: new Date().toISOString()
            }],
            components: jobId ? [{
                type: 1,
                components: [{
                    type: 2,
                    style: 5,
                    label: "⚡ Join Target Server",
                    url: `https://www.roblox.com/games/start?placeId=${placeId}&instanceId=${jobId}`
                }]
            }] : []
        };

        const response = await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(await response.text());
        return res.status(200).json({ status: 'Success' });

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
        // Dynamic Server Region Estimation Based on Network Latency
        let estimatedRegion = "⚡ Global Route";
        if (ping > 0 && ping < 45) estimatedRegion = "🇺🇸 US / Local Region Optimized";
        else if (ping >= 45 && ping < 130) estimatedRegion = "🇪🇺 EU / Mid-Tier Hop";
        else if (ping >= 130) estimatedRegion = "🌏 ASIA / High-Distance Routing";

        // Fetch User Avatar Thumbnail
        const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png&isCircular=false`;
        let checkedAvatar = "https://i.imgur.com/wSTFkRM.png"; 
        try {
            const thumbResponse = await fetch(avatarUrl);
            const thumbData = await thumbResponse.json();
            if (thumbData && thumbData.data && thumbData.data[0]) {
                checkedAvatar = thumbData.data[0].imageUrl;
            }
        } catch (e) {
            console.error("Avatar fallback layer engaged:", e.message);
        }

        const joinGameUrl = `https://www.roblox.com/games/start?placeId=${placeId}&instanceId=${jobId}`;

        const embedPayload = {
            username: "Advanced Analytics Node",
            avatar_url: checkedAvatar,
            embeds: [{
                title: "📈 Deep Telemetry Event Dispatched",
                color: 30719, 
                thumbnail: { url: checkedAvatar },
                fields: [
                    { name: "👤 Identity Profiles", value: `**User:** [${username}](https://www.roblox.com/users/${userId}/profile)\n**Display Name:** \`${displayName}\`\n**User ID:** \`${userId}\``, inline: true },
                    { name: "⏳ Account Metrics", value: `**Age:** ${accountAge} days\n**Tier:** ${membership}\n**Locale:** \`${locale}\``, inline: true },
                    { name: "⚙️ Executor Layer", value: `**Client Engine:** \`${executorName}\`\n**Platform:** \`${deviceType}\``, inline: true },
                    { name: "🗺️ Map Environment", value: `**Game Title:** \`${gameTitle}\`\n**Place ID:** \`${placeId}\``, inline: true },
                    { name: "👥 Server Capacity", value: `**Players:** ${playerCapacity}\n**Current Team:** \`${currentTeam}\``, inline: true },
                    { name: "❤️ Vitality Status", value: `**Health:** ${localHealth}/${localMaxHealth}\n**Est. Region:** \`${estimatedRegion}\``, inline: true },
                    { name: "🆔 Game Server Instance Job ID", value: jobId !== "" ? `\`${jobId}\`` : "`Studio Session / Non-Public Context`", inline: false },
                    { name: "📊 Diagnostics Performance", value: `**Latency:** ${ping}ms | **Framerate:** ${fps} FPS\n**Position Vectors:** \`${location}\``, inline: false },
                    { name: "📝 Submitted UI Log Message", value: `\`\`\`text\n${customMessage}\n\`\`\``, inline: false }
                ],
                footer: { text: "Vercel Secure Routing Gateway Protocol" },
                timestamp: new Date().toISOString()
            }],
            components: jobId !== "" ? [
                {
                    type: 1, 
                    components: [
                        {
                            type: 2, 
                            style: 5, 
                            label: "⚡ Join Target Server Via Browser",
                            url: joinGameUrl
                        }
                    ]
                }
            ] : []
        };

        const discordResponse = await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embedPayload)
        });

        if (!discordResponse.ok) {
            const rawErr = await discordResponse.text();
            return res.status(502).json({ error: 'Discord rejected payload', details: rawErr });
        }

        return res.status(200).json({ status: 'Success', message: 'Payload dispatched smoothly' });

    } catch (error) {
        return res.status(500).json({ error: 'Internal pipeline crash', details: error.message });
    }
}
        try {
            const thumbResponse = await fetch(avatarUrl);
            const thumbData = await thumbResponse.json();
            if (thumbData && thumbData.data && thumbData.data[0]) {
                checkedAvatar = thumbData.data[0].imageUrl;
            }
        } catch (e) {
            console.error("Avatar fallback layer engaged:", e.message);
        }

        const joinGameUrl = `https://www.roblox.com/games/start?placeId=${placeId}&instanceId=${jobId}`;

        const embedPayload = {
            username: "Advanced Analytics Node",
            avatar_url: checkedAvatar,
            embeds: [{
                title: "📈 Deep Telemetry Event Dispatched",
                color: 30719, 
                thumbnail: { url: checkedAvatar },
                fields: [
                    { name: "👤 Identity Profiles", value: `**User:** [${username}](https://www.roblox.com/users/${userId}/profile)\n**Display Name:** \`${displayName}\`\n**User ID:** \`${userId}\``, inline: true },
                    { name: "⏳ Account Metrics", value: `**Age:** ${accountAge} days\n**Tier:** ${membership}`, inline: true },
                    { name: "⚙️ Executor Layer", value: `**Client Engine:** \`${executorName}\``, inline: true },
                    { name: "🗺️ Map Environment", value: `**Game Title:** \`${gameTitle}\`\n**Place ID:** \`${placeId}\``, inline: true },
                    { name: "👥 Server Capacity", value: `**Players:** ${playerCapacity}`, inline: true },
                    { name: "❤️ Vitality Status", value: `**Health:** ${localHealth}/${localMaxHealth}`, inline: true },
                    { name: "🆔 Game Server Instance Job ID", value: jobId !== "" ? `\`${jobId}\`` : "`Studio Session / Non-Public Context`", inline: false },
                    { name: "📊 Diagnostics Performance", value: `**Latency:** ${ping}ms | **Framerate:** ${fps} FPS\n**Position Vectors:** \`${location}\``, inline: false },
                    { name: "📝 Submitted UI Log Message", value: `\`\`\`text\n${customMessage}\n\`\`\``, inline: false }
                ],
                footer: { text: "Vercel Secure Routing Gateway Protocol" },
                timestamp: new Date().toISOString()
            }],
            components: jobId !== "" ? [
                {
                    type: 1, 
                    components: [
                        {
                            type: 2, 
                            style: 5, 
                            label: "⚡ Join Target Server Via Browser",
                            url: joinGameUrl
                        }
                    ]
                }
            ] : []
        };

        const discordResponse = await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embedPayload)
        });

        if (!discordResponse.ok) {
            const rawErr = await discordResponse.text();
            return res.status(502).json({ error: 'Discord rejected payload', details: rawErr });
        }

        return res.status(200).json({ status: 'Success', message: 'Payload dispatched smoothly' });

    } catch (error) {
        return res.status(500).json({ error: 'Internal pipeline crash', details: error.message });
    }
}
