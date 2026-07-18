// JEE Main 2026 Normalization & JOSAA Cutoff Dataset

// Marks vs Percentile Data for all 9 April 2026 shifts
const MARKS_VS_PERCENTILE_DATA = [
    { percentile: 99.9, marks: { "2 S1": 255, "2 S2": 248, "4 S1": 258, "4 S2": 262, "5 S1": 266, "5 S2": 261, "6 S1": 249, "6 S2": 268, "8 S2": 238 } },
    { percentile: 99.5, marks: { "2 S1": 215, "2 S2": 208, "4 S1": 218, "4 S2": 222, "5 S1": 227, "5 S2": 221, "6 S1": 209, "6 S2": 229, "8 S2": 198 } },
    { percentile: 99, marks: { "2 S1": 181, "2 S2": 174, "4 S1": 184, "4 S2": 189, "5 S1": 194, "5 S2": 188, "6 S1": 173, "6 S2": 195, "8 S2": 165 } },
    { percentile: 98, marks: { "2 S1": 161, "2 S2": 150, "4 S1": 165, "4 S2": 165, "5 S1": 170, "5 S2": 166, "6 S1": 150, "6 S2": 171, "8 S2": 145 } },
    { percentile: 97, marks: { "2 S1": 149, "2 S2": 135, "4 S1": 153, "4 S2": 154, "5 S1": 154, "5 S2": 152, "6 S1": 136, "6 S2": 158, "8 S2": 133 } },
    { percentile: 96, marks: { "2 S1": 139, "2 S2": 124, "4 S1": 145, "4 S2": 143, "5 S1": 143, "5 S2": 143, "6 S1": 124, "6 S2": 147, "8 S2": 124 } },
    { percentile: 95, marks: { "2 S1": 131, "2 S2": 114, "4 S1": 137, "4 S2": 135, "5 S1": 134, "5 S2": 133, "6 S1": 116, "6 S2": 138, "8 S2": 116 } },
    { percentile: 94, marks: { "2 S1": 124, "2 S2": 107, "4 S1": 131, "4 S2": 128, "5 S1": 126, "5 S2": 124, "6 S1": 109, "6 S2": 131, "8 S2": 109 } },
    { percentile: 93, marks: { "2 S1": 116, "2 S2": 101, "4 S1": 125, "4 S2": 122, "5 S1": 119, "5 S2": 119, "6 S1": 103, "6 S2": 125, "8 S2": 103 } },
    { percentile: 92, marks: { "2 S1": 113, "2 S2": 96, "4 S1": 119, "4 S2": 116, "5 S1": 113, "5 S2": 113, "6 S1": 98, "6 S2": 118, "8 S2": 99 } },
    { percentile: 91, marks: { "2 S1": 108, "2 S2": 93, "4 S1": 114, "4 S2": 111, "5 S1": 107, "5 S2": 108, "6 S1": 91, "6 S2": 113, "8 S2": 95 } },
    { percentile: 90, marks: { "2 S1": 104, "2 S2": 85, "4 S1": 109, "4 S2": 107, "5 S1": 102, "5 S2": 102, "6 S1": 86, "6 S2": 108, "8 S2": 91 } }
];

