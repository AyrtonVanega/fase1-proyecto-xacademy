class SkillTimelineDto {
    static build(playerId, records, skills) {
        if (!records || !records.length) {
            return {
                playerId: Number(playerId),
                years: [],
                skills: {}
            };
        }

        const years = records.map(r => r.fifa_version);

        const skillsData = {};

        for (const skill of skills) {
            skillsData[skill] = records.map(r => r[skill] ?? null);
        }

        return {
            playerId: Number(playerId),
            years,
            skills: skillsData
        };
    }
}

module.exports = SkillTimelineDto;
