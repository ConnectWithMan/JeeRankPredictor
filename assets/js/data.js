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

// Resolve mark value for shift with fallbacks
function getShiftMarks(rowMarks, shift) {
    if (!rowMarks) return 150;
    if (shift && rowMarks[shift] !== undefined) return rowMarks[shift];
    const vals = Object.values(rowMarks);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    if (!shift || shift === "Moderate" || shift === "Average" || shift === "Balanced") {
        return avg;
    }
    if (shift === "Hard" || shift === "Difficult" || shift === "Toughest") {
        return Math.min(...vals);
    }
    if (shift === "Easy") {
        return Math.max(...vals);
    }
    return avg;
}

// Predict Percentile based on Marks and Shift
function predictPercentile(marks, shift) {
    marks = parseFloat(marks);
    if (isNaN(marks)) return 0;
    
    // Bounds check
    if (marks >= 300) return 100;
    if (marks <= -75) return 0;

    // Extrapolate above 99.9%
    const topVal = MARKS_VS_PERCENTILE_DATA[0];
    const topMarks = getShiftMarks(topVal.marks, shift);
    if (marks >= topMarks) {
        // Linear interpolation between top percentile (99.9) and 100% (300 marks)
        const diffMarks = 300 - topMarks;
        const diffPerc = 100 - 99.9;
        return 99.9 + ((marks - topMarks) / (diffMarks || 1)) * diffPerc;
    }

    // Extrapolate below 90%
    const bottomVal = MARKS_VS_PERCENTILE_DATA[MARKS_VS_PERCENTILE_DATA.length - 1];
    const bottomMarks = getShiftMarks(bottomVal.marks, shift);
    if (marks <= bottomMarks) {
        // Linear interpolation between bottom percentile (90.0) and 0% (-75 marks)
        const diffMarks = bottomMarks - (-75);
        return Math.max(0, 90 * ((marks - (-75)) / (diffMarks || 1)));
    }

    // Interpolate within the table
    for (let i = 0; i < MARKS_VS_PERCENTILE_DATA.length - 1; i++) {
        const pUpper = MARKS_VS_PERCENTILE_DATA[i].percentile;
        const pLower = MARKS_VS_PERCENTILE_DATA[i+1].percentile;
        const mUpper = getShiftMarks(MARKS_VS_PERCENTILE_DATA[i].marks, shift);
        const mLower = getShiftMarks(MARKS_VS_PERCENTILE_DATA[i+1].marks, shift);

        if (marks <= mUpper && marks >= mLower) {
            const fraction = (mUpper === mLower) ? 0 : (marks - mLower) / (mUpper - mLower);
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
        "ST": Math.max(1, Math.round(air * 0.048)),
        "PwD": Math.max(1, Math.round(air * 0.008))
    };
}

// JOSAA Round 6 Closing Ranks Database (Top NITs, IIITs, GFTIs)
// Quotas: OS = Other State, HS = Home State, AI = All India
// JOSAA 2026 Verified Closing Ranks Database (Top NITs, IIITs, GFTIs)
// Quotas: OS = Other State, HS = Home State, AI = All India
// Source: JoSAA Official & Famral 2026 Database
const COLLEGE_CUTOFFS = [
    { college: "Assam University", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 49642, closingRank: 59095 },
    { college: "Assam University", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 59203, closingRank: 69078 },
    { college: "BIT Mesra", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 10675, closingRank: 24247 },
    { college: "BIT Mesra", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 19570, closingRank: 35428 },
    { college: "BIT Mesra", type: "GFTI", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 28580, closingRank: 41133 },
    { college: "BIT Mesra", type: "GFTI", branch: "Electrical and Electronics Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 35570, closingRank: 44295 },
    { college: "BIT Mesra", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 31676, closingRank: 53694 },
    { college: "BIT Mesra", type: "GFTI", branch: "Chemical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 45485, closingRank: 61847 },
    { college: "BIT Mesra", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 46262, closingRank: 64296 },
    { college: "BIT Mesra", type: "GFTI", branch: "Production and Industrial Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 55103, closingRank: 67784 },
    { college: "Central University of Haryana", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 56046, closingRank: 72391 },
    { college: "Central University of Haryana", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 74302, closingRank: 93447 },
    { college: "Central University of Haryana", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 91793, closingRank: 110615 },
    { college: "Central University of Jammu", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 61157, closingRank: 88211 },
    { college: "Central University of Jammu", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 86065, closingRank: 102355 },
    { college: "Central University of Jammu", type: "GFTI", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 54730, closingRank: 102490 },
    { college: "Central University of Rajasthan", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 41747, closingRank: 58353 },
    { college: "Central University of Rajasthan", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 60294, closingRank: 69310 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 14601, closingRank: 18799 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 17882, closingRank: 22530 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 19065, closingRank: 23126 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Aerospace Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 12394, closingRank: 28541 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 25242, closingRank: 31283 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 31788, closingRank: 39900 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Metallurgical and Materials Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 48570, closingRank: 53645 },
    { college: "IIEST Shibpur", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 42928, closingRank: 54593 },
    { college: "IIIT Naya Raipur", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 15883, closingRank: 20333 },
    { college: "IIIT Naya Raipur", type: "GFTI", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 13907, closingRank: 24313 },
    { college: "IIIT Naya Raipur", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 27611, closingRank: 31275 },
    { college: "IITRAM Ahmedabad", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 44387, closingRank: 66311 },
    { college: "IITRAM Ahmedabad", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 42897, closingRank: 71219 },
    { college: "IITRAM Ahmedabad", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 61396, closingRank: 83872 },
    { college: "JNU Delhi", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 18888, closingRank: 36117 },
    { college: "JNU Delhi", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 24755, closingRank: 44723 },
    { college: "Mizoram University", type: "GFTI", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 55919, closingRank: 91673 },
    { college: "Mizoram University", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 73556, closingRank: 98953 },
    { college: "Mizoram University", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 100227, closingRank: 106124 },
    { college: "Mizoram University", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 72213, closingRank: 111490 },
    { college: "NIAMT Ranchi", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 43177, closingRank: 57205 },
    { college: "NIAMT Ranchi", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 54629, closingRank: 67448 },
    { college: "NIAMT Ranchi", type: "GFTI", branch: "Metallurgical and Materials Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 52000, closingRank: 79097 },
    { college: "NIAMT Ranchi", type: "GFTI", branch: "Production and Industrial Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 68240, closingRank: 88846 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 6382, closingRank: 15088 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 13316, closingRank: 16815 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 16039, closingRank: 21759 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 22436, closingRank: 29737 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Aerospace Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 23157, closingRank: 32885 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 29716, closingRank: 41505 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Production and Industrial Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 40644, closingRank: 49647 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 41871, closingRank: 58279 },
    { college: "PEC Chandigarh", type: "GFTI", branch: "Metallurgical and Materials Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 48339, closingRank: 59105 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 51069, closingRank: 62405 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 54544, closingRank: 63644 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Chemical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 57263, closingRank: 64410 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 51752, closingRank: 64597 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Electrical and Electronics Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 63409, closingRank: 67555 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 67471, closingRank: 70294 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 55266, closingRank: 71243 },
    { college: "PTU Puducherry", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 58964, closingRank: 86633 },
    { college: "SGSITS Indore", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 23309, closingRank: 35055 },
    { college: "SGSITS Indore", type: "GFTI", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 35221, closingRank: 39308 },
    { college: "SGSITS Indore", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 48923, closingRank: 54109 },
    { college: "SGSITS Indore", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 45743, closingRank: 55918 },
    { college: "SGSITS Indore", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 61142, closingRank: 64315 },
    { college: "SGSITS Indore", type: "GFTI", branch: "Production and Industrial Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 59982, closingRank: 64976 },
    { college: "SLIET Longowal", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 41329, closingRank: 68425 },
    { college: "SLIET Longowal", type: "GFTI", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 65667, closingRank: 71810 },
    { college: "SLIET Longowal", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 55416, closingRank: 76457 },
    { college: "SLIET Longowal", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 61778, closingRank: 85053 },
    { college: "SLIET Longowal", type: "GFTI", branch: "Chemical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 78411, closingRank: 96358 },
    { college: "SLIET Longowal", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 56593, closingRank: 102053 },
    { college: "SLIET Longowal", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 76875, closingRank: 102616 },
    { college: "Tezpur University", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 56809, closingRank: 65606 },
    { college: "Tezpur University", type: "GFTI", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 61800, closingRank: 71851 },
    { college: "Tezpur University", type: "GFTI", branch: "Electrical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 68309, closingRank: 73682 },
    { college: "Tezpur University", type: "GFTI", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 66563, closingRank: 84683 },
    { college: "Tezpur University", type: "GFTI", branch: "Civil Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 76391, closingRank: 92138 },
    { college: "University of Hyderabad", type: "GFTI", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 16095, closingRank: 36354 },
    { college: "University of Hyderabad", type: "GFTI", branch: "Metallurgical and Materials Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 42156, closingRank: 63187 },
    { college: "IIIT Agartala", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 32682, closingRank: 50027 },
    { college: "IIIT Allahabad", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 4599, closingRank: 7804 },
    { college: "IIIT Allahabad", type: "IIIT", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 6235, closingRank: 8842 },
    { college: "IIIT Bhagalpur", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 23246, closingRank: 48416 },
    { college: "IIIT Bhagalpur", type: "IIIT", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 45815, closingRank: 51316 },
    { college: "IIIT Bhagalpur", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 45956, closingRank: 52650 },
    { college: "IIIT Bhopal", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 15833, closingRank: 30996 },
    { college: "IIIT Bhopal", type: "IIIT", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 22807, closingRank: 38942 },
    { college: "IIIT Bhopal", type: "IIIT", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 31387, closingRank: 40826 },
    { college: "IIIT Bhopal", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 24476, closingRank: 44189 },
    { college: "IIIT Dharwad", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 18465, closingRank: 45308 },
    { college: "IIIT Dharwad", type: "IIIT", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 31938, closingRank: 47501 },
    { college: "IIIT Dharwad", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 27889, closingRank: 48882 },
    { college: "IIIT Guwahati", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 16795, closingRank: 25246 },
    { college: "IIIT Guwahati", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 14767, closingRank: 35680 },
    { college: "IIIT Gwalior", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 6028, closingRank: 8888 },
    { college: "IIIT Gwalior", type: "IIIT", branch: "Electrical and Electronics Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 11317, closingRank: 17551 },
    { college: "IIIT Jabalpur", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 11615, closingRank: 15371 },
    { college: "IIIT Jabalpur", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 10072, closingRank: 19578 },
    { college: "IIIT Jabalpur", type: "IIIT", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 28605, closingRank: 41275 },
    { college: "IIIT Kalyani", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 29376, closingRank: 40390 },
    { college: "IIIT Kalyani", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 28141, closingRank: 50809 },
    { college: "IIIT Kota", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 22322, closingRank: 31149 },
    { college: "IIIT Kota", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 23695, closingRank: 39667 },
    { college: "IIIT Kottayam", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 31452, closingRank: 43031 },
    { college: "IIIT Kottayam", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 28227, closingRank: 43688 },
    { college: "IIIT Kottayam", type: "IIIT", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 25720, closingRank: 45535 },
    { college: "IIIT Lucknow", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 5885, closingRank: 9175 },
    { college: "IIIT Lucknow", type: "IIIT", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 9626, closingRank: 11235 },
    { college: "IIIT Manipur", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 47078, closingRank: 59813 },
    { college: "IIIT Manipur", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 52184, closingRank: 70259 },
    { college: "IIIT Nagpur", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 17386, closingRank: 29369 },
    { college: "IIIT Nagpur", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 22554, closingRank: 37473 },
    { college: "IIIT Pune", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 11564, closingRank: 21116 },
    { college: "IIIT Pune", type: "IIIT", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 15155, closingRank: 23047 },
    { college: "IIIT Pune", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 16641, closingRank: 27027 },
    { college: "IIIT Raichur", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 19969, closingRank: 43701 },
    { college: "IIIT Raichur", type: "IIIT", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 22149, closingRank: 47443 },
    { college: "IIIT Raichur", type: "IIIT", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 37178, closingRank: 48538 },
    { college: "IIIT Ranchi", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 29618, closingRank: 43556 },
    { college: "IIIT Ranchi", type: "IIIT", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 28979, closingRank: 47074 },
    { college: "IIIT Ranchi", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 38570, closingRank: 49255 },
    { college: "IIIT Sonepat", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 18128, closingRank: 37632 },
    { college: "IIIT Sonepat", type: "IIIT", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 39906, closingRank: 43511 },
    { college: "IIIT Sri City", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 11251, closingRank: 23052 },
    { college: "IIIT Sri City", type: "IIIT", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 15838, closingRank: 25035 },
    { college: "IIIT Sri City", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 19041, closingRank: 29473 },
    { college: "IIIT Surat", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 18880, closingRank: 31604 },
    { college: "IIIT Surat", type: "IIIT", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 18982, closingRank: 33559 },
    { college: "IIIT Surat", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 29333, closingRank: 39182 },
    { college: "IIIT Trichy", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 16032, closingRank: 29390 },
    { college: "IIIT Trichy", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 27610, closingRank: 37110 },
    { college: "IIIT Una", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 24800, closingRank: 36689 },
    { college: "IIIT Una", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 37248, closingRank: 44154 },
    { college: "IIIT Vadodara", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 20437, closingRank: 31686 },
    { college: "IIIT Vadodara", type: "IIIT", branch: "Mathematics and Computing", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 18145, closingRank: 35830 },
    { college: "IIIT Vadodara", type: "IIIT", branch: "Information Technology", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 32026, closingRank: 36314 },
    { college: "IIIT Vadodara", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 28128, closingRank: 40423 },
    { college: "IIIT Vadodara (Diu)", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 27227, closingRank: 46054 },
    { college: "IIIT Vadodara (Diu)", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 41100, closingRank: 50829 },
    { college: "IIITDM Kancheepuram", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 11607, closingRank: 20654 },
    { college: "IIITDM Kancheepuram", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 27044, closingRank: 30449 },
    { college: "IIITDM Kancheepuram", type: "IIIT", branch: "Engineering Physics", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 32071, closingRank: 40832 },
    { college: "IIITDM Kancheepuram", type: "IIIT", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 28164, closingRank: 43186 },
    { college: "IIITDM Kurnool", type: "IIIT", branch: "Computer Science and Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 22369, closingRank: 37282 },
    { college: "IIITDM Kurnool", type: "IIIT", branch: "Artificial Intelligence and Data Science", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 29701, closingRank: 43631 },
    { college: "IIITDM Kurnool", type: "IIIT", branch: "Electronics and Communication Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 44494, closingRank: 49854 },
    { college: "IIITDM Kurnool", type: "IIIT", branch: "Mechanical Engineering", quota: "AI", category: "OPEN", gender: "Gender-Neutral", openingRank: 51105, closingRank: 55060 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 7089, closingRank: 10512 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6009, closingRank: 11922 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11164, closingRank: 15284 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11855, closingRank: 18263 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16743, closingRank: 21581 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 19115, closingRank: 22147 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 23945, closingRank: 31290 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 23373, closingRank: 33267 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 32694, closingRank: 36844 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 19755, closingRank: 44428 },
    { college: "MANIT Bhopal", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 43068, closingRank: 45802 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1641, closingRank: 5375 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5676, closingRank: 6553 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2993, closingRank: 6770 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5812, closingRank: 8904 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5915, closingRank: 10605 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9269, closingRank: 11845 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10781, closingRank: 13740 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14605, closingRank: 22289 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16588, closingRank: 23943 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21839, closingRank: 25089 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 20239, closingRank: 34311 },
    { college: "MNNIT Allahabad", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 26921, closingRank: 35470 },
    { college: "NIT Agartala", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 18036, closingRank: 24527 },
    { college: "NIT Agartala", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 24147, closingRank: 30204 },
    { college: "NIT Agartala", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 29362, closingRank: 37813 },
    { college: "NIT Agartala", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39259, closingRank: 44427 },
    { college: "NIT Agartala", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 40795, closingRank: 54037 },
    { college: "NIT Agartala", type: "NIT", branch: "Engineering Physics", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 37768, closingRank: 54125 },
    { college: "NIT Agartala", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 49143, closingRank: 57920 },
    { college: "NIT Agartala", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 50120, closingRank: 60058 },
    { college: "NIT Agartala", type: "NIT", branch: "Biotechnology and Biochemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 57318, closingRank: 61482 },
    { college: "NIT Agartala", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 26261, closingRank: 81209 },
    { college: "NIT Agartala", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 75267, closingRank: 115963 },
    { college: "NIT Agartala", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 87610, closingRank: 172617 },
    { college: "NIT Agartala", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 130832, closingRank: 253448 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12065, closingRank: 22031 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12944, closingRank: 22225 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12105, closingRank: 29157 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 23329, closingRank: 29569 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30763, closingRank: 36963 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 25466, closingRank: 43413 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 29111, closingRank: 44088 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 34659, closingRank: 44755 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 41512, closingRank: 52693 },
    { college: "NIT Andhra Pradesh", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 40583, closingRank: 53408 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 29270, closingRank: 31966 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39830, closingRank: 45717 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 41699, closingRank: 49957 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 47814, closingRank: 54635 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 54272, closingRank: 61716 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 58442, closingRank: 102529 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 89153, closingRank: 159477 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 188517, closingRank: 198769 },
    { college: "NIT Arunachal Pradesh", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 203302, closingRank: 205289 },
    { college: "NIT Calicut", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2405, closingRank: 5769 },
    { college: "NIT Calicut", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5888, closingRank: 8179 },
    { college: "NIT Calicut", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4041, closingRank: 8814 },
    { college: "NIT Calicut", type: "NIT", branch: "Engineering Physics", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6220, closingRank: 10012 },
    { college: "NIT Calicut", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6971, closingRank: 11625 },
    { college: "NIT Calicut", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8756, closingRank: 12016 },
    { college: "NIT Calicut", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12975, closingRank: 18652 },
    { college: "NIT Calicut", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 13978, closingRank: 23354 },
    { college: "NIT Calicut", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 19941, closingRank: 25183 },
    { college: "NIT Calicut", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 26520, closingRank: 28850 },
    { college: "NIT Calicut", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21736, closingRank: 29366 },
    { college: "NIT Calicut", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 26795, closingRank: 34315 },
    { college: "NIT Delhi", type: "NIT", branch: "Artificial Intelligence and Data Science", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5355, closingRank: 7022 },
    { college: "NIT Delhi", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6240, closingRank: 8669 },
    { college: "NIT Delhi", type: "NIT", branch: "Aerospace Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3613, closingRank: 10870 },
    { college: "NIT Delhi", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6111, closingRank: 10936 },
    { college: "NIT Delhi", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9093, closingRank: 11803 },
    { college: "NIT Delhi", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10000, closingRank: 14303 },
    { college: "NIT Delhi", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12197, closingRank: 15419 },
    { college: "NIT Delhi", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16423, closingRank: 20132 },
    { college: "NIT Delhi", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 18873, closingRank: 24823 },
    { college: "NIT Delhi", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 25601, closingRank: 32027 },
    { college: "NIT Delhi", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 25001, closingRank: 33057 },
    { college: "NIT Durgapur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8572, closingRank: 12281 },
    { college: "NIT Durgapur", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12159, closingRank: 14277 },
    { college: "NIT Durgapur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14203, closingRank: 16370 },
    { college: "NIT Durgapur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10019, closingRank: 17358 },
    { college: "NIT Durgapur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14956, closingRank: 19376 },
    { college: "NIT Durgapur", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16462, closingRank: 21927 },
    { college: "NIT Durgapur", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15091, closingRank: 25812 },
    { college: "NIT Durgapur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 24533, closingRank: 31451 },
    { college: "NIT Durgapur", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 26168, closingRank: 33194 },
    { college: "NIT Durgapur", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30944, closingRank: 37141 },
    { college: "NIT Durgapur", type: "NIT", branch: "Biotechnology and Biochemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 37296, closingRank: 42848 },
    { college: "NIT Durgapur", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39170, closingRank: 43724 },
    { college: "NIT Durgapur", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 40756, closingRank: 46937 },
    { college: "NIT Goa", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10504, closingRank: 16638 },
    { college: "NIT Goa", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16290, closingRank: 20060 },
    { college: "NIT Goa", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21319, closingRank: 25142 },
    { college: "NIT Goa", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 26898, closingRank: 26898 },
    { college: "NIT Goa", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 27633, closingRank: 31138 },
    { college: "NIT Goa", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 29777, closingRank: 43967 },
    { college: "NIT Goa", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 20868, closingRank: 46260 },
    { college: "NIT Goa", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 77482, closingRank: 77482 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 7169, closingRank: 13866 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15229, closingRank: 17442 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15215, closingRank: 19290 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9436, closingRank: 25076 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 22526, closingRank: 26772 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 25119, closingRank: 33766 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Engineering Physics", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 26072, closingRank: 36362 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 25957, closingRank: 41614 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 38858, closingRank: 42699 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39778, closingRank: 48638 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30561, closingRank: 49526 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 40392, closingRank: 59319 },
    { college: "NIT Hamirpur", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 28863, closingRank: 71912 },
    { college: "NIT Jaipur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3755, closingRank: 5868 },
    { college: "NIT Jaipur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1522, closingRank: 6143 },
    { college: "NIT Jaipur", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6675, closingRank: 7039 },
    { college: "NIT Jaipur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5081, closingRank: 9309 },
    { college: "NIT Jaipur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8158, closingRank: 10646 },
    { college: "NIT Jaipur", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10973, closingRank: 14833 },
    { college: "NIT Jaipur", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11193, closingRank: 15275 },
    { college: "NIT Jaipur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12091, closingRank: 18965 },
    { college: "NIT Jaipur", type: "NIT", branch: "Engineering Physics", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16328, closingRank: 18979 },
    { college: "NIT Jaipur", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15471, closingRank: 20624 },
    { college: "NIT Jaipur", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 20746, closingRank: 26818 },
    { college: "NIT Jaipur", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 27306, closingRank: 34145 },
    { college: "NIT Jaipur", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 25319, closingRank: 37814 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10687, closingRank: 13411 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12755, closingRank: 14960 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8349, closingRank: 15803 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Information Technology", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 13081, closingRank: 16570 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15412, closingRank: 17389 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 20227, closingRank: 22194 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 7482, closingRank: 26029 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4764, closingRank: 31967 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 28132, closingRank: 32242 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 34017, closingRank: 38712 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30830, closingRank: 43921 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 36074, closingRank: 46085 },
    { college: "NIT Jalandhar", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 40366, closingRank: 46485 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1388, closingRank: 9574 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5358, closingRank: 11833 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8194, closingRank: 13322 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11979, closingRank: 17395 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14163, closingRank: 19619 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12692, closingRank: 23346 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 19581, closingRank: 28909 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 24449, closingRank: 33960 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 29297, closingRank: 42048 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 27464, closingRank: 43238 },
    { college: "NIT Jamshedpur", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 29614, closingRank: 45018 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6460, closingRank: 8701 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6410, closingRank: 9766 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Artificial Intelligence and Data Science", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9235, closingRank: 11264 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Information Technology", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8452, closingRank: 11668 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8776, closingRank: 12323 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12454, closingRank: 13924 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14382, closingRank: 18218 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15231, closingRank: 19006 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 17015, closingRank: 19840 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 19024, closingRank: 25560 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 22637, closingRank: 25943 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21668, closingRank: 32592 },
    { college: "NIT Kurukshetra", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 32302, closingRank: 40050 },
    { college: "NIT Manipur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 31394, closingRank: 43239 },
    { college: "NIT Manipur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 41799, closingRank: 47217 },
    { college: "NIT Manipur", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 50807, closingRank: 52659 },
    { college: "NIT Manipur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 51712, closingRank: 54811 },
    { college: "NIT Manipur", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 61145, closingRank: 62614 },
    { college: "NIT Manipur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 109686, closingRank: 214067 },
    { college: "NIT Manipur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 132896, closingRank: 290546 },
    { college: "NIT Manipur", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 264692, closingRank: 396843 },
    { college: "NIT Manipur", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 342123, closingRank: 479380 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21089, closingRank: 28662 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 29374, closingRank: 34994 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 38506, closingRank: 44300 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 49828, closingRank: 50947 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 57103, closingRank: 58913 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 63515, closingRank: 127321 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 134072, closingRank: 149045 },
    { college: "NIT Meghalaya", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 209832, closingRank: 226660 },
    { college: "NIT Mizoram", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 35052, closingRank: 41038 },
    { college: "NIT Mizoram", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 27017, closingRank: 42029 },
    { college: "NIT Mizoram", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 46477, closingRank: 49700 },
    { college: "NIT Mizoram", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 50462, closingRank: 52894 },
    { college: "NIT Mizoram", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 52110, closingRank: 57367 },
    { college: "NIT Mizoram", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 59041, closingRank: 62780 },
    { college: "NIT Mizoram", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 240343, closingRank: 522326 },
    { college: "NIT Mizoram", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 374892, closingRank: 833130 },
    { college: "NIT Mizoram", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 355950, closingRank: 881407 },
    { college: "NIT Mizoram", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 648065, closingRank: 1132006 },
    { college: "NIT Nagaland", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 34098, closingRank: 42326 },
    { college: "NIT Nagaland", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 42553, closingRank: 47733 },
    { college: "NIT Nagaland", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 46914, closingRank: 52229 },
    { college: "NIT Nagaland", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 55352, closingRank: 59028 },
    { college: "NIT Nagaland", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 62691, closingRank: 64955 },
    { college: "NIT Patna", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11488, closingRank: 17282 },
    { college: "NIT Patna", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10828, closingRank: 18862 },
    { college: "NIT Patna", type: "NIT", branch: "Artificial Intelligence and Data Science", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14835, closingRank: 18895 },
    { college: "NIT Patna", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 18868, closingRank: 21828 },
    { college: "NIT Patna", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 20130, closingRank: 22754 },
    { college: "NIT Patna", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 19686, closingRank: 25462 },
    { college: "NIT Patna", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21981, closingRank: 27263 },
    { college: "NIT Patna", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 28404, closingRank: 34646 },
    { college: "NIT Patna", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30690, closingRank: 37779 },
    { college: "NIT Patna", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 28216, closingRank: 42495 },
    { college: "NIT Patna", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39403, closingRank: 50873 },
    { college: "NIT Puducherry", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9167, closingRank: 19869 },
    { college: "NIT Puducherry", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 18045, closingRank: 26110 },
    { college: "NIT Puducherry", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 27663, closingRank: 34254 },
    { college: "NIT Puducherry", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 33342, closingRank: 40048 },
    { college: "NIT Puducherry", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 44895, closingRank: 52613 },
    { college: "NIT Puducherry", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 35405, closingRank: 65630 },
    { college: "NIT Puducherry", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 62666, closingRank: 87306 },
    { college: "NIT Puducherry", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 110694, closingRank: 169669 },
    { college: "NIT Raipur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14423, closingRank: 16439 },
    { college: "NIT Raipur", type: "NIT", branch: "Information Technology", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15868, closingRank: 18583 },
    { college: "NIT Raipur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 17468, closingRank: 21605 },
    { college: "NIT Raipur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11427, closingRank: 24183 },
    { college: "NIT Raipur", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 23127, closingRank: 28264 },
    { college: "NIT Raipur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 31704, closingRank: 37644 },
    { college: "NIT Raipur", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30479, closingRank: 43044 },
    { college: "NIT Raipur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 35220, closingRank: 45393 },
    { college: "NIT Raipur", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39641, closingRank: 49598 },
    { college: "NIT Raipur", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 42655, closingRank: 53039 },
    { college: "NIT Raipur", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 38952, closingRank: 55851 },
    { college: "NIT Raipur", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39500, closingRank: 66385 },
    { college: "NIT Rourkela", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2651, closingRank: 4266 },
    { college: "NIT Rourkela", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4047, closingRank: 4951 },
    { college: "NIT Rourkela", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2525, closingRank: 5456 },
    { college: "NIT Rourkela", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2295, closingRank: 9635 },
    { college: "NIT Rourkela", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5598, closingRank: 10108 },
    { college: "NIT Rourkela", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3997, closingRank: 12295 },
    { college: "NIT Rourkela", type: "NIT", branch: "Engineering Physics", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8777, closingRank: 14218 },
    { college: "NIT Rourkela", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8541, closingRank: 14593 },
    { college: "NIT Rourkela", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 13710, closingRank: 19804 },
    { college: "NIT Rourkela", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 17099, closingRank: 19887 },
    { college: "NIT Rourkela", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16756, closingRank: 24497 },
    { college: "NIT Rourkela", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21991, closingRank: 26464 },
    { college: "NIT Rourkela", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 24869, closingRank: 27781 },
    { college: "NIT Rourkela", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 36987, closingRank: 40463 },
    { college: "NIT Sikkim", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 18902, closingRank: 31060 },
    { college: "NIT Sikkim", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 31637, closingRank: 35808 },
    { college: "NIT Sikkim", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 37735, closingRank: 44624 },
    { college: "NIT Sikkim", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 45838, closingRank: 52017 },
    { college: "NIT Sikkim", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 53718, closingRank: 61708 },
    { college: "NIT Sikkim", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 47840, closingRank: 118264 },
    { college: "NIT Sikkim", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 170284, closingRank: 195559 },
    { college: "NIT Sikkim", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 203233, closingRank: 269257 },
    { college: "NIT Silchar", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8111, closingRank: 13993 },
    { college: "NIT Silchar", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11298, closingRank: 20008 },
    { college: "NIT Silchar", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 22105, closingRank: 27014 },
    { college: "NIT Silchar", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12477, closingRank: 32817 },
    { college: "NIT Silchar", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 28457, closingRank: 35897 },
    { college: "NIT Silchar", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 23250, closingRank: 38785 },
    { college: "NIT Silchar", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 42478, closingRank: 50179 },
    { college: "NIT Silchar", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 40594, closingRank: 54567 },
    { college: "NIT Silchar", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 37012, closingRank: 67751 },
    { college: "NIT Srinagar", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16699, closingRank: 27594 },
    { college: "NIT Srinagar", type: "NIT", branch: "Information Technology", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 27899, closingRank: 33624 },
    { college: "NIT Srinagar", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30732, closingRank: 35590 },
    { college: "NIT Srinagar", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 35668, closingRank: 43664 },
    { college: "NIT Srinagar", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 34854, closingRank: 47917 },
    { college: "NIT Srinagar", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 48933, closingRank: 54059 },
    { college: "NIT Srinagar", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 50937, closingRank: 59039 },
    { college: "NIT Srinagar", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 56575, closingRank: 61431 },
    { college: "NIT Surathkal", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 678, closingRank: 1954 },
    { college: "NIT Surathkal", type: "NIT", branch: "Information Technology", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2216, closingRank: 3088 },
    { college: "NIT Surathkal", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1002, closingRank: 3331 },
    { college: "NIT Surathkal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1330, closingRank: 3947 },
    { college: "NIT Surathkal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2384, closingRank: 5652 },
    { college: "NIT Surathkal", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 4259, closingRank: 6798 },
    { college: "NIT Surathkal", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8678, closingRank: 12307 },
    { college: "NIT Surathkal", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8002, closingRank: 14997 },
    { college: "NIT Surathkal", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9916, closingRank: 15093 },
    { college: "NIT Surathkal", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15595, closingRank: 22168 },
    { college: "NIT Surathkal", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5319, closingRank: 23975 },
    { college: "NIT Trichy", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 103, closingRank: 1373 },
    { college: "NIT Trichy", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1942, closingRank: 3285 },
    { college: "NIT Trichy", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1034, closingRank: 4015 },
    { college: "NIT Trichy", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2285, closingRank: 5142 },
    { college: "NIT Trichy", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3877, closingRank: 5432 },
    { college: "NIT Trichy", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3558, closingRank: 8754 },
    { college: "NIT Trichy", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6472, closingRank: 13406 },
    { college: "NIT Trichy", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 7900, closingRank: 14015 },
    { college: "NIT Trichy", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12391, closingRank: 18366 },
    { college: "NIT Trichy", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 14318, closingRank: 19641 },
    { college: "NIT Trichy", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10227, closingRank: 20111 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 18722, closingRank: 22140 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 25370, closingRank: 28521 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21048, closingRank: 34387 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 30931, closingRank: 35964 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 35164, closingRank: 39350 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 38221, closingRank: 42525 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 48256, closingRank: 51417 },
    { college: "NIT Uttarakhand", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 54266, closingRank: 62180 },
    { college: "NIT Warangal", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 2099, closingRank: 3178 },
    { college: "NIT Warangal", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 1608, closingRank: 3606 },
    { college: "NIT Warangal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3779, closingRank: 4623 },
    { college: "NIT Warangal", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3433, closingRank: 5416 },
    { college: "NIT Warangal", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3915, closingRank: 6867 },
    { college: "NIT Warangal", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6777, closingRank: 8545 },
    { college: "NIT Warangal", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8199, closingRank: 14049 },
    { college: "NIT Warangal", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10619, closingRank: 17462 },
    { college: "NIT Warangal", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 15742, closingRank: 18989 },
    { college: "NIT Warangal", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10972, closingRank: 26626 },
    { college: "NIT Warangal", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 23925, closingRank: 27258 },
    { college: "SVNIT Surat", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3742, closingRank: 9327 },
    { college: "SVNIT Surat", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 6371, closingRank: 9517 },
    { college: "SVNIT Surat", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10142, closingRank: 11626 },
    { college: "SVNIT Surat", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 11006, closingRank: 14985 },
    { college: "SVNIT Surat", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 10281, closingRank: 15896 },
    { college: "SVNIT Surat", type: "NIT", branch: "Electrical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 16418, closingRank: 20241 },
    { college: "SVNIT Surat", type: "NIT", branch: "Electrical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 20184, closingRank: 24595 },
    { college: "SVNIT Surat", type: "NIT", branch: "Engineering Physics", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21067, closingRank: 26871 },
    { college: "SVNIT Surat", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 22789, closingRank: 28905 },
    { college: "SVNIT Surat", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 20880, closingRank: 32673 },
    { college: "SVNIT Surat", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 23919, closingRank: 36226 },
    { college: "SVNIT Surat", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 33179, closingRank: 44740 },
    { college: "SVNIT Surat", type: "NIT", branch: "Production and Industrial Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 39462, closingRank: 46051 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Computer Science and Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 5989, closingRank: 7419 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Computer Science and Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 3608, closingRank: 8632 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Mathematics and Computing", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 8331, closingRank: 9919 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9446, closingRank: 11029 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Electronics and Communication Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 9693, closingRank: 12731 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Electrical and Electronics Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 12413, closingRank: 16433 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Engineering Physics", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 19189, closingRank: 21741 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Mechanical Engineering", quota: "HS", category: "OPEN", gender: "Gender-Neutral", openingRank: 17302, closingRank: 22724 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Mechanical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 17359, closingRank: 23449 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Chemical Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 21850, closingRank: 32291 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Civil Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 28204, closingRank: 37933 },
    { college: "VNIT Nagpur", type: "NIT", branch: "Metallurgical and Materials Engineering", quota: "OS", category: "OPEN", gender: "Gender-Neutral", openingRank: 37031, closingRank: 41772 }
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
// IIT JOSAA 2026 Verified Round Cutoffs Database (All 23 IITs)
// Source: JoSAA Official & Famral 2026 Database
const IIT_COLLEGES_DATA = [
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 853, closingRank: 1439 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 1534, closingRank: 1923 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2811, closingRank: 3879 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 5306, closingRank: 7798 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4695, closingRank: 8010 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7002, closingRank: 9512 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 9257, closingRank: 9905 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8090, closingRank: 12331 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Production and Industrial Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10861, closingRank: 12340 },
    { college: "IIT BHU Varanasi", type: "IIT", branch: "Biotechnology and Biochemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 11035, closingRank: 13511 },
    { college: "IIT Bhilai", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6201, closingRank: 8886 },
    { college: "IIT Bhilai", type: "IIT", branch: "Artificial Intelligence and Data Science", quota: "AI", gender: "Gender-Neutral", openingRank: 7368, closingRank: 9400 },
    { college: "IIT Bhilai", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8257, closingRank: 9962 },
    { college: "IIT Bhilai", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10295, closingRank: 11934 },
    { college: "IIT Bhilai", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 12106, closingRank: 15260 },
    { college: "IIT Bhilai", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 15101, closingRank: 17880 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3022, closingRank: 4899 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 2982, closingRank: 5273 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3866, closingRank: 6314 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6930, closingRank: 8668 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8080, closingRank: 12064 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 9276, closingRank: 12622 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 13446, closingRank: 15556 },
    { college: "IIT Bhubaneswar", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10752, closingRank: 16868 },
    { college: "IIT Bombay", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1, closingRank: 67 },
    { college: "IIT Bombay", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 175, closingRank: 411 },
    { college: "IIT Bombay", type: "IIT", branch: "Production and Industrial Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 448, closingRank: 834 },
    { college: "IIT Bombay", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 496, closingRank: 1575 },
    { college: "IIT Bombay", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 380, closingRank: 1900 },
    { college: "IIT Bombay", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1785, closingRank: 2638 },
    { college: "IIT Bombay", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1933, closingRank: 2833 },
    { college: "IIT Bombay", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2650, closingRank: 3995 },
    { college: "IIT Bombay", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 385, closingRank: 4417 },
    { college: "IIT Delhi", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 137, closingRank: 338 },
    { college: "IIT Delhi", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1154, closingRank: 1788 },
    { college: "IIT Delhi", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 861, closingRank: 2205 },
    { college: "IIT Delhi", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 1614, closingRank: 2435 },
    { college: "IIT Delhi", type: "IIT", branch: "Production and Industrial Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2235, closingRank: 3402 },
    { college: "IIT Delhi", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2301, closingRank: 3436 },
    { college: "IIT Delhi", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2700, closingRank: 3706 },
    { college: "IIT Delhi", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 179, closingRank: 4901 },
    { college: "IIT Delhi", type: "IIT", branch: "Biotechnology and Biochemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3810, closingRank: 4990 },
    { college: "IIT Delhi", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5544, closingRank: 6145 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2309, closingRank: 4167 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 3764, closingRank: 4938 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2900, closingRank: 5925 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6377, closingRank: 8319 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8231, closingRank: 11303 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 8489, closingRank: 11713 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 11350, closingRank: 13029 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10121, closingRank: 15329 },
    { college: "IIT Dhanbad", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 13483, closingRank: 15480 },
    { college: "IIT Dharwad", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5380, closingRank: 8332 },
    { college: "IIT Dharwad", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 7599, closingRank: 9148 },
    { college: "IIT Dharwad", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4363, closingRank: 9848 },
    { college: "IIT Dharwad", type: "IIT", branch: "Electrical and Electronics Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7859, closingRank: 11099 },
    { college: "IIT Dharwad", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 12723, closingRank: 14696 },
    { college: "IIT Dharwad", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 12335, closingRank: 15332 },
    { college: "IIT Dharwad", type: "IIT", branch: "Biotechnology and Biochemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 14544, closingRank: 17789 },
    { college: "IIT Gandhinagar", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1248, closingRank: 2315 },
    { college: "IIT Gandhinagar", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2635, closingRank: 4007 },
    { college: "IIT Gandhinagar", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5034, closingRank: 7236 },
    { college: "IIT Gandhinagar", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7423, closingRank: 9842 },
    { college: "IIT Gandhinagar", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 9176, closingRank: 12508 },
    { college: "IIT Gandhinagar", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 9873, closingRank: 12873 },
    { college: "IIT Goa", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4323, closingRank: 7024 },
    { college: "IIT Goa", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 6485, closingRank: 8565 },
    { college: "IIT Goa", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8798, closingRank: 11097 },
    { college: "IIT Goa", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 11780, closingRank: 14290 },
    { college: "IIT Guwahati", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 588, closingRank: 822 },
    { college: "IIT Guwahati", type: "IIT", branch: "Artificial Intelligence and Data Science", quota: "AI", gender: "Gender-Neutral", openingRank: 1029, closingRank: 1286 },
    { college: "IIT Guwahati", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 943, closingRank: 1366 },
    { college: "IIT Guwahati", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1556, closingRank: 1988 },
    { college: "IIT Guwahati", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2023, closingRank: 2247 },
    { college: "IIT Guwahati", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3104, closingRank: 5642 },
    { college: "IIT Guwahati", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 4334, closingRank: 6121 },
    { college: "IIT Guwahati", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5865, closingRank: 6915 },
    { college: "IIT Guwahati", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6630, closingRank: 9883 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 339, closingRank: 680 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 745, closingRank: 927 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 854, closingRank: 1714 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 2289, closingRank: 4208 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3169, closingRank: 4767 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4722, closingRank: 5988 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5478, closingRank: 7582 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Production and Industrial Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7437, closingRank: 8762 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7738, closingRank: 8928 },
    { college: "IIT Hyderabad", type: "IIT", branch: "Biotechnology and Biochemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5481, closingRank: 9123 },
    { college: "IIT Indore", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1186, closingRank: 1676 },
    { college: "IIT Indore", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 1759, closingRank: 2136 },
    { college: "IIT Indore", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2579, closingRank: 3350 },
    { college: "IIT Indore", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 6355, closingRank: 7062 },
    { college: "IIT Indore", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5498, closingRank: 7561 },
    { college: "IIT Indore", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7795, closingRank: 9168 },
    { college: "IIT Indore", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8751, closingRank: 11604 },
    { college: "IIT Indore", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10406, closingRank: 12608 },
    { college: "IIT Indore", type: "IIT", branch: "Production and Industrial Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 12653, closingRank: 15409 },
    { college: "IIT Jammu", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4505, closingRank: 7218 },
    { college: "IIT Jammu", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 6331, closingRank: 8786 },
    { college: "IIT Jammu", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 9340, closingRank: 11188 },
    { college: "IIT Jammu", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 11581, closingRank: 14123 },
    { college: "IIT Jammu", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 13666, closingRank: 15070 },
    { college: "IIT Jammu", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 14134, closingRank: 17411 },
    { college: "IIT Jammu", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 16793, closingRank: 18245 },
    { college: "IIT Jammu", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 16416, closingRank: 18637 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2536, closingRank: 3755 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Artificial Intelligence and Data Science", quota: "AI", gender: "Gender-Neutral", openingRank: 3382, closingRank: 5082 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 4429, closingRank: 5718 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6313, closingRank: 7713 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8225, closingRank: 10844 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6077, closingRank: 10981 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10467, closingRank: 13579 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 12158, closingRank: 13969 },
    { college: "IIT Jodhpur", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 13056, closingRank: 15534 },
    { college: "IIT Kanpur", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 32, closingRank: 283 },
    { college: "IIT Kanpur", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 616, closingRank: 1171 },
    { college: "IIT Kanpur", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2320, closingRank: 3178 },
    { college: "IIT Kanpur", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2070, closingRank: 4015 },
    { college: "IIT Kanpur", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3059, closingRank: 4436 },
    { college: "IIT Kanpur", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4812, closingRank: 6533 },
    { college: "IIT Kanpur", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5010, closingRank: 7177 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 217, closingRank: 509 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 1101, closingRank: 1428 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 773, closingRank: 1660 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 840, closingRank: 2190 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2941, closingRank: 4588 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Production and Industrial Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3267, closingRank: 4699 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3710, closingRank: 5297 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3467, closingRank: 5803 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6590, closingRank: 8502 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6645, closingRank: 8816 },
    { college: "IIT Kharagpur", type: "IIT", branch: "Biotechnology and Biochemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8188, closingRank: 10683 },
    { college: "IIT Madras", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 74, closingRank: 151 },
    { college: "IIT Madras", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 231, closingRank: 749 },
    { college: "IIT Madras", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 855, closingRank: 1316 },
    { college: "IIT Madras", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 543, closingRank: 2619 },
    { college: "IIT Madras", type: "IIT", branch: "Aerospace Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1093, closingRank: 3278 },
    { college: "IIT Madras", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 3099, closingRank: 4162 },
    { college: "IIT Madras", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4017, closingRank: 5398 },
    { college: "IIT Madras", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4450, closingRank: 6225 },
    { college: "IIT Mandi", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2532, closingRank: 3762 },
    { college: "IIT Mandi", type: "IIT", branch: "Artificial Intelligence and Data Science", quota: "AI", gender: "Gender-Neutral", openingRank: 3878, closingRank: 4916 },
    { college: "IIT Mandi", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 4300, closingRank: 5251 },
    { college: "IIT Mandi", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5693, closingRank: 7947 },
    { college: "IIT Mandi", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8234, closingRank: 11085 },
    { college: "IIT Mandi", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 7712, closingRank: 11744 },
    { college: "IIT Mandi", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 9510, closingRank: 12307 },
    { college: "IIT Mandi", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10970, closingRank: 13925 },
    { college: "IIT Mandi", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 12086, closingRank: 15702 },
    { college: "IIT Palakkad", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4760, closingRank: 7625 },
    { college: "IIT Palakkad", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8794, closingRank: 10926 },
    { college: "IIT Palakkad", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10775, closingRank: 14360 },
    { college: "IIT Palakkad", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 15458, closingRank: 18196 },
    { college: "IIT Palakkad", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 13296, closingRank: 18397 },
    { college: "IIT Patna", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2184, closingRank: 3635 },
    { college: "IIT Patna", type: "IIT", branch: "Artificial Intelligence and Data Science", quota: "AI", gender: "Gender-Neutral", openingRank: 3491, closingRank: 4574 },
    { college: "IIT Patna", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 4119, closingRank: 5320 },
    { college: "IIT Patna", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6821, closingRank: 6950 },
    { college: "IIT Patna", type: "IIT", branch: "Electrical and Electronics Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6346, closingRank: 7827 },
    { college: "IIT Patna", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 9017, closingRank: 12088 },
    { college: "IIT Patna", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 10245, closingRank: 12425 },
    { college: "IIT Patna", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10388, closingRank: 14174 },
    { college: "IIT Patna", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 13631, closingRank: 16097 },
    { college: "IIT Patna", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 14367, closingRank: 17179 },
    { college: "IIT Roorkee", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 363, closingRank: 587 },
    { college: "IIT Roorkee", type: "IIT", branch: "Artificial Intelligence and Data Science", quota: "AI", gender: "Gender-Neutral", openingRank: 614, closingRank: 847 },
    { college: "IIT Roorkee", type: "IIT", branch: "Electronics and Communication Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 865, closingRank: 1541 },
    { college: "IIT Roorkee", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1591, closingRank: 2269 },
    { college: "IIT Roorkee", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 2748, closingRank: 4251 },
    { college: "IIT Roorkee", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2763, closingRank: 4453 },
    { college: "IIT Roorkee", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4237, closingRank: 5572 },
    { college: "IIT Roorkee", type: "IIT", branch: "Production and Industrial Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5025, closingRank: 5903 },
    { college: "IIT Roorkee", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 5403, closingRank: 7765 },
    { college: "IIT Roorkee", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6582, closingRank: 7977 },
    { college: "IIT Ropar", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 1768, closingRank: 3214 },
    { college: "IIT Ropar", type: "IIT", branch: "Mathematics and Computing", quota: "AI", gender: "Gender-Neutral", openingRank: 3001, closingRank: 4749 },
    { college: "IIT Ropar", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 4932, closingRank: 6599 },
    { college: "IIT Ropar", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8085, closingRank: 10069 },
    { college: "IIT Ropar", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 8590, closingRank: 10879 },
    { college: "IIT Ropar", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 8948, closingRank: 11670 },
    { college: "IIT Ropar", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 11785, closingRank: 14538 },
    { college: "IIT Ropar", type: "IIT", branch: "Metallurgical and Materials Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 11968, closingRank: 14773 },
    { college: "IIT Tirupati", type: "IIT", branch: "Computer Science and Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 2879, closingRank: 6030 },
    { college: "IIT Tirupati", type: "IIT", branch: "Electrical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 6013, closingRank: 9677 },
    { college: "IIT Tirupati", type: "IIT", branch: "Mechanical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 7880, closingRank: 12618 },
    { college: "IIT Tirupati", type: "IIT", branch: "Engineering Physics", quota: "AI", gender: "Gender-Neutral", openingRank: 10927, closingRank: 13132 },
    { college: "IIT Tirupati", type: "IIT", branch: "Chemical Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 10624, closingRank: 15969 },
    { college: "IIT Tirupati", type: "IIT", branch: "Civil Engineering", quota: "AI", gender: "Gender-Neutral", openingRank: 13744, closingRank: 17682 }
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
        "ST": 0.05,
        "PwD": 0.008
    };
    const multiplier = categoryMultipliers[category] || 1;
    const femaleBonus = (gender && gender.includes("Female")) ? 1.25 : 1.0;

    return IIT_COLLEGES_DATA.map(c => {
        return {
            college: c.college,
            type: c.type,
            branch: c.branch,
            quota: c.quota,
            category: category,
            gender: (gender && gender.includes("Female")) ? "Female-only (20% Supernumerary)" : "Gender-Neutral",
            openingRank: Math.max(1, Math.round(c.openingRank * multiplier * femaleBonus)),
            closingRank: Math.max(1, Math.round(c.closingRank * multiplier * femaleBonus))
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

// Global UI Helpers
function toggleMenu() {
    const nav = document.querySelector('header nav');
    if (nav) {
        nav.classList.toggle('open');
    }
}

function toggleAccordion(element) {
    const item = element.closest('.faq-accordion-item') || element.closest('.faq-item');
    if (!item) return;
    const isActive = item.classList.contains('active');
    
    // Close other accordion items
    document.querySelectorAll('.faq-accordion-item, .faq-item').forEach(i => {
        i.classList.remove('active');
    });

    if (!isActive) {
        item.classList.add('active');
    }
}

function filterTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    if (!input || !table) return;

    const filter = input.value.toLowerCase();
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        let visible = false;
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            if (cells[j] && cells[j].innerText.toLowerCase().includes(filter)) {
                visible = true;
                break;
            }
        }
        rows[i].style.display = visible ? '' : 'none';
    }
}