// Predict Percentile based on Marks and Shift
function predictPercentile(marks, shift) {
    marks = parseFloat(marks);
    if (isNaN(marks)) return 0;
    
    // Bounds check
    if (marks >= 300) return 100;
    if (marks <= -75) return 0;

    // Extrapolate above 99.9%
    const topVal = MARKS_VS_PERCENTILE_DATA[0];
    const topMarks = topVal.marks[shift];
    if (marks >= topMarks) {
        // Linear interpolation between top percentile (99.9) and 100% (300 marks)
        const diffMarks = 300 - topMarks;
        const diffPerc = 100 - 99.9;
        return 99.9 + ((marks - topMarks) / diffMarks) * diffPerc;
    }

    // Extrapolate below 90%
    const bottomVal = MARKS_VS_PERCENTILE_DATA[MARKS_VS_PERCENTILE_DATA.length - 1];
    const bottomMarks = bottomVal.marks[shift];
    if (marks <= bottomMarks) {
        // Linear interpolation between bottom percentile (90.0) and 0% (-75 marks)
        const diffMarks = bottomMarks - (-75);
        const diffPerc = 90 - 0;
        return 90 * ((marks - (-75)) / diffMarks);
    }

    // Interpolate within the table
    for (let i = 0; i < MARKS_VS_PERCENTILE_DATA.length - 1; i++) {
        const pUpper = MARKS_VS_PERCENTILE_DATA[i].percentile;
        const pLower = MARKS_VS_PERCENTILE_DATA[i+1].percentile;
        const mUpper = MARKS_VS_PERCENTILE_DATA[i].marks[shift];
        const mLower = MARKS_VS_PERCENTILE_DATA[i+1].marks[shift];

        if (marks <= mUpper && marks >= mLower) {
            const fraction = (marks - mLower) / (mUpper - mLower);
            return pLower + fraction * (pUpper - pLower);
        }
    }

    return 90.0;
}

// Predict All India Rank (CRL) based on Percentile
function predictRank(percentile) {
    percentile = parseFloat(percentile);
    if (isNaN(percentile)) return 1600000;
    
    // Formula based on 16,00,000 unique candidates projected for 2027
    const totalCandidates = 1600000;
    let rank = ((100 - percentile) / 100) * totalCandidates + 1;
    return Math.max(1, Math.round(rank));
}

// Estimate Category Ranks based on standard distribution ratios
function predictCategoryRanks(air) {
    return {
        "OPEN": air,
        "OBC-NCL": Math.max(1, Math.round(air * 0.275)),
        "EWS": Math.max(1, Math.round(air * 0.115)),
        "SC": Math.max(1, Math.round(air * 0.145)),
        "ST": Math.max(1, Math.round(air * 0.048))
    };
}

