const versionsDate = document.querySelectorAll(".versions-date");
const versionsDateSource = [
    "2022-01",
    "2022-01",
    "2023-08",
    "2025-04",
    "2025-07",
];
const currentDate = new Date();

function calculateTimeDifference(date1, date2)
{
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();
    
    let years = yearDiff;
    let months = monthDiff;
    
    if (months < 0)
    {
        years--;
        months += 12;
    }
    
    return { years, months, totalDays: diffDays };
}

for (let i = 0;i < versionsDate.length;++i)
{
    const versionDate = new Date(versionsDateSource[versionsDateSource.length - 1 - i]);
    
    const timeDiff = calculateTimeDifference(versionDate, currentDate);
    
    const timeText = [];
    if (timeDiff.years > 0) timeText.push(`${timeDiff.years} year${timeDiff.years !== 1 ? "s" : ""}`);
    if (timeDiff.months > 0) timeText.push(`${timeDiff.months} month${timeDiff.months !== 1 ? "s" : ""}`);
    
    if (versionsDate[i])
    {
        versionsDate[i].textContent = " (" + (timeText.join(", ") || "This month") + " ago)";
    }
    
    console.log(`Version ${i + 1}: ${timeText.join(", ")} ago (${timeDiff.totalDays} total days)`);
}