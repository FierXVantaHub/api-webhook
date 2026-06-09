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

        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const username       = data.Username        || "N/A";
        const displayName    = data.DisplayName     || username;
        const userId         = data.UserId          || "0";
        const accountAge     = data.AccountAge      != null ? `${data.AccountAge}d` : "N/A";
        const membership     = data.MembershipType  || "None";
        const locale         = data.Locale          || "N/A";
        const executorName   = data.ExecutorUsed    || "N/A";
        const deviceType     = data.DeviceType      || "N/A";
        const gameTitle      = data.GameTitle       || "N/A";
        const placeId        = data.PlaceId         || "0";
        const jobId          = data.JobId           || "";
        const playerCapacity = data.PlayerCapacity  != null ? data.PlayerCapacity : "N/A";
        const currentTeam    = data.Team            || "None";
        const localHealth    = data.Health          != null ? data.Health    : 100;
        const localMaxHealth = data.MaxHealth       != null ? data.MaxHealth : 100;
        const ping           = Number(data.Ping)    || 0;
        const fps            = Number(data.FPS)     || 0;
        const location       = data.Location        || "N/A";
        const customMessage  = data.CustomMessage   || "No message.";

        const estimatedRegion = ping === 0
            ? "❓ No Data"
            : ping < 50
                ? "🇺🇸 US-Optimized"
                : ping < 150
                    ? "🇪🇺 EU-Hop"
                    : "🌏 Global-Route";

        // Avatar fetching
        let checkedAvatar = "https://i.imgur.com/wSTFkRM.png";
        try {
            const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png`;
            const thumbResponse = await fetch(avatarUrl);
            if (thumbResponse.ok) {
                const thumbData = await thumbResponse.json();
                const imageUrl = thumbData?.data?.[0]?.imageUrl;
                if (imageUrl) checkedAvatar = imageUrl;
            }
        } catch (e) {
            console.error("Avatar fetch failed:", e.message);
        }

        const embed = {
            title: "📈 Comprehensive Session Report",
            color: 30719,
            thumbnail: { url: checkedAvatar },
            fields: [
                { name: "👤 User Identity", value: `**Name:** ${username}\n**Display:** ${displayName}\n**ID:** \`${userId}\``, inline: true },
                { name: "⏳ Stats",          value: `**Age:** ${accountAge}\n**Tier:** ${membership}\n**Locale:** ${locale}`,    inline: true },
                { name: "⚙️ Client",         value: `**Executor:** ${executorName}\n**Device:** ${deviceType}`,                 inline: true },
                { name: "🗺️ Environment",    value: `**Game:** ${gameTitle}\n**Place ID:** \`${placeId}\``,                     inline: true },
                { name: "👥 Server",         value: `**Capacity:** ${playerCapacity}\n**Team:** ${currentTeam}`,               inline: true },
                { name: "❤️ Health",         value: `**Status:** ${localHealth}/${localMaxHealth}\n**Region:** ${estimatedRegion}`, inline: true },
                { name: "🆔 Server Instance (Job ID)", value: `\`${jobId || "N/A"}\``, inline: false },
                { name: "📊 Performance",    value: `**Ping:** ${ping}ms | **FPS:** ${fps}\n**Pos:** \`${location}\``,         inline: false },
                { name: "📝 Custom Log",     value: `\`\`\`${customMessage}\`\`\``,                                            inline: false }
            ],
            footer: { text: "Secure Vercel Telemetry Pipeline" },
            timestamp: new Date().toISOString()
        };

        const buttons = [];

        if (jobId) {
            buttons.push({
                type: 2,
                style: 5,
                label: "⚡ Join Target Server",
                url: `https://www.roblox.com/games/start?placeId=${placeId}&instanceId=${jobId}`
            });
            buttons.push({
                type: 2,
                style: 5,
                label: "🎮 Join Player",
                url: `https://www.roblox.com/games/start?placeId=${placeId}&gameInstanceId=${jobId}`
            });
        }

        if (userId && userId !== "0") {
            buttons.push({
                type: 2,
                style: 5,
                label: "👤 View Profile",
                url: `https://www.roblox.com/users/${userId}/profile`
            });
        }

        const payload = {
            username: "Telemetry Engine",
            avatar_url: checkedAvatar,
            embeds: [embed],
            ...(buttons.length > 0 && {
                components: [{ type: 1, components: buttons }]
            })
        };

        // Log payload before sending for debugging
        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        if (!process.env.DISCORD_WEBHOOK) {
            throw new Error("DISCORD_WEBHOOK env variable is not set");
        }

        const webhookRes = await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseText = await webhookRes.text();
        console.log("Discord response:", webhookRes.status, responseText);

        if (!webhookRes.ok) {
            throw new Error(`Discord error ${webhookRes.status}: ${responseText}`);
        }

        return res.status(200).json({ status: 'Success' });

    } catch (error) {
        console.error("Handler error:", error.message);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
            }
        const estimatedRegion = ping === 0
            ? "❓ No Data"
            : ping < 50
                ? "🇺🇸 US-Optimized"
                : ping < 150
                    ? "🇪🇺 EU-Hop"
                    : "🌏 Global-Route";

        // Avatar fetching
        let checkedAvatar = "https://i.imgur.com/wSTFkRM.png";
        try {
            const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png`;
            const thumbResponse = await fetch(avatarUrl);
            if (thumbResponse.ok) {
                const thumbData = await thumbResponse.json();
                const imageUrl = thumbData?.data?.[0]?.imageUrl;
                if (imageUrl) checkedAvatar = imageUrl;
            }
        } catch (e) {
            console.error("Avatar fetch failed:", e.message);
        }

        const embed = {
            title: "📈 Comprehensive Session Report",
            color: 30719,
            thumbnail: { url: checkedAvatar },
            fields: [
                { name: "👤 User Identity", value: `**Name:** ${username}\n**Display:** ${displayName}\n**ID:** \`${userId}\``, inline: true },
                { name: "⏳ Stats",          value: `**Age:** ${accountAge}\n**Tier:** ${membership}\n**Locale:** ${locale}`,    inline: true },
                { name: "⚙️ Client",         value: `**Executor:** ${executorName}\n**Device:** ${deviceType}`,                 inline: true },
                { name: "🗺️ Environment",    value: `**Game:** ${gameTitle}\n**Place ID:** \`${placeId}\``,                     inline: true },
                { name: "👥 Server",         value: `**Capacity:** ${playerCapacity}\n**Team:** ${currentTeam}`,               inline: true },
                { name: "❤️ Health",         value: `**Status:** ${localHealth}/${localMaxHealth}\n**Region:** ${estimatedRegion}`, inline: true },
                { name: "🆔 Server Instance (Job ID)", value: `\`${jobId || "N/A"}\``, inline: false },
                { name: "📊 Performance",    value: `**Ping:** ${ping}ms | **FPS:** ${fps}\n**Pos:** \`${location}\``,         inline: false },
                { name: "📝 Custom Log",     value: `\`\`\`${customMessage}\`\`\``,                                            inline: false }
            ],
            footer: { text: "Secure Vercel Telemetry Pipeline" },
            timestamp: new Date().toISOString()
        };

        // Build buttons — only include ones with valid URLs
        const buttons = [];

        if (jobId) {
            buttons.push({
                type: 2,
                style: 5,
                label: "⚡ Join Target Server",
                url: `https://www.roblox.com/games/start?placeId=${placeId}&instanceId=${jobId}`
            });
            buttons.push({
                type: 2,
                style: 5,
                label: "🎮 Join Player",
                url: `https://www.roblox.com/games/start?placeId=${placeId}&gameInstanceId=${jobId}`
            });
        }

        if (userId && userId !== "0") {
            buttons.push({
                type: 2,
                style: 5,
                label: "👤 View Profile",
                url: `https://www.roblox.com/users/${userId}/profile`
            });
        }

        const payload = {
            username: "Telemetry Engine",
            avatar_url: checkedAvatar,
            embeds: [embed],
            // Only add components if there are valid buttons
            ...(buttons.length > 0 && {
                components: [{
                    type: 1,
                    components: buttons
                }]
            })
        };

        const webhookRes = await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!webhookRes.ok) {
            const errorText = await webhookRes.text();
            console.error("Discord webhook error:", webhookRes.status, errorText);
            console.error("Payload:", JSON.stringify(payload, null, 2));
            throw new Error(`Discord error ${webhookRes.status}: ${errorText}`);
        }

        return res.status(200).json({ status: 'Success' });

    } catch (error) {
        console.error("Handler error:", error.message);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
        const estimatedRegion = ping === 0
            ? "❓ No Data"
            : ping < 50
                ? "🇺🇸 US-Optimized"
                : ping < 150
                    ? "🇪🇺 EU-Hop"
                    : "🌏 Global-Route";

        // Avatar fetching
        let checkedAvatar = "https://i.imgur.com/wSTFkRM.png";
        try {
            const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png`;
            const thumbResponse = await fetch(avatarUrl);
            if (thumbResponse.ok) {
                const thumbData = await thumbResponse.json();
                const imageUrl = thumbData?.data?.[0]?.imageUrl;
                if (imageUrl) checkedAvatar = imageUrl;
            }
        } catch (e) {
            console.error("Avatar fetch failed:", e.message);
        }

        const embed = {
            title: "📈 Comprehensive Session Report",
            color: 30719,
            thumbnail: { url: checkedAvatar },
            fields: [
                { name: "👤 User Identity", value: `**Name:** ${username}\n**Display:** ${displayName}\n**ID:** \`${userId}\``, inline: true },
                { name: "⏳ Stats",          value: `**Age:** ${accountAge}\n**Tier:** ${membership}\n**Locale:** ${locale}`,    inline: true },
                { name: "⚙️ Client",         value: `**Executor:** ${executorName}\n**Device:** ${deviceType}`,                 inline: true },
                { name: "🗺️ Environment",    value: `**Game:** ${gameTitle}\n**Place ID:** \`${placeId}\``,                     inline: true },
                { name: "👥 Server",         value: `**Capacity:** ${playerCapacity}\n**Team:** ${currentTeam}`,               inline: true },
                { name: "❤️ Health",         value: `**Status:** ${localHealth}/${localMaxHealth}\n**Region:** ${estimatedRegion}`, inline: true },
                { name: "🆔 Server Instance (Job ID)", value: `\`${jobId || "N/A"}\``, inline: false },
                { name: "📊 Performance",    value: `**Ping:** ${ping}ms | **FPS:** ${fps}\n**Pos:** \`${location}\``,         inline: false },
                { name: "📝 Custom Log",     value: `\`\`\`${customMessage}\`\`\``,                                            inline: false }
            ],
            footer: { text: "Secure Vercel Telemetry Pipeline" },
            timestamp: new Date().toISOString()
        };

        const payload = {
            username: "Telemetry Engine",
            avatar_url: checkedAvatar,
            embeds: [embed],
            components: [{
                type: 1,
                components: [
                    ...(jobId ? [{
                        type: 2,
                        style: 5,
                        label: "⚡ Join Target Server",
                        url: `https://www.roblox.com/games/start?placeId=${placeId}&instanceId=${jobId}`
                    }] : []),
                    {
                        type: 2,
                        style: 5,
                        label: "🎮 Join Player",
                        url: `https://www.roblox.com/games/start?placeId=${placeId}&gameInstanceId=${jobId}`
                    },
                    {
                        type: 2,
                        style: 5,
                        label: "👤 View Profile",
                        url: `https://www.roblox.com/users/${userId}/profile`
                    }
                ]
            }]
        };

        const webhookRes = await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!webhookRes.ok) {
            const errorText = await webhookRes.text();
            console.error("Discord webhook error:", webhookRes.status, errorText);
            throw new Error(`Discord error ${webhookRes.status}: ${errorText}`);
        }

        return res.status(200).json({ status: 'Success' });

    } catch (error) {
        console.error("Handler error:", error.message);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
        const estimatedRegion = ping < 50
            ? "🇺🇸 US-Optimized"
            : ping < 150
                ? "🇪🇺 EU-Hop"
                : "🌏 Global-Route";

        // Avatar fetching
        let checkedAvatar = "https://i.imgur.com/wSTFkRM.png";
        try {
            const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png`;
            const thumbResponse = await fetch(avatarUrl);
            if (thumbResponse.ok) {
                const thumbData = await thumbResponse.json();
                const imageUrl = thumbData?.data?.[0]?.imageUrl;
                if (imageUrl) checkedAvatar = imageUrl;
            }
        } catch (e) {
            console.error("Avatar fetch failed:", e.message);
        }

        const embed = {
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
        };

        const payload = {
            username: "Telemetry Engine",
            avatar_url: checkedAvatar,
            embeds: [embed],
            // Only include components if jobId exists — empty array causes Discord 400
            ...(jobId && {
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 5,
                        label: "⚡ Join Target Server",
                        url: `https://www.roblox.com/games/start?placeId=${placeId}&instanceId=${jobId}`
                    }]
                }]
            })
        };

        const webhookRes = await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!webhookRes.ok) {
            const errorText = await webhookRes.text();
            console.error("Discord webhook error:", webhookRes.status, errorText);
            throw new Error(`Discord error ${webhookRes.status}: ${errorText}`);
        }

        return res.status(200).json({ status: 'Success' });

    } catch (error) {
        console.error("Handler error:", error.message);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