// JOSAA Round 6 Closing Ranks Database (Top NITs, IIITs, GFTIs)
// Quotas: OS = Other State, HS = Home State, AI = All India
const COLLEGE_CUTOFFS = [
    // NIT Trichy (National Institute of Technology, Tiruchirappalli)
    { college: "NIT Trichy", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 500, closingRank: 1449 },
    { college: "NIT Trichy", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1000, closingRank: 4569 },
    { college: "NIT Trichy", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1500, closingRank: 4340 },
    { college: "NIT Trichy", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3000, closingRank: 7850 },
    { college: "NIT Trichy", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4000, closingRank: 6900 },
    { college: "NIT Trichy", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6000, closingRank: 9800 },
    { college: "NIT Trichy", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10000, closingRank: 16500 },

    // NIT Surathkal (National Institute of Technology, Karnataka)
    { college: "NIT Surathkal", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 600, closingRank: 1827 },
    { college: "NIT Surathkal", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1100, closingRank: 2800 },
    { college: "NIT Surathkal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2000, closingRank: 5200 },
    { college: "NIT Surathkal", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4200, closingRank: 7500 },
    { college: "NIT Surathkal", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 7000, closingRank: 11200 },

    // NIT Warangal (National Institute of Technology, Warangal)
    { college: "NIT Warangal", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 700, closingRank: 2409 },
    { college: "NIT Warangal", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1200, closingRank: 3530 },
    { college: "NIT Warangal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2500, closingRank: 5800 },
    { college: "NIT Warangal", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4500, closingRank: 8200 },
    { college: "NIT Warangal", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8000, closingRank: 12500 },

    // MNNIT Allahabad (Motilal Nehru National Institute of Technology)
    { college: "MNNIT Allahabad", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1000, closingRank: 4250 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1500, closingRank: 5100 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4000, closingRank: 7900 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6000, closingRank: 10800 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9000, closingRank: 15200 },

    // NIT Rourkela (National Institute of Technology, Rourkela)
    { college: "NIT Rourkela", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1100, closingRank: 3900 },
    { college: "NIT Rourkela", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3000, closingRank: 8200 },
    { college: "NIT Rourkela", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4000, closingRank: 7600 },
    { college: "NIT Rourkela", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8500, closingRank: 14500 },

    // VNIT Nagpur (Visvesvaraya National Institute of Technology)
    { college: "VNIT Nagpur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2000, closingRank: 6800 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3500, closingRank: 8900 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5000, closingRank: 11500 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10000, closingRank: 18500 },

    // NIT Calicut (National Institute of Technology, Calicut)
    { college: "NIT Calicut", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1500, closingRank: 5200 },
    { college: "NIT Calicut", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5500, closingRank: 9500 },
    { college: "NIT Calicut", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8000, closingRank: 13200 },

    // NIT Jaipur (Malaviya National Institute of Technology)
    { college: "NIT Jaipur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1800, closingRank: 4900 },
    { college: "NIT Jaipur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5000, closingRank: 8800 },

    // NIT Kurukshetra
    { college: "NIT Kurukshetra", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2200, closingRank: 7200 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Information Technology", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5000, closingRank: 9800 },

    // NIT Silchar
    { college: "NIT Silchar", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6000, closingRank: 12500 },
    { college: "NIT Silchar", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10000, closingRank: 18900 },

    // NIT Durgapur
    { college: "NIT Durgapur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4000, closingRank: 9500 },

    // NIT Jalandhar
    { college: "NIT Jalandhar", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5000, closingRank: 11000 },

    // NIT Hamirpur
    { college: "NIT Hamirpur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 7000, closingRank: 14500 },

    // NIT Raipur
    { college: "NIT Raipur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6500, closingRank: 13900 },

    // IIIT Allahabad (Indian Institute of Information Technology, Allahabad)
    { college: "IIIT Allahabad", type: "IIIT", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 1500, closingRank: 4800 },
    { college: "IIIT Allahabad", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 4000, closingRank: 8200 },

    // IIIT Gwalior (ABV-IIITM Gwalior)
    { college: "IIIT Gwalior", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 3000, closingRank: 7500 },

    // IIIT Lucknow
    { college: "IIIT Lucknow", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 4000, closingRank: 9200 },

    // IIIT Jabalpur (PDPM IIITDM Jabalpur)
    { college: "IIIT Jabalpur", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 5000, closingRank: 13500 },
    { college: "IIIT Jabalpur", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 10000, closingRank: 18500 },

    // IIIT Pune
    { college: "IIIT Pune", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 6000, closingRank: 14800 },

    // PEC Chandigarh (Punjab Engineering College - GFTI)
    { college: "PEC Chandigarh", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 3000, closingRank: 10500 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 8000, closingRank: 16800 },

    // BIT Mesra (Birla Institute of Technology, Mesra - GFTI)
    { college: "BIT Mesra", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 4000, closingRank: 15400 },
    { college: "BIT Mesra", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 10000, closingRank: 24500 }
];

// Replicate cutoffs for Category seats dynamically if they are not OPEN to save file size
// This uses typical category rank conversion ratios for JOSAA Rounds
function getCategoryCutoffs(category, gender) {
    // If OPEN, return baseline cutoffs
    if (category === "OPEN") {
        return COLLEGE_CUTOFFS.filter(c => c.gender === gender || gender === "All");
    }

    // Multiply ranks by category multiplier to generate category-specific cutoffs
    // OPEN ranks are CRLs. Category ranks for OBC, SC, ST are category specific ranks
    // JOSAA lists cutoffs in Category Rank for OBC, SC, ST, EWS.
    // E.g., General CRL of 1500 for NIT Trichy CSE corresponds to OBC Category Rank ~500.
    const categoryMultipliers = {
        "OBC-NCL": 0.28,
        "EWS": 0.12,
        "SC": 0.15,
        "ST": 0.05
    };

    const multiplier = categoryMultipliers[category] || 1;

    return COLLEGE_CUTOFFS.map(c => {
        return {
            college: c.college,
            type: c.type,
            branch: c.branch,
            quota: c.quota,
            category: category,
            gender: c.gender,
            openingRank: Math.max(1, Math.round(c.openingRank * multiplier)),
            closingRank: Math.max(1, Math.round(c.closingRank * multiplier))
        };
    }).filter(c => c.gender === gender || gender === "All");
}

// Fetch predictions based on inputs
function predictColleges(rank, category, gender, state, typeFilter, branchFilter) {
    rank = parseInt(rank);
    if (isNaN(rank)) return [];

    // Get list of cutoffs for selected category and gender
    const cutoffs = getCategoryCutoffs(category, "Gender-Neutral"); // Baseline support for Gender-Neutral
    
    return cutoffs.filter(c => {
        // 1. Quota filter
        // If quota is HS, it must match the user's home state (represented in code logic)
        // If quota is AI or OS, it's open to everyone
        // For simplicity: If user selects Home State, OS doesn't apply to this college, but HS does.
        // Let's assume:
        // - OS is allowed if the user is NOT from that home state
        // - HS is allowed ONLY if the user is from that home state
        if (c.quota === "HS" && !state) return false; // Needs Home State enabled
        
        // 2. Type Filter
        if (typeFilter !== "All" && c.type !== typeFilter) return false;

        // 3. Branch Filter
        if (branchFilter !== "All" && !c.branch.toLowerCase().includes(branchFilter.toLowerCase())) return false;

        return true;
    }).map(c => {
        // Calculate admission chances
        // High Chance: rank is less than or equal to closingRank * 0.9
        // Medium Chance: rank is between closingRank * 0.9 and closingRank * 1.05
        // Low Chance: rank is between closingRank * 1.05 and closingRank * 1.2
        // No Chance: rank > closingRank * 1.2
        let chance = "No Chance";
        let chanceClass = "badge-rose";
        if (rank <= c.closingRank * 0.9) {
            chance = "High Chance";
            chanceClass = "chance-high";
        } else if (rank <= c.closingRank * 1.05) {
            chance = "Medium Chance";
            chanceClass = "chance-medium";
        } else if (rank <= c.closingRank * 1.2) {
            chance = "Low Chance";
            chanceClass = "chance-low";
        }

        return {
            ...c,
            chance: chance,
            chanceClass: chanceClass
        };
    }).filter(c => c.chance !== "No Chance") // Filter out zero chance options
    .sort((a, b) => a.closingRank - b.closingRank); // Sort by closing rank (demanding to easy)
}

// ================= JEE ADVANCED DATA & LOGIC =================

// expected JEE Advanced marks to CRL rank projections
const ADVANCED_MARKS_VS_RANK = [
    { marks: 324, rank: 5 },
    { marks: 288, rank: 50 },
    { marks: 270, rank: 100 },
    { marks: 252, rank: 250 },
    { marks: 234, rank: 500 },
    { marks: 216, rank: 950 },
    { marks: 198, rank: 1600 },
    { marks: 180, rank: 2700 },
    { marks: 162, rank: 4500 },
    { marks: 144, rank: 6800 },
    { marks: 126, rank: 9800 },
    { marks: 108, rank: 14000 },
    { marks: 90, rank: 19500 },
    { marks: 72, rank: 27000 },
    { marks: 54, rank: 37000 }
];

// Predict expected JEE Advanced rank from marks
function predictAdvancedRank(marks) {
    marks = parseFloat(marks);
    if (isNaN(marks)) return 50000;
    if (marks >= 360) return 1;
    if (marks <= 40) return 50000;

    // Extrapolate above top point (marks: 324, rank: 5)
    if (marks >= ADVANCED_MARKS_VS_RANK[0].marks) {
        const mUpper = 360;
        const mLower = ADVANCED_MARKS_VS_RANK[0].marks;
        const rUpper = 1;
        const rLower = ADVANCED_MARKS_VS_RANK[0].rank;
        const fraction = (marks - mLower) / (mUpper - mLower);
        return Math.max(1, Math.round(rLower - fraction * (rLower - rUpper)));
    }

    // Interpolate in grid
    for (let i = 0; i < ADVANCED_MARKS_VS_RANK.length - 1; i++) {
        const mUpper = ADVANCED_MARKS_VS_RANK[i].marks;
        const mLower = ADVANCED_MARKS_VS_RANK[i+1].marks;
        const rUpper = ADVANCED_MARKS_VS_RANK[i].rank;
        const rLower = ADVANCED_MARKS_VS_RANK[i+1].rank;

        if (marks <= mUpper && marks >= mLower) {
            const fraction = (marks - mLower) / (mUpper - mLower);
            return Math.max(1, Math.round(rLower - fraction * (rLower - rUpper)));
        }
    }

    // Extrapolate below bottom point
    const bottom = ADVANCED_MARKS_VS_RANK[ADVANCED_MARKS_VS_RANK.length - 1];
    const mUpper = bottom.marks;
    const mLower = 40;
    const rUpper = bottom.rank;
    const rLower = 50000;
    if (marks <= mUpper && marks >= mLower) {
        const fraction = (marks - mLower) / (mUpper - mLower);
        return Math.max(1, Math.round(rLower - fraction * (rLower - rUpper)));
    }

    return 50000;
}

// IIT JOSAA Round 6 Cutoffs Database
const IIT_COLLEGES_DATA = [
    // IIT Bombay
    { college: "IIT Bombay", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1, closingRank: 67 },
    { college: "IIT Bombay", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 120, closingRank: 290 },
    { college: "IIT Bombay", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 500, closingRank: 1200 },
    { college: "IIT Bombay", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1100, closingRank: 2100 },
    { college: "IIT Bombay", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1900, closingRank: 3300 },
    
    // IIT Delhi
    { college: "IIT Delhi", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 18, closingRank: 115 },
    { college: "IIT Delhi", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 150, closingRank: 310 },
    { college: "IIT Delhi", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 200, closingRank: 420 },
    { college: "IIT Delhi", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 600, closingRank: 1400 },
    { college: "IIT Delhi", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1200, closingRank: 2200 },

    // IIT Madras
    { college: "IIT Madras", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 40, closingRank: 148 },
    { college: "IIT Madras", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 350, closingRank: 750 },
    { college: "IIT Madras", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 900, closingRank: 1800 },
    { college: "IIT Madras", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1500, closingRank: 2900 },
    { college: "IIT Madras", type: "IIT", branch: "Naval Architecture and Ocean Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3400, closingRank: 5400 },

    // IIT Kanpur
    { college: "IIT Kanpur", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 55, closingRank: 215 },
    { college: "IIT Kanpur", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 450, closingRank: 980 },
    { college: "IIT Kanpur", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1200, closingRank: 2400 },
    { college: "IIT Kanpur", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2000, closingRank: 3500 },
    { college: "IIT Kanpur", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2500, closingRank: 4100 },

    // IIT Kharagpur
    { college: "IIT Kharagpur", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 95, closingRank: 260 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Electronics and Electrical Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 300, closingRank: 720 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 700, closingRank: 1300 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1500, closingRank: 3100 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2200, closingRank: 4500 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Agricultural and Food Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5100, closingRank: 7900 },

    // IIT Roorkee
    { college: "IIT Roorkee", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 120, closingRank: 396 },
    { college: "IIT Roorkee", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 500, closingRank: 1100 },
    { college: "IIT Roorkee", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1000, closingRank: 1900 },
    { college: "IIT Roorkee", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2200, closingRank: 3600 },
    { college: "IIT Roorkee", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3100, closingRank: 4900 },

    // IIT Guwahati
    { college: "IIT Guwahati", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 180, closingRank: 601 },
    { college: "IIT Guwahati", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 480, closingRank: 950 },
    { college: "IIT Guwahati", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 750, closingRank: 1600 },
    { college: "IIT Guwahati", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2500, closingRank: 4300 },
    { college: "IIT Guwahati", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3500, closingRank: 5700 },

    // IIT Hyderabad
    { college: "IIT Hyderabad", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 150, closingRank: 610 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1100, closingRank: 2100 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2800, closingRank: 4800 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 3400, closingRank: 5500 },

    // IIT BHU Varanasi
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 400, closingRank: 1010 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Electronics Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1200, closingRank: 2200 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2200, closingRank: 3400 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4200, closingRank: 6100 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Mining Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7800, closingRank: 9900 },

    // IIT Indore
    { college: "IIT Indore", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 650, closingRank: 1200 },
    { college: "IIT Indore", type: "IIT", branch: "Space Sciences and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1800, closingRank: 2500 },
    { college: "IIT Indore", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4500, closingRank: 6800 },

    // IIT Ropar
    { college: "IIT Ropar", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 800, closingRank: 1800 },
    { college: "IIT Ropar", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3100, closingRank: 5100 },

    // IIT Mandi
    { college: "IIT Mandi", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1100, closingRank: 2700 },
    { college: "IIT Mandi", type: "IIT", branch: "Data Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2100, closingRank: 3400 },

    // IIT Tirupati
    { college: "IIT Tirupati", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2200, closingRank: 3700 },
    { college: "IIT Tirupati", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6200, closingRank: 9200 },

    // IIT Dharwad
    { college: "IIT Dharwad", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2400, closingRank: 4700 },
    { college: "IIT Dharwad", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8200, closingRank: 12800 },

    // IIT Jammu
    { college: "IIT Jammu", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2900, closingRank: 4500 },
    { college: "IIT Jammu", type: "IIT", branch: "Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 9500, closingRank: 14500 }
];

// Predict IIT seats for JEE Advanced rank
function predictIITColleges(rank, category, gender, branchFilter) {
    rank = parseInt(rank);
    if (isNaN(rank)) return [];

    const categoryMultipliers = {
        "OPEN": 1.0,
        "OBC-NCL": 0.28,
        "EWS": 0.12,
        "SC": 0.15,
        "ST": 0.05
    };
    const multiplier = categoryMultipliers[category] || 1;

    return IIT_COLLEGES_DATA.map(c => {
        return {
            college: c.college,
            type: c.type,
            branch: c.branch,
            quota: c.quota,
            category: category,
            gender: c.gender,
            openingRank: Math.max(1, Math.round(c.openingRank * multiplier)),
            closingRank: Math.max(1, Math.round(c.closingRank * multiplier))
        };
    }).filter(c => {
        // Branch filter
        if (branchFilter !== "All" && !c.branch.toLowerCase().includes(branchFilter.toLowerCase())) return false;
        return true;
    }).map(c => {
        let chance = "No Chance";
        let chanceClass = "badge-rose";
        if (rank <= c.closingRank * 0.9) {
            chance = "High Chance";
            chanceClass = "chance-high";
        } else if (rank <= c.closingRank * 1.05) {
            chance = "Medium Chance";
            chanceClass = "chance-medium";
        } else if (rank <= c.closingRank * 1.2) {
            chance = "Low Chance";
            chanceClass = "chance-low";
        }

        return {
            ...c,
            chance: chance,
            chanceClass: chanceClass
        };
    }).filter(c => c.chance !== "No Chance")
    .sort((a, b) => a.closingRank - b.closingRank);
}
